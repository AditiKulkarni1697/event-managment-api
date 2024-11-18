
const winston = require('winston');
const {combine, timestamp, json, errors} = winston.format;

require("dotenv").config();

const errorFilter = winston.format((info, opts)=>{
  return info.level === 'error' ? info : false;
})

const infoFilter = winston.format((info, opts)=>{
  return info.level === 'info' ? info : false;
})

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(timestamp({
    format: 'YYYY-MM-DD hh:mm:ss.SSS A', // 2022-01-25 03:23:10.350 PM
  }), json()),
  transports: [
    new winston.transports.File({
      filename: 'combined.log'
    }),
    new winston.transports.File({
      filename: 'app-error.log',
      level: 'error',
      format: combine(errors({ stack: true }), timestamp(), json())
    }),
    new winston.transports.File({
      filename: 'app-info.log',
      level: 'info',
      format: combine(infoFilter(), timestamp(), json())
    })
  ],
});

module.exports = logger;