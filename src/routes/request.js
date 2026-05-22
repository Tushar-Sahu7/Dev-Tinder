const express = require("express");
const { userAuth } = require("../middlewares/auth");

const requestRouter = express.Router();

requestRouter.post(
  "/request/send/interested/:toUserId",
  userAuth,
  async (req, res) => {},
);

module.exports = requestRouter;
