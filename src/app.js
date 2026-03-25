const express = require("express");
const { adminAuth, userAuth } = require("./Middleware/auth");

const app = express();

app.use("/admin", adminAuth)

app.post("/user/login", (req, res)=>{

})

app.get("/user", userAuth, (req, res)=>{
  console.log("user is loggedIn")
  res.send("le lo user ka data")
})

app.get("/admin/getAllData", (req,res)=>{
  res.send("All data sent")
})

app.get("/admin/deleteUser", (req, res)=>{
  res.send("Deleted a user")
})

app.listen(7777, () => {
  console.log("Server is listening on port 7777...");
});
