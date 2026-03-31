const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const validateSignup = require("../utils/validate")

const authRouter = express.Router();


//Register a user
authRouter.post("/signup", async (req, res) => {
  try {
    //validating user data
    validateSignup(req);

    //hashing the password
    const { password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);

    //creating a new instance of the User Model
    const user = new User({ ...req.body, password: passwordHash });
    await user.save();
    res.send("user saved to database sucessfully!");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

//Login a user
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      throw new Error("Invalid credentials.");
    }
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      const token = await user.getJWT();
      res.cookie("token", token, { expires: new Date(Date.now() + 604800000) }); //7 days
      res.send("Login sucessful!");
    } else {
      throw new Error("Invalid credentials.");
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

//Logout a user
authRouter.post("/logout", (req, res) =>{
  res.cookie("token", null, {
    expires: new Date(Date.now())
  })
  res.send("Logged Out sucessfully!")
})

module.exports = authRouter;