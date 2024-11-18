const { sendMail } = require("../helpers/emailSender");
const { getEmailUsingId } = require("../helpers/getEmailUsingId");
const { EventModel } = require("../models/event.model");
const logger = require("../helpers/logger.js");


async function createEvent(req, res, next) {
  const { title, date, time, desc } = req.body;
  const event_manager = req.params.user;
  try {
    const manager = [event_manager._id];
    const event = await EventModel({ title, date, time, desc, manager });
    await event.save();

    res.status(201).send({ message: "Event created successfully" });
  } catch (err) {
    logger
    res.status(500).send({ message: "Internal Server error" });
  }
}

async function updateEvent(req, res, next) {
  const event_id = req.params.event_id;
  const { title, date, time, desc } = req.body;
  try {
    const updatedEvent = await EventModel.findByIdAndUpdate(
      { _id: event_id },
      { title, date, time, desc }
    );

    const participant_emails = await getEmailUsingId(
      updatedEvent.participant_list
    );

    const update_mail = await sendMail(
      participant_emails,
      `The ${updatedEvent.title} has been updated`,
      `Hello there, \n the ${updatedEvent.title} event has been updated.\n The updated date is ${updatedEvent.date} at ${updatedEvent.time}. See you there!`
    );

    res.status(200).send({ message: "Event updated successfully" });
  } catch (err) {
    logger.error("Error message", err.message);
    res.status(500).send({ message: "Internal Server error" });
  }
}

async function participant_register(req, res, next) {
  const event_id = req.params.event_id;

  const user = req.params.user;

  try {
    const event = await EventModel.findOne({ _id: event_id });

    if (!event) {
      return res.status(404).send({ message: "No Event Found" });
    }

    event.participant_list.push(user._id);

    await EventModel.findByIdAndUpdate(
      { _id: event_id },
      { participant_list: event.participant_list }
    );

    const registration_mail = await sendMail(
      [user.email],
      `Registration successful for ${event.title}`,
      `Hello ${user.name}, \n Thank you for registering with the ${event.title} event.\n See you on ${event.date} at ${event.time}`
    );

    res
      .status(200)
      .send({ message: "Participant successfully registered for event" });
  } catch (err) {
    logger.error("Error message", err.message);
    res.status(500).send({ message: "Internal Server Error" });
  }
}

async function getEvent(req, res, next) {
  const event_id = req.query.event_id || null;

  let events;
  try {
    if (event_id) {
      events = await EventModel.find({ _id: event_id });
    }

    events = await EventModel.find();

    if (!events) {
      return res.status(200).send({ message: "No Events created" });
    }

    res.status(200).send({ message: events });
  } catch (err) {
    logger.error("Error message", err.message);
    res.status(500).send({ message: "Internal Server Error" });
  }
}

async function deleteEvent(req, res, next) {
  const event_id = req.params.event_id;

  try {
    const event = await EventModel.findOne({ _id: event_id });

    if (!event) {
      return res.status(404).send({ message: "Event Not Found" });
    }

    const deletedEvent = await EventModel.findByIdAndDelete({ _id: event_id });

    const participant_emails = await getEmailUsingId(
      deletedEvent.participant_list
    );

    const delete_mail = await sendMail(
      participant_emails,
      `The ${deletedEvent.title} event has been deleted`,
      `Hello there, \n We regret to inform that ${deletedEvent.title} event has been deleted.\n Kindly take the note`
    );

    console.log("delete mail in deleteEvent", deleteEvent);

    res.status(200).send({ message: "Event deleted successfully" });
  } catch (err) {
    logger.error("Error message", err.message);
    res.status(500).send({ message: "Internal Server Error" });
  }
}

//1. check email sending when updated and deleted the event
//2. add error logging and success logging
//3. test cases
//4. security during form submission, api call limit per sec

module.exports = {
  createEvent,
  updateEvent,
  participant_register,
  getEvent,
  deleteEvent,
};
