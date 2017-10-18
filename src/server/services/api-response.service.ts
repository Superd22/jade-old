import { JWTSecret } from '../config/jwt.conf';
import { IJadeToken } from './../../common/interfaces/jade-token';
import { xJadeToken } from './../../common/consts/x-jade-token.const';
import { IJadeUser } from './../../common/interfaces/User/jadeUser.interface';
import { Response } from 'express';
import { IJadeAPIResponseError, IJadeAPIResponseSuccess } from './../../common/interfaces/api-response';
import { JadeMysqlConfig } from './../../common/config/mysql.conf';
import { Service } from "typedi";
import { createConnection, Connection } from "typeorm";
import { ReplaySubject } from "rxjs";
import * as jwt from "jsonwebtoken";

export class APIResponse {

    /**
     * Builds a ws packet
     * @param data the data to send
     */
    public static ws<T>(data: T): T {
        return APIResponse.checkIds(data);
    }

    /**
     * Builds an api response
     * @param data the data to send
     * @param msg the optional msg status
     */
    public static send(data: any, msg = "OK"): IJadeAPIResponseSuccess {
        return { data: APIResponse.checkIds(data), msg: msg, error: false };
    }

    /**
     * Builds an api error packet
     * @param msg the error message
     * @param data optional data parameters
     */
    public static err(msg: string, data?: any): IJadeAPIResponseError {
        return { data: APIResponse.checkIds(data), msg: msg, error: true };
    }


    /**
     * Offuscate ids that need to be.
     * @param data 
     */
    public static checkIds(data: any, stack = 0) {
        if (!data) return;
        // dirty circular fix
        data = JSON.parse(JSON.stringify(data));
        if (data['_hashModuleName']) delete (data['_hashModuleName']);
        if (data['id'] && data['hashId']) delete (data['id']);

        // If we're iterable, check children
        if (data && (typeof data === typeof [] || typeof data === typeof {})) {
            for (let subData in data) {
                try {
                    if (typeof data[subData] === typeof {})
                        data[subData] = APIResponse.checkIds(data[subData], (stack++));
                } catch (error) {
                    // Expected, on getters.
                    if (error instanceof TypeError) continue;
                    throw error;
                }
            }
        }

        return data;
    }

    /**
     * Set the token for a given user in the response, and return the generated (decoded) token.
     * 
     * @param res the response we're gonna send
     * @param user the user we want the token to reflect
     */
    public static setTokenUser(res: Response, user: IJadeUser): IJadeToken {
        const newToken: IJadeToken = { jadeUserId: user.id >= 0 ? user.id : -1, jadeUser: user };
        res.setHeader(xJadeToken, APIResponse.buildToken(newToken));

        return newToken;
    }

    /**
     * Encode the JWT token
     * @param token 
     */
    private static buildToken(token: IJadeToken): string {
        return jwt.sign(token, JWTSecret);
    }
}