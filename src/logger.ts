import winston from 'winston';
import fs from 'node:fs';
import { isProduction } from './utils/env';

let date = new Date();

let dateStr =
    `${date.getFullYear()}-` +
    (`0${date.getMonth() + 1}`).slice(-2) + '-' +
    (`0${date.getDate()}`).slice(-2) + '_' +
    (`0${date.getHours()}`).slice(-2) + '-' +
    (`0${date.getMinutes()}`).slice(-2) + '-' +
    (`0${date.getSeconds()}`).slice(-2);

winston.addColors({meta: 'cyan'});
const colorizer = winston.format.colorize();

// Create a custom format
const timestampFormat = winston.format.printf(({level, message, timestamp, ...metadata}) => {
    let msg = `${timestamp} - ${level}: ${message} `;

    // Append all other metadata to the message
    if (Object.keys(metadata).length > 0) {
        msg += JSON.stringify(metadata, null, 4);
    }

    return msg;
});

const consoleFormat = winston.format.printf(({level, message, timestamp, ...metadata}) => {
    let msg = `${level}: ${message} `;

    // Append all other metadata to the message
    if (Object.keys(metadata).length > 0) {
        msg += colorizer.colorize('meta', JSON.stringify(metadata, null, 4));
    }

    return msg;
});

export const logger = winston.createLogger({
    level: 'debug',  // Set your desired default log level here
    format: winston.format.combine(
        winston.format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss',
        }),
        timestampFormat,
    ),
    transports: [
        new winston.transports.File({filename: `logs/${dateStr}.error.log`, level: 'error'}),
        new winston.transports.File({filename: `logs/${dateStr}.log`}),
    ],
});

// For development, also log out to console, not just to files
if (!isProduction()) {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize({all: true}),
            consoleFormat,
        ),
    }));
}
