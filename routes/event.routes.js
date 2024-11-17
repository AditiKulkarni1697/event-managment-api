const express = require("express");
const { eventValidation } = require("../helpers/event.validation");
const { createEvent, updateEvent, participant_register, deleteEvent, getEvent } = require("../controller/event.controller");
const { Authentication, Authorization, checkIfAuthor} = require("../middlewares/auth.middleware");

const eventRouter = express.Router();

eventRouter
.post("/", Authentication, Authorization(["event-manager"]), eventValidation, createEvent)
.put("/:event_id", Authentication, Authorization(["event-manager"]),checkIfAuthor, updateEvent)
.patch("/participant/:event_id", Authentication, participant_register)
.get("/", Authentication, getEvent)
.delete("/:id", Authentication, Authorization(["event-manager"]), checkIfAuthor,deleteEvent)

module.exports = {eventRouter}