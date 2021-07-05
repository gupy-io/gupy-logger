"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggerFactoryGenerator = void 0;
const moment = require("moment");
const DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss.SSS Z';
function prepareErrorToLog(error, messages = []) {
    if (messages.length) {
        error.message = `${error.message} :: ${messages.join(',')}`;
    }
    return error;
}
const loggerFactoryGenerator = ({ winston, consoleTransportClass, sentryTransportClass, logstashTransportClass }) => {
    return ({ config }) => {
        const transports = [];
        transports.push(new consoleTransportClass({
            level: config.level,
        }));
        if (config.sentry.enabled) {
            transports.push(new sentryTransportClass({
                dsn: config.sentry.dsn,
                level: 'error',
                config: {
                    sampleRate: config.sentry.sampleRate || 0.25
                }
            }));
        }
        if (config.logstash && config.logstash.enabled && logstashTransportClass) {
            const appendMetaInfo = winston.format((info) => {
                return Object.assign(info, {
                    application: config.logstash.application || 'gupy',
                    pid: process.pid,
                    time: moment.utc().format(DATETIME_FORMAT),
                });
            });
            transports.push(new logstashTransportClass({
                host: config.logstash.host,
                port: config.logstash.port,
                level: config.level,
                format: winston.format.combine(appendMetaInfo(), winston.format.json(), winston.format.timestamp()),
            }));
        }
        const logger = winston.createLogger({
            format: winston.format.printf(error => `${moment.utc().format(DATETIME_FORMAT)} [${error.level}]: ${error.message}`),
            transports,
            exitOnError: false,
        });
        const errorFn = logger.error;
        logger.error = (...args) => {
            if (!args || !args.length)
                return;
            let error;
            const messages = [];
            let object = {};
            args.forEach((arg) => {
                if (arg instanceof Error) {
                    error = arg;
                }
                else if (typeof arg === 'string') {
                    messages.push(arg);
                }
                else if (typeof arg === 'object') {
                    object = Object.assign(Object.assign({}, object), arg);
                }
            });
            if (error) {
                return errorFn(prepareErrorToLog(error, messages), Object.assign(Object.assign({}, object), { stack: error.stack }));
            }
            else {
                return errorFn.apply(logger, args);
            }
        };
        return logger;
    };
};
exports.loggerFactoryGenerator = loggerFactoryGenerator;
