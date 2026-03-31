const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
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
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid email address!");
        }
      },
    },
    password: {
      type: String,
      required: true,
      validate(value) {
        if (!validator.isStrongPassword(value)) {
          throw new Error("Strong password is required!");
        }
      },
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
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid Photo URL!");
        }
      },
    },
    about: {
      type: String,
      default: "This is a default value for about.",
    },
    skills: {
      type: [String],
    },
  },
  {
    timestamps: true,
  },
);

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, "DEV@Tinder$848", {
    expiresIn: "7d",
  });
  return token;
};

userSchema.methods.validatePassword = async function (password) {
  const user = this;
  const passwordHash = user.password;
  const isPasswordValid = await bcrypt.compare(password, passwordHash);
  return isPasswordValid;
}

module.exports = mongoose.model("user", userSchema);
