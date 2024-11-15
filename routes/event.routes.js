const express = require("express");
const { eventValidation } = require("../helpers/event.validation");
const { createEvent, updateEvent } = require("../controller/event.controller");
const { Authentication, Authorization, checkUser} = require("../middlewares/auth.middleware");

const eventRouter = express.Router();

eventRouter
.post("/", Authentication, Authorization(["event-manager"]), eventValidation, createEvent)
.patch("/:event_id", Authentication, Authorization(["event-manager"]),checkUser, updateEvent)