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

let logger;
const symbolMessage= Symbol.for('message');
const symbolLevel= Symbol.for('level');

describe('gupy-logger', () => {
    beforeEach(()=>{
        lastConsoleLog = null;
        lastSentryLog = null;
        const loggerFactory = loggerFactoryGenerator({
            winston,
            consoleTransportClass: FakeConsoleTransport,
            sentryTransportClass: FakeSentryTransport
        });
        logger = loggerFactory({
            config: {sentry: {enabled: true, dsn: 'any', level: 'info'}}
        });
    });

    it('should log debug nowhere', () => {
        logger.debug('any info');
        expect(lastSentryLog).to.equal(null);
        expect(lastConsoleLog).to.deep.equal(null);
        expect(lastSentryLog).to.deep.equal(null);
    });

    it('should log info only at console', () => {
        logger.info('any info');
        expect(lastSentryLog).to.equal(null);
        expect(lastConsoleLog).to.deep.equal({
            level: 'info',
            message: 'any info'
        });
        expect(lastConsoleLog[symbolMessage]).to.match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2} \+\d{2}:\d{2} \[info]: any info/);
        expect(lastConsoleLog[symbolLevel]).to.equal('info');
    });

    it('should log warn only at console', () => {
        logger.warn('any warn');
        expect(lastSentryLog).to.equal(null);
        expect(lastConsoleLog).to.deep.equal({
            level: 'warn',
            message: 'any warn'
        });
        expect(lastConsoleLog[symbolMessage]).to.match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2} \+\d{2}:\d{2} \[warn]: any warn/);
        expect(lastConsoleLog[symbolLevel]).to.equal('warn');
    });

    it('should log error at sentry and console', () => {
        logger.error('any error');
        expect(lastSentryLog).to.deep.equal({
            level: 'error',
            message: 'any error'
        });
        expect(lastSentryLog[symbolMessage]).to.match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2} \+\d{2}:\d{2} \[error]: any error/);
        expect(lastSentryLog[symbolLevel]).to.equal('error');

        expect(lastConsoleLog).to.be.deep.equal({
            level: 'error',
            message: 'any error'
        });
        expect(lastConsoleLog[symbolMessage]).to.match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2} \+\d{2}:\d{2} \[error]: any error/);
        expect(lastConsoleLog[symbolLevel]).to.equal('error');
    });
});
