"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggerFactory = void 0;
const winston = require("winston");
const logger_factory_generator_1 = require("./logger-factory-generator");
exports.loggerFactory = logger_factory_generator_1.loggerFactoryGenerator({
    winston,
    consoleTransportClass: winston.transports.Console
});
