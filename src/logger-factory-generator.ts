import { Logger } from 'winston';
import winston = require('winston/lib/winston/config');
declare interface IConfig {
  level?: string;
}

function prepareErrorToLog(error, messages = []) {
  if (messages.length) {
    error.message = `${error.message} :: ${messages.join(',')}`;
  }
  return error;
}

export interface IFactoryInterface {
  config: IConfig;
}

type LoggerFactoryType = ({ config }: IFactoryInterface) => Logger;

export const loggerFactoryGenerator = ({
  winston,
  consoleTransportClass,
}): LoggerFactoryType => {
  return ({ config }: IFactoryInterface) => {
    const logger: Logger = winston.createLogger({
      level: config.level,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: new consoleTransportClass(),
      exitOnError: false,
    });

    const errorFn = logger.error;

    logger.error = (...args) => {
      if (!args || !args.length) return;

      let error : any;
      const messages = [];
      let object = {};

      args.forEach((arg) => {
        if (arg instanceof Error) {
          error = arg;
        } else if (typeof arg === 'string') {
          messages.push(arg);
        } else if (typeof arg === 'object') {
          object = { ...object, ...arg };
        }
      });

      if (error) {
        return errorFn(prepareErrorToLog(error, messages), {
          ...object,
          stack: error.stack,
        });
      } else {
        return errorFn.apply(logger, args);
      }
    };
    return logger;
  };
};
