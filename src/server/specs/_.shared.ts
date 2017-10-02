import { JadeUserEntity } from './../entity/user/jade-user.entity';
import { DbService } from './../services/db.service';
import { Container } from 'typedi';
import { IJadeUser } from './../../common/interfaces/User/jadeUser.interface';
import { IJadeToken } from './../../common/interfaces/jade-token';
import { DeepPartial } from 'typeorm/common/DeepPartial';
import { xJadeToken } from './../../common/consts/x-jade-token.const';
import { JWTRSISecret } from './../../bot/spectrum/config/JWT-rsi.conf';
import { JWTSecret } from './../config/jwt.conf';
import { IJadeAPIResponse } from './../../common/interfaces/api-response';
import { install as jCoInstall } from 'jasmine-co';
import * as jwt from "jsonwebtoken";

export class TestShared {
    /**
     * Create common-set-up.
     */
    public static commonSetUp() {
        const SpecReporter = require('jasmine-spec-reporter').SpecReporter;


        jasmine.getEnv().clearReporters();               // remove default reporter logs
        jasmine.getEnv().addReporter(new SpecReporter({  // add jasmine-spec-reporter
            spec: {
                displayPending: true
            }
        }));
        jCoInstall();
    }

    public static tellJasmine(done) {
        return function (err) {
            if (err) {
                done.fail(err);
            } else {
                done();
            }
        };
    }

    /**
     * extract the data from an api response
     */
    public static getReturnData(data: IJadeAPIResponse) {
        return data.data;
    }

    /**
     * Ensure we have an api response without error
     */
    public static apiNoError(data: IJadeAPIResponse) {
        expect(data).toBeTruthy();
        expect(data.error).toBe(false);
    }

    /**
     * Ensure we get an api response with an error
     * 
     * @param data 
     * @param errorMsg 
     */
    public static apiError(data: IJadeAPIResponse, errorMsg?: string) {
        expect(data).toBeTruthy();
        expect(data.error).toBe(true);
        if (errorMsg) expect(data.msg).toBe(errorMsg);
    }

    public static genJadeToken(payload: any): [string, string] {
        return TestShared.genToken("jade", payload);
    }

    public static genTokenFromUser(user: IJadeUser, spread?: boolean) {

        const packet = TestShared.genToken("jade", {
            jadeUserId: user.id,
            jadeUser: user
        });;

        if (spread) return packet;

        let unspread = {};
        unspread[packet[0]] = packet[1];

        return unspread;
    }

    public static async newUserAndAuth(user: DeepPartial<IJadeUser>) {
        let u = await TestShared.newUser(user);

        return TestShared.genTokenFromUser(u);
    }

    public static async newUser(user: DeepPartial<IJadeUser>) {
        let u = Object.assign(new JadeUserEntity, user);
        return await Container.get(DbService).repo(JadeUserEntity).persist(u);
    }

    public static genToken(type: "jade" | "spectrum" = "jade", payload: DeepPartial<IJadeToken>): [string, string] {
        const tokenName = () => {
            switch (type) {
                case "jade": return xJadeToken;
                case "spectrum": return "x-jade-spectrum-auth";
            }
        }

        const secret = () => {
            switch (type) {
                case "jade": return JWTSecret;
                case "spectrum": return JWTRSISecret;
            }
        };

        return [tokenName(), jwt.sign(payload, secret())];
    }

    public static genSpectrumToken(payload: any): [string, string] {
        return TestShared.genToken("spectrum", payload);
    }

    public static get randomString(): string {
        return String(Math.floor(Math.random() * 9e15));
    }
}