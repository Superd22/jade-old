import { IJadeAPIResponseError, IJadeAPIResponseSuccess } from './../../common/interfaces/api-response';
import { JadeMysqlConfig } from './../../common/config/mysql.conf';
import { Service } from "typedi";
import { createConnection, Connection } from "typeorm";
import { ReplaySubject } from "rxjs";


export class APIResponse {
    public static send(data: any, msg = "OK"): IJadeAPIResponseSuccess {
        return { data: data, msg: msg, error: false };
    }

    public static err(msg: string, data?: any): IJadeAPIResponseError {
        return { data: data, msg: msg, error: true };
    }
}