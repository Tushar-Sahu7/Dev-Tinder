const express = require("express");
const connectDB = require("./config/db");
require("dotenv").config();

const app = express();
const User = require("./models/user");
app.use(express.json());

//Register a user
app.post("/signup", async (req, res) => {
  //creating a new instance of the User Model
  const user = new User(req.body);

  try {
    await user.save();
    res.send("user saved to database sucessfully!");
  } catch (err) {
    res.status(400).send("Error saving user data: " + err.message);
  }
});

//find user by email
app.get("/user", async (req, res) => {
  const userEmail = req.body.email;
  try {
    const users = await User.find({ email: userEmail });
    if (users.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.send("Something went wrong: " + err.message);
  }
});

//Feed API - GET /feed - get all the users from the database
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find();
    if (users.length === 0) {
      res.status(404).send("Users not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Something went wrong: " + err.message);
  }
});

//Delete a user from the database
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    await User.findByIdAndDelete(userId);
    res.send("User deleted sucessfully");
  } catch (err) {
    res.status(400).send("Something went wrong: " + err.message);
  }
});

//update a user's data in the database
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;
  try {
    const AlLOWED_UPDATES = [
      "userId",
      "firstName",
      "lastName",
      "password",
      "age",
      "gender",
      "photoUrl",
      "about",
      "skills",
    ];
    const isAllowedUpdate = Object.keys(data).every((k) =>
      AlLOWED_UPDATES.includes(k),
    );
    if (!isAllowedUpdate) {
      throw new Error("Invalid update fields provided");
    }
    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "before",
      runValidators: true,
    });
    console.log(user);
    res.send("User updated sucessfully");
  } catch (err) {
    res.status(400).send("update failed : " + err.message);
  }
});

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
