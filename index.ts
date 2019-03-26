import * as winston from 'winston';
import * as moment from 'moment';
import * as WinstonSentryRavenTransport from 'winston-sentry-raven-transport';

function prepareErrorToLog(error, messages = []) {
    if (messages.length) {
        error.message = `${error.message} :: ${messages.join(',')}`;
    }
    return error;
}

interface IConfigInterface {
    sentry: {
        enabled: boolean,
        dsn?: string,
        level?: string,
    }
}

export const loggerFactory = ({config}: { config: IConfigInterface }) => {
    const transports = [];
    transports.push(new (winston.transports.Console)({
        level: config.sentry.level,
    }));

    if (config.sentry.enabled) {
        transports.push(new WinstonSentryRavenTransport({
            dsn: config.sentry.dsn,
            level: 'error',
        }));
    }
    const logger = winston.createLogger({
        format: winston.format.printf(
            error => `${moment.utc().format('YYYY-MM-DD HH:mm Z')} [${error.level}]: ${error.message}`,
        ),
        transports,
        exitOnError: false,
    });

    const errorFn = logger.error;

    logger.error = (...args): winston.Logger => {
        if (!args || !args.length) return;

        let error;
        const messages = [];
        let object = {};

        args.forEach((arg) => {
            if (arg instanceof Error) {
                error = arg;
            } else if (typeof arg === 'string') {
                messages.push(arg);
            } else if (typeof arg === 'object') {
                object = {...object, ...arg};
            }
        });

        if (error) {
            return errorFn(prepareErrorToLog(error, messages), {...object, stack: error.stack});
        } else {
            return errorFn.apply(logger, args);
        }
    };
    return logger;
};
