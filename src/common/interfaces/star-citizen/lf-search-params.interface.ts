import { ISCLFParams } from "./lf-params.interface";

export interface ISCLFSearchParams extends ISCLFParams {
    start?:number,
    limit?:number,
}