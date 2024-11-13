
const express = require("express");
const { userRegistration, userLogin } = require("../controller/user.controller");
const { userValidation } = require("../helpers/user.validation");

const userRouter = express.Router();

userRouter
.post("/", userValidation ,userRegistration)
.post("/login", userLogin)

module.exports = {userRouter}