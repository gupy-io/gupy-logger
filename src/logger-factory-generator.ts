import {Logger} from 'winston';
import * as moment from 'moment';

declare interface IConfig {
    sentry: {
        enabled: boolean,
        dsn?: string,
        level?: string,
    };
}

function prepareErrorToLog(error, messages = []) {
    if (messages.length) {
        error.message = `${error.message} :: ${messages.join(',')}`;
    }
    return error;
}

export interface IFactoryInterface {
    config: IConfig;
}

type LoggerFactoryType = ({config}: IFactoryInterface) => Logger;

export const loggerFactoryGenerator = ({winston, consoleTransportClass, sentryTransportClass}): LoggerFactoryType => {
    return ({config}: IFactoryInterface) => {
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
        const logger: Logger = winston.createLogger({
            format: winston.format.printf(
                error => `${moment.utc().format('YYYY-MM-DD HH:mm Z')} [${error.level}]: ${error.message}`,
            ),
            transports,
            exitOnError: false,
        });

        const errorFn = logger.error;

        logger.error = (...args) => {
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
};
