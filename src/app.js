const express = require("express");
const connectDB = require("./config/db");
require("dotenv").config()

const app = express();
const User = require("./models/user")

app.post("/signup", async (req, res) =>{
  //creating a new instance of the User Model
  const user = new User({
    firstName: "Tushar",
    lastName: "Sahu",
    email: "sahutushar532@gmail.com",
    password: "12345678",
    age: 24,
    gender: "Male"
  })

  try{
    await user.save();
    res.send("user saved to database sucessfully!")
  }catch(err){
    res.status(400).send("Error saving user data: " + err.message)
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
