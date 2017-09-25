export interface IJadeAPIResponse<T = any> {
    error: boolean;
    data: T;
    msg: string;
}

export interface IJadeAPIResponseSuccess<T = any> extends IJadeAPIResponse<T> {
    error: false;
}

export interface IJadeAPIResponseError<T = any> extends IJadeAPIResponse<T> {
    error: true;
}