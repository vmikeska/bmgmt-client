
export interface ApiResult<T> {
    result: ApiResultCode;
    responseMessage: string;
    data: T;
}

export enum ApiResultCode { OK, WARNING, ERROR }
