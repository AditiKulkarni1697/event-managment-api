const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({
  title: String,
  date: String,
  time: String,
  desc: String,
  manager: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] }],
  participant_list: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", default: [] },
  ],
});

const EventModel = mongoose.model("event", eventSchema);

module.exports = { EventModel };
