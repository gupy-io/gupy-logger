"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggerFactoryGenerator = void 0;
function prepareErrorToLog(error, messages = []) {
    if (messages.length) {
        error.message = `${error.message} :: ${messages.join(',')}`;
    }
    return error;
}
const loggerFactoryGenerator = ({ winston, consoleTransportClass, }) => {
    return ({ config }) => {
        const logger = winston.createLogger({
            level: config.level,
            format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
            transports: new consoleTransportClass(),
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
