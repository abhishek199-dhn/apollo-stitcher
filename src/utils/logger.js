/**
 * Created by abhishek.kumar on 7/12/16.
 */

// @flow

import winston from "winston";
import Constants from "./Constants";

const env = process.env.NODE_ENV || 'development';
const logDir = Constants.LOG_DIR;

const tsFormat = () => (new Date()).toString();

const logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            timestamp: tsFormat,
            colorize: true,
            level: 'debug',
            handleExceptions: true,
            humanReadableUnhandledException: true,
            json: false
        }),
        new (winston.transports.File)({
            level: 'info',
            timestamp: tsFormat,
            filename: `${logDir}/graph-api.log`,
            handleExceptions: true,
            json: true,
            maxsize: 5242880, // 5MB
            maxFiles: 5,
            colorize: false
        })
    ],
    exitOnError: false
});

export default logger;
