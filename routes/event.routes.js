const express = require("express");
const { eventValidation } = require("../helpers/event.validation");
const { createEvent } = require("../controller/event.controller");

const eventRouter = express.Router();

eventRouter
.post("/", eventValidation, createEvent)