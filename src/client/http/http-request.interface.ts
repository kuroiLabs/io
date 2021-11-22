import { HttpMethod } from "./http-method";
import { IHttpOptions } from "./http-options.interface";

export interface IHttpRequest {
  body?: any
  method: HttpMethod
  options?: IHttpOptions
  url: string
}
