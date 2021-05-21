import {expect} from 'chai';
import * as winston from 'winston';
import {loggerFactoryGenerator} from './logger-factory-generator';
import * as TransportStream from 'winston-transport';

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
const symbolMessage= Symbol.for('message');
const symbolLevel= Symbol.for('level');

describe('gupy-logger', () => {
    beforeEach(()=>{
        lastConsoleLog = null;
        lastSentryLog = null;
        lastLogstashLog = null;
        const loggerFactory = loggerFactoryGenerator({
            winston,
            consoleTransportClass: FakeConsoleTransport,
            sentryTransportClass: FakeSentryTransport,
            logstashTransportClass: FakeLogstashTransport,
        });
        logger = loggerFactory({
            config: {sentry: {enabled: true, dsn: 'any', level: 'info'},
            logstash: {enabled: true, host: 'logstashhost', port: 12345, level: 'info'}}
        });
    });

    it('should init without logstash by default', () => {
        const loggerFactory = loggerFactoryGenerator({
            winston,
            consoleTransportClass: FakeConsoleTransport,
            sentryTransportClass: FakeSentryTransport,
            logstashTransportClass: undefined,
        });

        logger = loggerFactory({
            config: {sentry: {enabled: true, dsn: 'any', level: 'info'}},
        });

        expect(logger).be.not.equal(undefined);
    });

    it('should log debug nowhere', () => {
        logger.debug('any info');
        expect(lastSentryLog).to.equal(null);
        expect(lastConsoleLog).to.deep.equal(null);
        expect(lastSentryLog).to.deep.equal(null);
        expect(lastLogstashLog).to.deep.equal(null);
    });

    it('should log info only at console and logstash', () => {
        const expectedLog = {
            level: 'info',
            message: 'any info'
        };

        logger.info('any info');

        expect(lastSentryLog).to.equal(null);
        expect(lastConsoleLog).to.deep.equal(expectedLog);
        expect(lastLogstashLog.application).to.equal('gupy');
        expect(lastLogstashLog.message).to.equal('any info');
        expect(lastLogstashLog.level).to.equal('info');

        expect(lastConsoleLog[symbolMessage]).to.match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}.\d{3} \+\d{2}:\d{2} \[info]: any info/);
        expect(lastConsoleLog[symbolLevel]).to.equal('info');
    });

    it('should log warn only at console and logstash', () => {
        const expectedLog = {
            level: 'warn',
            message: 'any warn'
        };

        logger.warn('any warn');

        expect(lastSentryLog).to.equal(null);
        expect(lastConsoleLog).to.deep.equal(expectedLog);
        expect(lastLogstashLog.application).to.equal('gupy');
        expect(lastLogstashLog.message).to.equal('any warn');
        expect(lastLogstashLog.level).to.equal('warn');

        expect(lastConsoleLog[symbolMessage]).to.match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}.\d{3} \+\d{2}:\d{2} \[warn]: any warn/);
        expect(lastConsoleLog[symbolLevel]).to.equal('warn');
    });

    it('should log error at all transport classes', () => {
        const expectedLog = {
            level: 'error',
            message: 'any error'
        };

        logger.error('any error');

        expect(lastLogstashLog.application).to.equal('gupy');
        expect(lastLogstashLog.level).to.equal('error');
        expect(lastLogstashLog.message).to.equal('any error');

        expect(lastSentryLog).to.deep.equal(expectedLog);
        expect(lastSentryLog[symbolMessage]).to.match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}.\d{3} \+\d{2}:\d{2} \[error]: any error/);
        expect(lastSentryLog[symbolLevel]).to.equal('error');

        expect(lastConsoleLog).to.be.deep.equal(expectedLog);
        expect(lastConsoleLog[symbolMessage]).to.match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}.\d{3} \+\d{2}:\d{2} \[error]: any error/);
        expect(lastConsoleLog[symbolLevel]).to.equal('error');
    });
});
