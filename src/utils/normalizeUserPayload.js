/** Map legacy SOS request fields to Sequelize model attribute names. */
export function normalizeUserPayload(raw) {
  const o = { ...raw };

  if (o.fullName != null && o.fullname == null) o.fullname = o.fullName;
  delete o.fullName;

  if (o.phoneNumber != null && o.PhoneNumber == null) o.PhoneNumber = o.phoneNumber;
  delete o.phoneNumber;

  if (o.date_of_birth != null && o.dob == null) o.dob = o.date_of_birth;
  delete o.date_of_birth;

  if (o.emergency_contact != null && o.emergencyContact == null) {
    o.emergencyContact = o.emergency_contact;
  }
  delete o.emergency_contact;

  if (o.profile_image != null && o.profilePicture == null) {
    o.profilePicture = o.profile_image;
  }
  delete o.profile_image;

  if (o.gender === "others") o.gender = "other";

  return o;
}
