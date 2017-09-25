import { IJadeAPIResponse } from './../../common/interfaces/api-response';
import { install as jCoInstall } from 'jasmine-co';

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
    public static getReturnData(data:IJadeAPIResponse) {
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
    public static apiError(data: IJadeAPIResponse, errorMsg?:string) {
        expect(data).toBeTruthy();
        expect(data.error).toBe(true);
        if(errorMsg) expect(data.msg).toBe(errorMsg);
    }

}