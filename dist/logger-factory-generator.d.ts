import { Logger } from 'winston';
declare interface IConfig {
    sentry: {
        enabled: boolean;
        dsn?: string;
        level?: string;
    };
    logstash?: {
        enabled?: boolean;
        application?: string;
        host?: string;
        port?: number;
        level?: string;
    };
}
export interface IFactoryInterface {
    config: IConfig;
}
declare type LoggerFactoryType = ({ config }: IFactoryInterface) => Logger;
export declare const loggerFactoryGenerator: ({ winston, consoleTransportClass, sentryTransportClass, logstashTransportClass }: {
    winston: any;
    consoleTransportClass: any;
    sentryTransportClass: any;
    logstashTransportClass: any;
}) => LoggerFactoryType;
export {};
