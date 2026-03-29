const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength: 3,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    min: 18,
  },

  gender: {
    type: String,
    validate(value) {
      if (!["male", "female", "other"].includes(value)) {
        throw new Error("Gender value is not valid.");
      }
    },
    lowercase: true,
  },

  photoUrl: {
    type: String,
  },
  about: {
    type: String,
    default: "This is a default value for about.",
  },
  skills: {
    type: [String],
  },
});

module.exports = mongoose.model("user", userSchema);
