import { Logger } from 'winston';
declare interface IConfig {
    level?: string;
}
export interface IFactoryInterface {
    config: IConfig;
}
declare type LoggerFactoryType = ({ config }: IFactoryInterface) => Logger;
export declare const loggerFactoryGenerator: ({ winston, consoleTransportClass, }: {
    winston: any;
    consoleTransportClass: any;
}) => LoggerFactoryType;
export {};
