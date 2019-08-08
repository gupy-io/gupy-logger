"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston = require("winston");
const winstonSentryRavenTransport = require("winston-sentry-raven-transport");
const winston_logstash_transport_1 = require("winston-logstash-transport");
const logger_factory_generator_1 = require("./logger-factory-generator");
exports.loggerFactory = logger_factory_generator_1.loggerFactoryGenerator({
    winston,
    consoleTransportClass: winston.transports.Console,
    sentryTransportClass: winstonSentryRavenTransport,
    logstashTransportClass: winston_logstash_transport_1.LogstashTransport,
});
