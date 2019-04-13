import * as winston from 'winston';
import WinstonSentryRavenTransport from 'winston-sentry-raven-transport';
import {loggerFactoryGenerator} from './logger-factory-generator';

export const loggerFactory = loggerFactoryGenerator({
    winston,
    consoleTransportClass: winston.transports.Console,
    sentryTransportClass: WinstonSentryRavenTransport,
});
