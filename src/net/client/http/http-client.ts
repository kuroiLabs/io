import { Observable, Subscriber } from "rxjs"
import { IHttpClient } from "./http-client.interface"
import { IHttpOptions } from "./http-options.interface"

export class HttpClient implements IHttpClient {

  public get<T = any>(url: string, options?: IHttpOptions): Observable<T> {
    return new Observable<T>(_observer => {
      const _request: Request = new Request(url, {
        method: "GET",
        credentials: options && options.credentials
      })
      this._processResponse(_request, _observer)
    })
  }

  public post<T = any>(url: string, body: any, options?: IHttpOptions): Observable<T> {
    return new Observable<T>(_observer => {
      const _request: Request = new Request(url, {
        method: "POST",
        credentials: options && options.credentials,
        body
      })
      this._processResponse(_request, _observer)
    })
  }

  public put<T = any>(url: string, body: any, options?: IHttpOptions): Observable<T> {
    return new Observable<T>(_observer => {
      const _request: Request = new Request(url, {
        method: "PUT",
        credentials: options && options.credentials,
        body
      })
      this._processResponse(_request, _observer)
    })
  }

  public delete<T = any>(url: string, options?: IHttpOptions): Observable<T> {
    return new Observable<T>(_observer => {
      const _request: Request = new Request(url, {
        method: "DELETE",
        credentials: options && options.credentials
      })
      this._processResponse(_request, _observer)
    })
  }

  private _processResponse<T = any>(_request: Request, _observer: Subscriber<T>): void {
    fetch(_request).then(
      _response => {
        const _data = _response.json() as Promise<T>;
        if (_response.status >= 200 && _response.status < 300) {
          return _data
        }
        _observer.error(_data)
      }
    ).then(
      _data => _observer.next(_data)
    ).catch(
      _err => _observer.error(_err)
    )
  }

}