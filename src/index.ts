import * as winston from 'winston';
const { SentryTransport } = require('winston-node-sentry');
import { LogstashTransport } from 'winston-logstash-transport';
import { loggerFactoryGenerator } from './logger-factory-generator';

export const loggerFactory = loggerFactoryGenerator({
    winston,
    consoleTransportClass: winston.transports.Console,
    sentryTransportClass: SentryTransport,
    logstashTransportClass: LogstashTransport,
});
