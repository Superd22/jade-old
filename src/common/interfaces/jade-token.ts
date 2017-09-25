import { IJadeUser } from './User/jadeUser.interface';
export interface IJadeToken {
    jadeUserId: number;
    jadeUser: IJadeUser;
}