import { TransformableInfo } from 'logform';
import { stripVTControlCharacters } from 'node:util';
import winston from 'winston';
import { isProduction } from './utils/env.js';

// Date for log file
const date = new Date();
const dateStr = `${date.getFullYear()}-` + (`0${date.getMonth() + 1}`).slice(-2) + '-' + (`0${date.getDate()}`).slice(-2) + '_' + (`0${date.getHours()}`).slice(-2) + '-' + (`0${date.getMinutes()}`).slice(-2) + '-' + (`0${date.getSeconds()}`).slice(-2);

// Meta colorization
winston.addColors({meta: 'cyan'});
const colorizer = winston.format.colorize();

function plainPadStart(str: string, length: number, padChar: string = ' ') {
    const plainStr = stripVTControlCharacters(str);
    const padSize = length - plainStr.length;
    console.log('PAD START', str, padSize);
    return padSize > 0 ? padChar.repeat(padSize) + str : str;
}

function plainPadEnd(str: string, length: number, padChar: string = ' ') {
    const plainStr = stripVTControlCharacters(str);
    const padSize = length - plainStr.length;
    console.log('PAD END', str, padSize);
    return padSize > 0 ? str + padChar.repeat(padSize) : str;
}

// Create a custom format
const logFileFormat = winston.format.printf(({level, message, caller, timestamp, ...metadata}: TransformableInfo) => {
    let msg = `${timestamp} - ${level}: ${message} `;

    // Append all other metadata to the message
    if (Object.keys(metadata).length > 0) {
        msg += JSON.stringify(metadata, null, 4);
    }

    return msg;
});

const consoleFormat = winston.format.printf(({level, message, caller, timestamp, ...metadata}: TransformableInfo) => {
    let msg = `${timestamp}\t${level}\t${caller}:\t${message}`;

    // Append all other metadata to the message
    if (Object.keys(metadata).length > 0) {
        msg += colorizer.colorize('meta', JSON.stringify(metadata, null, 4));
    }

    return msg;
});

const logger: winston.Logger = winston.createLogger({
    level: 'debug',
    format: winston.format.combine(winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
    }), logFileFormat),
    transports: [new winston.transports.File({
        filename: `logs/${dateStr}.error.log`,
        level: 'error',
    }), new winston.transports.File({filename: `logs/${dateStr}.log`})],
});

// For development, also log out to console, not just to files
if (!isProduction()) {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(winston.format.colorize({all: true}), consoleFormat),
    }));
}


export default logger;

export type ScopedLogger = {
    info: (message: string, meta?: object) => void,
    debug: (message: string, meta?: object) => void,
    error: (message: string, meta?: object) => void,
    warn: (message: string, meta?: object) => void,
}

export function getScopedLogger(scope: string): ScopedLogger {
    return {
        info: (message: string, meta?: object) => logger.info(message, {caller: scope, ...meta}),
        debug: (message: string, meta?: object) => logger.debug(message, {caller: scope, ...meta}),
        error: (message: string, meta?: object) => logger.error(message, {caller: scope, ...meta}),
        warn: (message: string, meta?: object) => logger.warn(message, {caller: scope, ...meta}),
    };
}
