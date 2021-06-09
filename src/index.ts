import * as winston from 'winston';
import { loggerFactoryGenerator } from './logger-factory-generator';

export const loggerFactory = loggerFactoryGenerator({ winston ,
  consoleTransportClass: winston.transports.Console});
