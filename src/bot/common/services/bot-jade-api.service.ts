import { IJadeAPIResponse } from './../../../common/interfaces/api-response';
import { APIResponse } from './../../../server/services/api-response.service';
import { xJadeToken } from './../../../common/consts/x-jade-token.const';
import { IJadeUser } from './../../../common/interfaces/User/jadeUser.interface';
import { Service } from 'typedi';
import * as WebRequest from 'web-request';

@Service()
export class BotJadeApiService {

    private _jadeApiUrl = "http://192.168.1.25:3001/";

    public async get<T>(endpoint: string, asUser?: IJadeUser): Promise<IJadeAPIResponse<T>> {
        const r = await WebRequest.get(this._jadeApiUrl + endpoint, this.buildParams(asUser));

        return <IJadeAPIResponse<T>>this.buildResponse(r);
    }

    public async post<T>(endpoint: string, body?: any, asUser?: IJadeUser) {
        const r = await WebRequest.post(this._jadeApiUrl + endpoint, this.buildParams(asUser), this.handleBody(body));

        return <IJadeAPIResponse<T>>this.buildResponse(r);
    }

    public async patch<T>(endpoint: string, body?: any, asUser?: IJadeUser) {
        const r = await WebRequest.patch(this._jadeApiUrl + endpoint, this.buildParams(asUser), this.handleBody(body));

        return <IJadeAPIResponse<T>>this.buildResponse(r);

    }

    public async delete<T>(endpoint: string, asUser?: IJadeUser) {
        const r = await WebRequest.delete(this._jadeApiUrl + endpoint, this.buildParams(asUser));

        return <IJadeAPIResponse<T>>this.buildResponse(r);

    }

    public async put<T>(endpoint: string, body?: any, asUser?: IJadeUser) {
        const r = await WebRequest.put(this._jadeApiUrl + endpoint, this.buildParams(asUser), this.handleBody(body));

        return <IJadeAPIResponse<T>>this.buildResponse(r);

    }

    private handleBody(body:any) {
        return JSON.stringify(body);
    }

    private buildResponse<T>(response: WebRequest.Response<string>): IJadeAPIResponse<T> {
        try { return JSON.parse(response.content) }
        catch (e) { return { error: true, msg: response.statusMessage, data: null } }
    }

    private buildParams(asUser?: IJadeUser) {
        return { headers: this.buildHeaders(asUser) };
    }

    private buildHeaders(asUser?: IJadeUser) {
        let headers = {'Content-Type': 'application/json'};

        if (asUser)
            headers[xJadeToken] = APIResponse.buildToken({ jadeUserId: asUser.id, jadeUser: asUser });

        return headers;
    }
}