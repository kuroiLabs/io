import { IHttpOptions } from "./http-options.interface"

export class HttpOptions implements IHttpOptions {

  public contentType?: string

  public credentials?: RequestCredentials

  public headers?: {
    [header: string]: string
  }

  public setHeader(key: string, value: string): void {
    if (!this.headers)
      this.headers = {}
    this.headers[key] = encodeURIComponent(value)
  }

}