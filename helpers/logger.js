
const winston = require('winston');

require("dotenv").config();

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(colorize({ all: true }),timestamp(), json()),
  transports: [new winston.transports.File({
    filename: 'combined.log',
  }),],
});

module.exports = logger;