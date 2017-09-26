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
    public static send(data: any, msg = "OK"): IJadeAPIResponseSuccess {
        return { data: data, msg: msg, error: false };
    }

    public static err(msg: string, data?: any): IJadeAPIResponseError {
        return { data: data, msg: msg, error: true };
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