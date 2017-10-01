import { IJadeUser } from './jadeUser.interface';
export interface IJadeUserHandleCode {
    code: string;
    user?: IJadeUser;
}
