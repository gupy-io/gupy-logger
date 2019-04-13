"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const winston = require("winston");
const logger_factory_generator_1 = require("./logger-factory-generator");
const TransportStream = require("winston-transport");
let lastSentryLog;
class FakeSentryTransport extends TransportStream {
    log(info) {
        lastSentryLog = info;
    }
}
let lastConsoleLog;
class FakeConsoleTransport extends TransportStream {
    log(info) {
        lastConsoleLog = info;
    }
}
let logger;
const symbolMessage = Symbol.for('message');
const symbolLevel = Symbol.for('level');
describe('gupy-logger', () => {
    beforeEach(() => {
        lastConsoleLog = null;
        lastSentryLog = null;
        const loggerFactory = logger_factory_generator_1.loggerFactoryGenerator({
            winston,
            consoleTransportClass: FakeConsoleTransport,
            sentryTransportClass: FakeSentryTransport
        });
        logger = loggerFactory({
            config: { sentry: { enabled: true, dsn: 'any', level: 'info' } }
        });
    });
    it('should log debug nowhere', () => {
        logger.debug('any info');
        chai_1.expect(lastSentryLog).to.equal(null);
        chai_1.expect(lastConsoleLog).to.deep.equal(null);
        chai_1.expect(lastSentryLog).to.deep.equal(null);
    });
    it('should log info only at console', () => {
        logger.info('any info');
        chai_1.expect(lastSentryLog).to.equal(null);
        chai_1.expect(lastConsoleLog).to.deep.equal({
            level: 'info',
            message: 'any info'
        });
        chai_1.expect(lastConsoleLog[symbolMessage]).to.match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2} \+\d{2}:\d{2} \[info]: any info/);
        chai_1.expect(lastConsoleLog[symbolLevel]).to.equal('info');
    });
    it('should log warn only at console', () => {
        logger.warn('any warn');
        chai_1.expect(lastSentryLog).to.equal(null);
        chai_1.expect(lastConsoleLog).to.deep.equal({
            level: 'warn',
            message: 'any warn'
        });
        chai_1.expect(lastConsoleLog[symbolMessage]).to.match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2} \+\d{2}:\d{2} \[warn]: any warn/);
        chai_1.expect(lastConsoleLog[symbolLevel]).to.equal('warn');
    });
    it('should log error at sentry and console', () => {
        logger.error('any error');
        chai_1.expect(lastSentryLog).to.deep.equal({
            level: 'error',
            message: 'any error'
        });
        chai_1.expect(lastSentryLog[symbolMessage]).to.match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2} \+\d{2}:\d{2} \[error]: any error/);
        chai_1.expect(lastSentryLog[symbolLevel]).to.equal('error');
        chai_1.expect(lastConsoleLog).to.be.deep.equal({
            level: 'error',
            message: 'any error'
        });
        chai_1.expect(lastConsoleLog[symbolMessage]).to.match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2} \+\d{2}:\d{2} \[error]: any error/);
        chai_1.expect(lastConsoleLog[symbolLevel]).to.equal('error');
    });
});
