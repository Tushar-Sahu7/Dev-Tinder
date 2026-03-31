const express = require("express");
const validator = require("validator");
const bcrypt = require("bcrypt");
const { userAuth } = require("../middlewares/auth");

const profileRouter = express.Router();

//GET /profile of the loggedIn user
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

//PATCH /profile/edit of the loggedIn user
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const ALLOWED_UPDATES = [
      "firstName",
      "lastName",
      "age",
      "gender",
      "about",
      "skills",
    ];
    const isProfileFieldEditAllowed = Object.keys(req.body).every((key) =>
      ALLOWED_UPDATES.includes(key),
    );
    if (!isProfileFieldEditAllowed) {
      throw new Error("Invalid profile edit request!");
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));
    await loggedInUser.save();
    res.send("Profile updated sucessfully!");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

//PATCH /profile/password of the loggedIn user
profileRouter.patch("/profile/password", userAuth, async (req, res) => {
  try {const loggedInUser = req.user;
  const { password, newPassword } = req.body;
  const isPasswordValid = await loggedInUser.validatePassword(password)
  if (!isPasswordValid) {
    throw new Error("Invalid Credential");
  }
  const isNewPasswordStrong = validator.isStrongPassword(newPassword);
  if (!isNewPasswordStrong) {
    throw new Error("Please provide a strong password.");
  }
  loggedInUser.password = await bcrypt.hash(newPassword, 10);
  await loggedInUser.save();
  res.send("Password changed successfully!");}
  catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

module.exports = profileRouter;
