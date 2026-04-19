import sequelize from "../config/db.js";
import DoctorAvailability from "../database/models/doctorAvailability.js";
import { normalizeWeekday } from "../utils/weekday.js";

const canManageAvailabilityRow = (user, row) =>
  user.role === "admin" ||
  (user.role === "doctor" && row.doctorId === user.id);

const canReadAvailability = (user, row) =>
  user.role === "admin" ||
  user.role === "patient" ||
  (user.role === "doctor" && row.doctorId === user.id);

export const listDoctorAvailability = async (req, res) => {
  try {
    const { role, id: userId } = req.user;
    let where = {};

    if (role === "admin") {
      where = {};
    } else if (role === "doctor") {
      where.doctorId = userId;
    } else if (role === "patient") {
      const { doctorId } = req.query;
      if (!doctorId) {
        return res.status(400).json({
          error: "Query parameter doctorId is required for patients",
        });
      }
      where.doctorId = doctorId;
    } else {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (req.query.available === "true" || req.query.available === true) {
      where.available = true;
    }
    if (req.query.available === "false" || req.query.available === false) {
      where.available = false;
    }

    const availability = await DoctorAvailability.findAll({
      where,
      order: [
        [
          sequelize.literal(
            "FIELD(`doctor_availability`.`day`, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')"
          ),
          "ASC",
        ],
      ],
    });
    return res.status(200).json(availability);
  } catch (error) {
    console.error("Error fetching doctor availability:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getDoctorAvailabilityById = async (req, res) => {
  const { id } = req.params;
  try {
    const availability = await DoctorAvailability.findByPk(id);
    if (!availability) {
      return res.status(404).json({ error: "Doctor availability not found" });
    }
    if (canManageAvailabilityRow(req.user, availability)) {
      return res.status(200).json(availability);
    }
    if (canReadAvailability(req.user, availability)) {
      return res.status(200).json(availability);
    }
    return res.status(403).json({ message: "Access denied" });
  } catch (error) {
    console.error("Error fetching doctor availability:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const createDoctorAvailability = async (req, res) => {
  const { doctorId, day, available } = req.body;
  try {
    const normalizedDay = normalizeWeekday(day);
    if (!doctorId || !normalizedDay) {
      return res.status(400).json({
        error: "doctorId and a valid day (Monday–Sunday) are required",
      });
    }

    if (req.user.role === "doctor" && doctorId !== req.user.id) {
      return res.status(403).json({
        message: "Doctors can only add availability for themselves",
      });
    }

    const existing = await DoctorAvailability.findOne({
      where: { doctorId, day: normalizedDay },
    });
    if (existing) {
      return res.status(409).json({
        error: "This doctor already has an availability row for that weekday",
      });
    }

    const row = await DoctorAvailability.create({
      doctorId,
      day: normalizedDay,
      available: available !== undefined ? Boolean(available) : true,
    });
    return res.status(201).json(row);
  } catch (error) {
    console.error("Error creating doctor availability:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updateDoctorAvailability = async (req, res) => {
  const { id } = req.params;
  const updates = { ...req.body };
  delete updates.id;

  try {
    const availability = await DoctorAvailability.findByPk(id);
    if (!availability) {
      return res.status(404).json({ error: "Doctor availability not found" });
    }
    if (!canManageAvailabilityRow(req.user, availability)) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (
      req.user.role === "doctor" &&
      updates.doctorId &&
      updates.doctorId !== req.user.id
    ) {
      return res.status(403).json({
        message: "Doctors cannot reassign availability to another doctor",
      });
    }

    if (updates.day != null) {
      const nd = normalizeWeekday(updates.day);
      if (!nd) {
        return res.status(400).json({ error: "Invalid day (use Monday–Sunday)" });
      }
      updates.day = nd;
    }
    if (updates.available !== undefined) {
      updates.available = Boolean(updates.available);
    }

    const nextDoctorId = updates.doctorId ?? availability.doctorId;
    const nextDay =
      updates.day != null ? updates.day : availability.day;
    if (nextDoctorId !== availability.doctorId || nextDay !== availability.day) {
      const clash = await DoctorAvailability.findOne({
        where: { doctorId: nextDoctorId, day: nextDay },
      });
      if (clash && clash.id !== availability.id) {
        return res.status(409).json({
          error: "This doctor already has an availability row for that weekday",
        });
      }
    }

    await availability.update(updates);
    return res.status(200).json(availability);
  } catch (error) {
    console.error("Error updating doctor availability:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteDoctorAvailability = async (req, res) => {
  const { id } = req.params;
  try {
    const availability = await DoctorAvailability.findByPk(id);
    if (!availability) {
      return res.status(404).json({ error: "Doctor availability not found" });
    }
    if (!canManageAvailabilityRow(req.user, availability)) {
      return res.status(403).json({ message: "Access denied" });
    }
    await availability.destroy();
    return res.status(200).json({ message: "Doctor availability deleted successfully" });
  } catch (error) {
    console.error("Error deleting doctor availability:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
