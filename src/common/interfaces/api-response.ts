export interface IJadeAPIResponse {
    error: boolean;
    data: any;
    msg: string;
}

export interface IJadeAPIResponseSuccess extends IJadeAPIResponse {
    error: false;
}

export interface IJadeAPIResponseError extends IJadeAPIResponse {
    error: true;
}