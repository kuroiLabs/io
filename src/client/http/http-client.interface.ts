import { Observable } from "rxjs"
import { IHttpOptions } from "./http-options.interface"

export interface IHttpClient {
  get<T = any>(url: string, options?: IHttpOptions): Observable<T>
  patch<T = any>(url: string, body: any, options?: IHttpOptions): Observable<T>
  post<T = any>(url: string, body: any, options?: IHttpOptions): Observable<T>
  put<T = any>(url: string, body: any, options?: IHttpOptions): Observable<T>
  delete<T = any>(url: string, options?: IHttpOptions): Observable<T>
}