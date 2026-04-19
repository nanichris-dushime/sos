import User from "../models/users.js";
import bcrypt from "bcrypt";

export const seedUsers = async () => {
  const password = await bcrypt.hash("defaultpassword123", 10);
  const usersData = [
    {
      fullname: "DUSHIME",
      email: "dushimen@gmail.com",
      PhoneNumber: "0788306030",
      gender: "male",
      status: "active",
      dob: "2005-02-12",
      location: "muhanga",
      emergencyContact: "250792835100",
      password,
      role: "patient",
    },
    {
      fullname: "NANI",
      email: "naichr@gmail.com",
      PhoneNumber: "0788306031",
      gender: "male",
      status: "active",
      dob: "2005-02-12",
      location: "muhanga",
      emergencyContact: "250792835102",
      password,
      role: "patient",
    },
    {
      fullname: "CHRIS",
      email: "dushimechriss@gmail.com",
      PhoneNumber: "0788306032",
      gender: "male",
      status: "active",
      dob: "2005-02-12",
      location: "muhanga",
      emergencyContact: "250792835101",
      password,
      role: "patient",
    },
    {
      fullname: "DR. SMITH",
      email: "smith@gmail.com",
      PhoneNumber: "0788306033",
      gender: "male",
      status: "active",
      dob: "1980-02-12",
      location: "kigali",
      emergencyContact: "250792835103",
      password,
      role: "doctor",
    },
    {
      fullname: "DR. JANE DOE",
      email: "jane@gmail.com",
      PhoneNumber: "0788306034",
      gender: "female",
      status: "active",
      dob: "1985-02-12",
      location: "kigali",
      emergencyContact: "250792835104",
      password,
      role: "doctor",
    },
    {
      fullname: "Administrator",
      email: "admin@outlook.com",
      PhoneNumber: "0788306035",
      gender: "male",
      role: "admin",
      status: "active",
      dob: "1990-01-01",
      location: "kigali",
      emergencyContact: "250792835105",
      password,
    },
  ];

  for (const row of usersData) {
    await User.create(row);
  }
};
