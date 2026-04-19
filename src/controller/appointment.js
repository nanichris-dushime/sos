import Appointment from "../database/models/appointments.js";
import DoctorAvailability from "../database/models/doctorAvailability.js";
import User from "../database/models/users.js";
import Notification from "../database/models/notifications.js";
import { normalizeWeekday } from "../utils/weekday.js";

const WEEKDAY_FROM_DATE = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

/** YYYY-MM-DD → weekday name (local calendar date). */
const weekdayNameFromDateOnly = (appointmentDate) => {
  if (appointmentDate == null || String(appointmentDate).trim() === "") return null;
  const parts = String(appointmentDate).trim().split("-");
  if (parts.length !== 3) return null;
  const y = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  const d = parseInt(parts[2], 10);
  if (Number.isNaN(y) || Number.isNaN(m) || Number.isNaN(d)) return null;
  const dt = new Date(y, m - 1, d);
  if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d) {
    return null;
  }
  return WEEKDAY_FROM_DATE[dt.getDay()];
};

/** Next calendar YYYY-MM-DD (local) that falls on `dayName` (includes today if it matches). */
const nextDateForWeekdayLocal = (dayName) => {
  const nd = normalizeWeekday(dayName);
  if (!nd) return null;
  const wantDow = WEEKDAY_FROM_DATE.indexOf(nd);
  if (wantDow < 0) return null;
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const diff = (wantDow - start.getDay() + 7) % 7;
  start.setDate(start.getDate() + diff);
  const y = start.getFullYear();
  const mo = String(start.getMonth() + 1).padStart(2, "0");
  const da = String(start.getDate()).padStart(2, "0");
  return `${y}-${mo}-${da}`;
};

const looksLikeUUID = (value) =>
  typeof value === "string" &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value.trim()
  );

/** First non-empty string among candidates (supports alternate JSON key casing). */
const firstNonEmpty = (...vals) => {
  for (const v of vals) {
    if (v != null && String(v).trim() !== "") return String(v).trim();
  }
  return "";
};

/** Do not fail booking if legacy `notifications` schema blocks inserts. */
const safeNotify = async (payload) => {
  try {
    await Notification.create(payload);
  } catch (err) {
    console.error(
      "Notification.create failed:",
      err.parent?.sqlMessage || err.message
    );
  }
};

const canViewAppointment = (user, appointment) => {
  if (user.role === "admin") return true;
  if (user.role === "doctor") return appointment.doctorId === user.id;
  if (user.role === "patient") return appointment.patientId === user.id;
  return false;
};

const canManageAppointment = (user, appointment) =>
  user.role === "admin" ||
  (user.role === "doctor" && appointment.doctorId === user.id);

