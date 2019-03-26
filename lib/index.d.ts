import * as winston from "winston";

declare interface IConfig {
    sentry: {
        enabled: boolean,
        dsn?: string,
        level?: string,
    }
}

declare const loggerFactory: ({config: IConfig}) => winston.Logger;
