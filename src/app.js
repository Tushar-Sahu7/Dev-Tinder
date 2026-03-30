const express = require("express");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

const connectDB = require("./config/db");
const User = require("./models/user");
const validateSignup = require("./utils/validate");
const { JsonWebTokenError } = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cookieParser());

//Register a user
app.post("/signup", async (req, res) => {
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
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      throw new Error("Invalid credentials.");
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      const token = await jwt.sign({ _id: user._id }, "DEV@Tinder$848");
      res.cookie("token", token);
      res.send("Login sucessful!");
    } else {
      throw new Error("Invalid credentials.");
    }
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

//GET /profile of the loggedIn user
app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

app.post("/sendConnectionRequest", userAuth, async ( req, res ) => {
  try{
    const user = req.user;
    res.send(user.firstName + " sending connection request...");
  } catch (err) {
    res.status(400).send("ERROR:  " + err.message);
  }

})

connectDB()
  .then(() => {
    console.log("Database connection established...");
    app.listen(7777, () => {
      console.log("Server is listening on port 7777...");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!!");
  });
