

import * as moment from 'moment';
import { CommonGlobal } from './common-global';

export class Logger {

    public static info(type: any, message: any, ...consoleParams: any[]) {
        this.messageBase(type, message, consoleParams);
    }

    private static messageBase(type: any, message: any, ...consoleParams: any[]) {
        if (!CommonGlobal.environment.doLogging) {
            return;
        }

        let time = moment();

        let msg = `${time.format("mm:ss.SSS")}\t${type.name}\t\t${message}\t`;

        if (consoleParams) {
            console.log(msg, consoleParams);
        } else {
            console.log(msg);
        }

    }
}

export interface LoggerMessage {
    time: string;

}

export enum LogLevel { Trace, }