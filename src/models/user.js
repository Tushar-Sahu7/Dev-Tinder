const mongoose = require("mongoose");
const validator = require("validator");

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
    validate(value){
      if(!validator.isEmail(value)){
        throw new Error("Invalid email address!")
      }
    }
  },
  password: {
    type: String,
    required: true,
    validate(value){
      if(!validator.isStrongPassword(value)){
        throw new Error("Strong password is required!")
      }
    }
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
    validate(value){
      if(!validator.isURL(value)){
        throw new Error("Invalid Photo URL!")
      }
    }
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
