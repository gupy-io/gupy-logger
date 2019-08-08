import * as winston from 'winston';
import winstonSentryRavenTransport = require('winston-sentry-raven-transport');
import { LogstashTransport } from 'winston-logstash-transport';
import { loggerFactoryGenerator } from './logger-factory-generator';

export const loggerFactory = loggerFactoryGenerator({
    winston,
    consoleTransportClass: winston.transports.Console,
    sentryTransportClass: winstonSentryRavenTransport,
    logstashTransportClass: LogstashTransport,
});
