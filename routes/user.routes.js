
const express = require("express");
const { userRegistration } = require("../controller/user.controller");
const { userValidation } = require("../helpers/user.validation");

const userRouter = express.Router();

userRouter
.post("/", userValidation ,userRegistration)

module.exports = {userRouter}