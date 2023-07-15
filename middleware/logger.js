// const winston = require("winston");
// const logger = winston.createLogger({
//   level: "info",
//   format: winston.format.combine(
//     winston.format.timestamp(), 
//     winston.format.simple()
//   ),
//   transports: [
//     new winston.transports.File({
//       level: "info",
//       filename: "./logs/reqLog.log",
//     }),
//   ],
// });

// module.exports=logger
const {format}=require('date-fns')
const {v4:uuid}=require('uuid')
const fs =require('fs')
const fsPromises=require('fs').promises
const path =require('path')

const logEvents = async (message, logFileName) => {
  const dateTime = format(new Date(), "yyyyMMdd \t HH:mm:ss");
  const logItem = `${dateTime} \t ${uuid} \t ${message} \n`;

  try {
    if (!fs.existsSync(path.join(__dirname, "..","logs"))) {
        await fsPromises.mkdir(__dirname, "..","logs");
    }
    await fsPromises.appendFile(path.join(__dirname, "..","logs",logFileName),logItem);
  } catch (e) {
    console.log(e);
  }
};

const logger = (req,res,next)=>{
    logEvents(`${req.method} \t ${req.url} \t ${req.headers.origin}`,'reqLog.log')
    console.log(`${req.method} \t ${req.path}`);
    next()
}

module.exports={
    logEvents,
    logger
}

