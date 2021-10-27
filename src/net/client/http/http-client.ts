import { Observable, Subscriber } from "rxjs"
import { IHttpClient } from "./http-client.interface"
import { IHttpOptions } from "./http-options.interface"
import { HttpRequest } from "./http-request"

export class HttpClient implements IHttpClient {

  public delete<T = any>(url: string, options?: IHttpOptions): Observable<T> {
    return new Observable<T>(_observer => {
      const _request: HttpRequest = new HttpRequest({
        url,
        options,
        method: "DELETE"
      })
      this._request(_request, _observer)
    })
  }

  public get<T = any>(url: string, options?: IHttpOptions): Observable<T> {
    return new Observable<T>(_observer => {
      const _request: HttpRequest = new HttpRequest({
        url,
        options,
        method: "GET"
      })
      this._request(_request, _observer)
    })
  }

  public patch<T = any>(url: string, body: any, options?: IHttpOptions): Observable<T> {
    return new Observable<T>(_observer => {
      const _request: HttpRequest = new HttpRequest({
        url,
        options,
        body,
        method: "PATCH"
      })
      this._request(_request, _observer)
    })
  }

  public post<T = any>(url: string, body: any, options?: IHttpOptions): Observable<T> {
    return new Observable<T>(_observer => {
      const _request: HttpRequest = new HttpRequest({
        url,
        options,
        body,
        method: "POST"
      })
      this._request(_request, _observer)
    })
  }

  public put<T = any>(url: string, body: any, options?: IHttpOptions): Observable<T> {
    return new Observable<T>(_observer => {
      const _request: HttpRequest = new HttpRequest({
        url,
        options,
        body,
        method: "PUT"
      })
      this._request(_request, _observer)
    })
  }

  private _request(_request: HttpRequest, _observer: Subscriber<any>): void {
    try {
      const _xhr = new XMLHttpRequest()
      if (_request.options && _request.options.headers)
        this._setHeaders(_xhr, _request.options.headers)
      _xhr.open(_request.method, _request.getFullUrl())
      _xhr.addEventListener("load", () => {
        switch (_xhr.responseType) {
          case "text": _observer.next(_xhr.responseText); break
          case "json": _observer.next(JSON.parse(_xhr.responseText)); break
        }
      })
      _xhr.addEventListener("error", _error => {
        _observer.error(_error)
      })
      _xhr.send()
    } catch (_err) {
      _observer.error(_err)
    }
  }

  private _setHeaders(_xhr: XMLHttpRequest, _headers: { [header: string]: string }) {
    for (const _header in _headers)
      _xhr.setRequestHeader(_header, _headers[_header])
  }

}