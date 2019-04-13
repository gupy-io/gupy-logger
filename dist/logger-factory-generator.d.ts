import { Logger } from 'winston';
declare interface IConfig {
    sentry: {
        enabled: boolean;
        dsn?: string;
        level?: string;
    };
}
export interface IFactoryInterface {
    config: IConfig;
}
declare type LoggerFactoryType = ({ config }: IFactoryInterface) => Logger;
export declare const loggerFactoryGenerator: ({ winston, consoleTransportClass, sentryTransportClass }: {
    winston: any;
    consoleTransportClass: any;
    sentryTransportClass: any;
}) => LoggerFactoryType;
export {};
