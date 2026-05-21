const validator = require("validator");

const validateSignup = (req) => {
  const { firstName, lastName, email, password } = req.body;
  if (!firstName || !lastName) {
    throw new Error("Name is not valid.");
  } else if (!validator.isEmail(email)) {
    throw new Error("Email is not valid.");
  } else if (!validator.isStrongPassword(password)){
    throw new Error("Strong password is required.")
  }
};

const validateEditProfileData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "emailId",
    "photoUrl",
    "gender",
    "age",
    "about",
    "skills",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );

  return isEditAllowed;
};



module.exports = {validateSignup, validateEditProfileData};