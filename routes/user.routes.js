
const express = require("express");
const { userRegistration, userLogin, updateUserRole } = require("../controller/user.controller");
const { userValidation } = require("../helpers/user.validation");
const { Authentication, Authorization } = require("../middlewares/auth.middleware");

const userRouter = express.Router();

userRouter
.post("/", userValidation ,userRegistration)
.post("/login", userLogin)
.patch("/role",Authentication, Authorization(["admin"]), updateUserRole)

module.exports = {userRouter}