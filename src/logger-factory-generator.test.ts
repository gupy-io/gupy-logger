import { expect } from 'chai';
import * as winston from 'winston';
import { loggerFactoryGenerator } from './logger-factory-generator';
import * as TransportStream from 'winston-transport';

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
    const loggerFactory = loggerFactoryGenerator({
      winston,
      consoleTransportClass: FakeConsoleTransport,
    });
    logger = loggerFactory({ config: { level: 'info' } });
  });

  it('should init by default', () => {
    expect(logger).be.not.equal(undefined);
  });

  it('should log debug nowhere', () => {
    logger.debug('any info');
    expect(lastConsoleLog).to.deep.equal(null);
  });

  it('should log info at console', () => {
    const expectedLog = {
      level: 'info',
      message: 'any info',
    };
    logger.info('any info');
    expect(lastConsoleLog).to.deep.equal(expectedLog);
    expect(lastConsoleLog[symbolMessage]).to.match(
      /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}.\d{3} \+\d{2}:\d{2} \[info]: any info/
    );
    expect(lastConsoleLog[symbolLevel]).to.equal('info');
  });

  it('should log warn at console', () => {
    const expectedLog = {
      level: 'warn',
      message: 'any warn',
    };

    logger.warn('any warn');
    expect(lastConsoleLog).to.deep.equal(expectedLog);
    expect(lastConsoleLog[symbolMessage]).to.match(
      /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}.\d{3} \+\d{2}:\d{2} \[warn]: any warn/
    );
    expect(lastConsoleLog[symbolLevel]).to.equal('warn');
  });

  it('should log error at console', () => {
    const expectedLog = {
      level: 'error',
      message: 'any error',
    };

    logger.error('any error');
    expect(lastConsoleLog).to.be.deep.equal(expectedLog);
    expect(lastConsoleLog[symbolMessage]).to.match(
      /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}.\d{3} \+\d{2}:\d{2} \[error]: any error/
    );
    expect(lastConsoleLog[symbolLevel]).to.equal('error');
  });
});
