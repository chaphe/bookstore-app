const winston = require("winston");

const options = {
    format: winston.format.json(),
    transports: [
        new winston.transports.Console({ level: "info" }),
        new winston.transports.File({ filename: "shopping.txt", level: "info" }),
    ]
};

const logger = winston.createLogger(options);

module.exports = logger;