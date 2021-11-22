import { IHttpOptions } from "./http-options.interface"

export class HttpOptions implements IHttpOptions {

  public contentType?: string

  public credentials?: RequestCredentials

  private customProperties = new Map<string, any>()

  public headers?: {
    [header: string]: string
  }

  public setHeader(key: string, value: string): void {
    if (!this.headers)
      this.headers = {}
    this.headers[key] = encodeURIComponent(value)
  }

  public setValue(property: string, value: any): void {
    this.customProperties.set(property, value)
  }

  public toJSON(): IHttpOptions {
    const _options: IHttpOptions = {
      contentType: this.contentType,
      credentials: this.credentials,
      headers: this.headers
    }
    this.customProperties.forEach((_value, _key) => {
      _options[_key] = _value
    })
    return _options
  }

}