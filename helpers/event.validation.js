const Joi = require("joi");
const moment = require("moment-timezone");

const schema = Joi.object({
  title: Joi.string().min(3).max(50).required(),
  date: Joi.date().greater("now").required(),
  time: Joi.string()
    .pattern(/^(0?[1-9]|1[0-2]):[0-5][0-9] (AM|PM)$/i)
    .required(),
  desc: Joi.string().optional(),
  participant_list: Joi.array(),
});

async function eventValidation(req, res, next) {
  let { title, date, time, desc, participant_list } = req.body;

  date = convertToISO(date);

  const validationResult = schema.validate({
    title,
    date,
    time,
    desc,
    participant_list,
  });

  if (validationResult.error) {
    return res.status(400).send({
      message: "Invalid event data. Please check your input.",
    });
  }

  next();
}

function convertToISO(dateString) {
  const momentDate = moment(dateString, "DD/MM/YYYY");
  return momentDate
    .tz("Asia/Kolkata")
    .set({ hour: 0, minute: 0, second: 0 })
    .toISOString();
}

module.exports = { eventValidation };
