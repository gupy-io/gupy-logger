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
let lastLogstashLog;
class FakeLogstashTransport extends TransportStream {
    log(info) {
        lastLogstashLog = info;
    }
}
let logger;
const symbolMessage = Symbol.for('message');
const symbolLevel = Symbol.for('level');
describe('gupy-logger', () => {
    beforeEach(() => {
        lastConsoleLog = null;
        lastSentryLog = null;
        lastLogstashLog = null;
        const loggerFactory = logger_factory_generator_1.loggerFactoryGenerator({
            winston,
            consoleTransportClass: FakeConsoleTransport,
            sentryTransportClass: FakeSentryTransport,
            logstashTransportClass: FakeLogstashTransport,
        });
        logger = loggerFactory({
            config: { sentry: { enabled: true, dsn: 'any', level: 'info' },
                logstash: { enabled: true, host: 'logstashhost', port: 12345, level: 'info' } }
        });
    });
    it('should init without logstash by default', () => {
        const loggerFactory = logger_factory_generator_1.loggerFactoryGenerator({
            winston,
            consoleTransportClass: FakeConsoleTransport,
            sentryTransportClass: FakeSentryTransport,
            logstashTransportClass: undefined,
        });
        logger = loggerFactory({
            config: { sentry: { enabled: true, dsn: 'any', level: 'info' } },
        });
        chai_1.expect(logger).be.not.equal(undefined);
    });
    it('should log debug nowhere', () => {
        logger.debug('any info');
        chai_1.expect(lastSentryLog).to.equal(null);
        chai_1.expect(lastConsoleLog).to.deep.equal(null);
        chai_1.expect(lastSentryLog).to.deep.equal(null);
        chai_1.expect(lastLogstashLog).to.deep.equal(null);
    });
    it('should log info only at console and logstash', () => {
        const expectedLog = {
            level: 'info',
            message: 'any info'
        };
        logger.info('any info');
        chai_1.expect(lastSentryLog).to.equal(null);
        chai_1.expect(lastConsoleLog).to.deep.equal(expectedLog);
        chai_1.expect(lastLogstashLog.application).to.equal('gupy');
        chai_1.expect(lastLogstashLog.message).to.equal('any info');
        chai_1.expect(lastLogstashLog.level).to.equal('info');
        chai_1.expect(lastConsoleLog[symbolMessage]).to.match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}.\d{3} \+\d{2}:\d{2} \[info]: any info/);
        chai_1.expect(lastConsoleLog[symbolLevel]).to.equal('info');
    });
    it('should log warn only at console and logstash', () => {
        const expectedLog = {
            level: 'warn',
            message: 'any warn'
        };
        logger.warn('any warn');
        chai_1.expect(lastSentryLog).to.equal(null);
        chai_1.expect(lastConsoleLog).to.deep.equal(expectedLog);
        chai_1.expect(lastLogstashLog.application).to.equal('gupy');
        chai_1.expect(lastLogstashLog.message).to.equal('any warn');
        chai_1.expect(lastLogstashLog.level).to.equal('warn');
        chai_1.expect(lastConsoleLog[symbolMessage]).to.match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}.\d{3} \+\d{2}:\d{2} \[warn]: any warn/);
        chai_1.expect(lastConsoleLog[symbolLevel]).to.equal('warn');
    });
    it('should log error at all transport classes', () => {
        const expectedLog = {
            level: 'error',
            message: 'any error'
        };
        logger.error('any error');
        chai_1.expect(lastLogstashLog.application).to.equal('gupy');
        chai_1.expect(lastLogstashLog.level).to.equal('error');
        chai_1.expect(lastLogstashLog.message).to.equal('any error');
        chai_1.expect(lastSentryLog).to.deep.equal(expectedLog);
        chai_1.expect(lastSentryLog[symbolMessage]).to.match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}.\d{3} \+\d{2}:\d{2} \[error]: any error/);
        chai_1.expect(lastSentryLog[symbolLevel]).to.equal('error');
        chai_1.expect(lastConsoleLog).to.be.deep.equal(expectedLog);
        chai_1.expect(lastConsoleLog[symbolMessage]).to.match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}.\d{3} \+\d{2}:\d{2} \[error]: any error/);
        chai_1.expect(lastConsoleLog[symbolLevel]).to.equal('error');
    });
});