export const listAppointments = async (req, res) => {
  try {
    const { role, id: userId } = req.user;

    const filter = {};
    if (role === "doctor") filter.doctorId = userId;
    else if (role === "patient") filter.patientId = userId;
    else if (role !== "admin") return res.status(403).json({ message: "Forbidden" });

    const appointments = await Appointment.findAll({
      where: filter,
      order: [
        ["appointmentDate", "ASC"],
        ["appointmentTime", "ASC"],
      ],
    });

    return res.status(200).json(appointments);
  } catch (err) {
    console.error("listAppointments failed:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);

    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    if (!canViewAppointment(req.user, appointment)) {
      return res.status(403).json({ message: "Access denied" });
    }

    return res.status(200).json(appointment);
  } catch (err) {
    console.error("getAppointmentById failed:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const createAppointment = async (req, res) => {
  const body = req.body;
  const { patientId, status } = body;
  const reason = firstNonEmpty(body.reason, body.Reason);

  try {
    if (!reason) {
      return res.status(400).json({ error: "reason is required" });
    }

    let doctorId;
    let availabilityDay;
    let appointmentDate;
    let timeStr;

    // --- Flow A: patient-friendly — doctorId + day + time (patient id comes from JWT) ---
    const doctorIdInput = firstNonEmpty(body.doctorId, body.DoctorId);
    const dayInput = firstNonEmpty(body.day, body.Day);
    const timeRaw = firstNonEmpty(
      body.time,
      body.Time,
      body.appointmentTime,
      body.AppointmentTime,
      body.appointment_time
    );

    if (doctorIdInput && dayInput && timeRaw) {
      if (!looksLikeUUID(doctorIdInput)) {
        return res.status(400).json({ error: "doctorId must be a valid UUID" });
      }
      const nd = normalizeWeekday(dayInput);
      if (!nd) {
        return res.status(400).json({ error: "day must be a weekday (Monday–Sunday)" });
      }

      const availabilityRow = await DoctorAvailability.findOne({
        where: { doctorId: doctorIdInput, day: nd, available: true },
      });
      if (!availabilityRow) {
        return res.status(404).json({
          error: "No open availability for that doctor on the chosen day",
        });
      }

      doctorId = availabilityRow.doctorId;
      availabilityDay = availabilityRow.day;
      timeStr = timeRaw;

      if (body.appointmentDate != null && String(body.appointmentDate).trim() !== "") {
        appointmentDate = String(body.appointmentDate).trim();
        const w = weekdayNameFromDateOnly(appointmentDate);
        if (!w || normalizeWeekday(w) !== normalizeWeekday(availabilityDay)) {
          return res.status(400).json({
            error: `appointmentDate must fall on ${availabilityDay}, or omit it to use the next ${availabilityDay}`,
            expectedWeekday: availabilityDay,
            actualWeekday: w,
          });
        }
      } else {
        appointmentDate = nextDateForWeekdayLocal(availabilityDay);
        if (!appointmentDate) {
          return res.status(400).json({ error: "Could not resolve a calendar date for that day" });
        }
      }
    } else if (
      firstNonEmpty(body.availabilityId) &&
      body.appointmentDate != null &&
      String(body.appointmentDate).trim() !== "" &&
      timeRaw
    ) {
      // --- Flow B: explicit availability row + calendar date ---
      const aid = firstNonEmpty(body.availabilityId);
      if (!looksLikeUUID(aid)) {
        return res.status(400).json({ error: "availabilityId must be a valid UUID" });
      }

      const availabilityRow = await DoctorAvailability.findByPk(aid);
      if (!availabilityRow) {
        return res.status(404).json({ error: "Availability record not found" });
      }
      if (!availabilityRow.available) {
        return res.status(400).json({
          error: "That weekday availability is turned off; choose another slot or day",
        });
      }

      doctorId = availabilityRow.doctorId;
      availabilityDay = availabilityRow.day;
      appointmentDate = String(body.appointmentDate).trim();
      timeStr = timeRaw;

      const dateWeekday = weekdayNameFromDateOnly(appointmentDate);
      if (!dateWeekday) {
        return res.status(400).json({ error: "appointmentDate must be YYYY-MM-DD" });
      }
      if (normalizeWeekday(availabilityDay) !== dateWeekday) {
        return res.status(400).json({
          error: `appointmentDate must fall on ${availabilityDay} for this availability record`,
          expectedWeekday: availabilityDay,
          actualWeekday: dateWeekday,
        });
      }
    } else {
      const missingA = [];
      if (!doctorIdInput) missingA.push("doctorId");
      if (!dayInput) missingA.push("day");
      if (!timeRaw) missingA.push("time (or appointmentTime)");

      const missingB = [];
      if (!firstNonEmpty(body.availabilityId)) missingB.push("availabilityId");
      if (body.appointmentDate == null || String(body.appointmentDate).trim() === "") {
        missingB.push("appointmentDate");
      }
      if (!timeRaw) missingB.push("appointmentTime (or time)");

      return res.status(400).json({
        error: "Incomplete booking payload",
        quickBook: {
          required: ["doctorId", "day", "time", "reason"],
          optional: ["appointmentDate"],
          missing: missingA,
        },
        explicitAvailability: {
          required: ["availabilityId", "appointmentDate", "appointmentTime (or time)", "reason"],
          missing: missingB,
        },
        tip: "Send JSON with double-quoted keys and commas between fields. Content-Type: application/json",
        receivedKeys: body && typeof body === "object" ? Object.keys(body) : [],
      });
    }

    let finalPatientId = patientId;
    let finalStatus = status;

    if (req.user.role === "patient") {
      finalPatientId = req.user.id;
      if (patientId && patientId !== req.user.id) {
        return res.status(403).json({
          message: "Patients can only book appointments for themselves",
        });
      }

      if (status && status !== "pending") {
        return res.status(403).json({ message: "Patients cannot set appointment status" });
      }
      finalStatus = "pending";

      const doctor = await User.findByPk(doctorId);
      if (!doctor || doctor.role !== "doctor") {
        return res.status(400).json({ error: "Invalid or inactive doctor" });
      }

      const appointment = await Appointment.create({
        doctorId,
        patientId: finalPatientId,
        appointmentDate,
        appointmentTime: timeStr,
        reason: String(reason).trim(),
        status: finalStatus,
      });

      await safeNotify({
        userId: doctorId,
        message: `New appointment request on ${appointmentDate} (${availabilityDay}) at ${timeStr} is waiting for your approval.`,
        isRead: false,
      });

      return res.status(201).json(appointment);
    }

    if (req.user.role === "admin") {
      if (!finalPatientId) {
        return res.status(400).json({ error: "patientId is required for admin bookings" });
      }

      finalStatus = finalStatus || "pending";

      const appointment = await Appointment.create({
        doctorId,
        patientId: finalPatientId,
        appointmentDate,
        appointmentTime: timeStr,
        reason: String(reason).trim(),
        status: finalStatus,
      });

      await safeNotify({
        userId: doctorId,
        message: `An admin scheduled an appointment for ${appointmentDate} (${availabilityDay}) at ${timeStr}. Status: ${finalStatus}.`,
        isRead: false,
      });

      return res.status(201).json(appointment);
    }

    return res.status(403).json({ message: "Forbidden" });
  } catch (err) {
    console.error("createAppointment failed:", err);
    const sqlMsg = err?.parent?.sqlMessage;
    return res.status(500).json({
      error: "Internal server error",
      ...(sqlMsg ? { detail: sqlMsg } : {}),
    });
  }
};

export const updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    const { id: _ignored, ...safeUpdates } = req.body;
    await appointment.update(safeUpdates);

    return res.status(200).json(appointment);
  } catch (err) {
    console.error("updateAppointment failed:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const approveAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    if (!canManageAppointment(req.user, appointment)) {
      return res.status(403).json({ message: "Access denied" });
    }
    if (appointment.status !== "pending") {
      return res.status(400).json({ error: "Only pending appointments can be approved" });
    }

    await appointment.update({ status: "scheduled" });

    const doctor = await User.findByPk(appointment.doctorId);
    const doctorName = doctor?.fullname ? ` with Dr. ${doctor.fullname}` : "";
    await safeNotify({
      userId: appointment.patientId,
      message: `Your appointment${doctorName} on ${appointment.appointmentDate} at ${appointment.appointmentTime} has been confirmed.`,
      isRead: false,
    });

    return res.status(200).json(appointment);
  } catch (err) {
    console.error("approveAppointment failed:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }
    if (!canManageAppointment(req.user, appointment)) {
      return res.status(403).json({ message: "Access denied" });
    }
    if (["completed", "cancelled"].includes(appointment.status)) {
      return res.status(400).json({ error: "This appointment cannot be cancelled" });
    }

    await appointment.update({ status: "cancelled" });
    return res.status(200).json(appointment);
  } catch (err) {
    console.error("cancelAppointment failed:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: "Appointment not found" });
    }

    await appointment.destroy();
    return res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (err) {
    console.error("deleteAppointment failed:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
