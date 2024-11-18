
const winston = require('winston');
const morgan = require('morgan');
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
      format: combine(errorFilter(), timestamp(), json())
    }),
    new winston.transports.File({
      filename: 'app-info.log',
      level: 'info',
      format: combine(infoFilter(), timestamp(), json())
    })
  ], exceptionHandlers : [
    new winston.transports.File({filename: 'exception.log'}),
  ],
  rejectionHandlers: [
    new winston.transports.File({filename: 'rejections.log'}) 
  ]
});

const morganlogger = winston.createLogger({
  level: 'http',
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD hh:mm:ss.SSS A',
    }),
    json()
  ),
  transports: [new winston.transports.File({filename: 'request.log'})],
});

const morganMiddleware = morgan(
  function(tokens, req, res){
    return JSON.stringify({
      method: tokens.method(req,res),
      url: tokens.url(req,res),
      status: Number.parseFloat(tokens.status(req,res)),
      content_length: tokens.res(req,res,'content-length'),
      response_time: Number.parseFloat(tokens['response-time'](req,res))
    })
  }
  ,
  {
    stream: {
      // Configure Morgan to use our custom logger with the http severity
      write: (message) => {
        const data = JSON.parse(message)
        morganlogger.http('incoming-request', data)
      },
    },
  }
);

module.exports = {logger, morganMiddleware};