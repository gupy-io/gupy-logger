"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const moment = require("moment");
function prepareErrorToLog(error, messages = []) {
    if (messages.length) {
        error.message = `${error.message} :: ${messages.join(',')}`;
    }
    return error;
}
exports.loggerFactoryGenerator = ({ winston, consoleTransportClass, sentryTransportClass }) => {
    return ({ config }) => {
        const transports = [];
        transports.push(new consoleTransportClass({
            level: config.sentry.level,
        }));
        if (config.sentry.enabled) {
            transports.push(new sentryTransportClass({
                dsn: config.sentry.dsn,
                level: 'error',
            }));
        }
        const logger = winston.createLogger({
            format: winston.format.printf(error => `${moment.utc().format('YYYY-MM-DD HH:mm Z')} [${error.level}]: ${error.message}`),
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
                    object = Object.assign({}, object, arg);
                }
            });
            if (error) {
                return errorFn(prepareErrorToLog(error, messages), Object.assign({}, object, { stack: error.stack }));
            }
            else {
                return errorFn.apply(logger, args);
            }
        };
        return logger;
    };
};
