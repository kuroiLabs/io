import { Observable, throwError } from "rxjs"
import { IHttpClient } from "./http-client.interface"
import { IHttpOptions } from "./http-options.interface"
import { HttpRequest } from "./http-request"

const DEFAULT_HEADERS = {
  headers: { "Content-Type": "application/json" }
}

export class HttpClient implements IHttpClient {

  public delete<T = any>(url: string, options: IHttpOptions = DEFAULT_HEADERS): Observable<T> {
    const _request: HttpRequest = new HttpRequest({
      url,
      options,
      method: "DELETE"
    })
    return this._request(_request)
  }

  public get<T = any>(url: string, options: IHttpOptions = DEFAULT_HEADERS): Observable<T> {
    const _request: HttpRequest = new HttpRequest({
      url,
      options,
      method: "GET"
    })
    return this._request(_request)
  }

  public patch<T = any>(url: string, body: any, options: IHttpOptions = DEFAULT_HEADERS): Observable<T> {
    const _request: HttpRequest = new HttpRequest({
      url,
      options,
      body,
      method: "PATCH"
    })
    return this._request(_request)
  }

  public post<T = any>(url: string, body: any, options: IHttpOptions = DEFAULT_HEADERS): Observable<T> {
    const _request: HttpRequest = new HttpRequest({
      url,
      options,
      body,
      method: "POST"
    })
    return this._request(_request)
  }

  public put<T = any>(url: string, body: any, options: IHttpOptions = DEFAULT_HEADERS): Observable<T> {
    const _request: HttpRequest = new HttpRequest({
      url,
      options,
      body,
      method: "PUT"
    })
    return this._request(_request)
  }

  private _request<T>(_request: HttpRequest): Observable<T> {
    try {
      return new Observable(_observer => {
        const _xhr = new XMLHttpRequest()
        _xhr.open(_request.method, _request.getFullUrl(), true)

        if (_request.options && _request.options.headers)
          this._setHeaders(_xhr, _request.options.headers)

        _xhr.onload = () => {
          switch (_xhr.responseType) {
            case "text": _observer.next(<unknown>_xhr.responseText as T); break
            default: _observer.next(JSON.parse(_xhr.responseText)); break
          }
        }
        _xhr.onerror = _error => {
          _observer.error(_error)
        }
  
        _xhr.send(_request.body || null)
      })
    } catch (_err) {
      return throwError(() => _err)
    }
  }

  private _setHeaders(_xhr: XMLHttpRequest, _headers: { [header: string]: string }) {
    for (const _header in _headers)
      _xhr.setRequestHeader(_header, _headers[_header])
  }

}