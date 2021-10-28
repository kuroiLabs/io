import { HttpMethod } from "./http-method"
import { IHttpOptions } from "./http-options.interface"
import { IHttpRequest } from "./http-request.interface"

export class HttpRequest implements IHttpRequest {

  public body?: any

  public options?: IHttpOptions

  public method: HttpMethod

  public queryParams?: { [param: string]: string }

  public url: string

  constructor(_request: IHttpRequest) {
    this.body = _request.body
    this.method = _request.method
    this.options = _request.options
    this.url = _request.url
  }

  public getFullUrl(): string {
    if (!this.queryParams)
      return this.url
    
    let _queryParamString: string = ''
    for (const _param in this.queryParams) {
      if (!_queryParamString)
        _queryParamString = `?${_param}=${this.queryParams[_param]}`
      else
        _queryParamString += `&${_param}=${this.queryParams[_param]}`
    }
    return this.url + _queryParamString
  }

}