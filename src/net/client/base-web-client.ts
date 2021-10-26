import { Observable, Subscriber, throwError } from "rxjs"
import { tap } from "rxjs/operators"
import { ILobby } from "../../lobby"
import { ClientPacket } from "./client-packet"
import { IHttpClient } from "./http/http-client.interface"
import { IWebClient } from "./web-client.interface"

export interface BaseWebClient {
  beforeConnect?(): void
  onConnect?(): void
  onError?(_error: Event): void
}

export abstract class BaseWebClient implements IWebClient {
  
  public id: int | undefined

  public socket: WebSocket | undefined

  public decoder: TextDecoder | undefined

  public encoder: TextEncoder | undefined

  public state: byte = WebSocket.CLOSED

  constructor(private http: IHttpClient) {

  }

  public createLobby(_url: string): Observable<ILobby> {
    return this.http.post<ILobby>(_url, null).pipe(
      tap(_lobby => console.log('Created lobby', _lobby))
    )
  }

  public connect(_url: string): Observable<ClientPacket> {
    try {
      if (this.beforeConnect)
        this.beforeConnect()
  
      this.socket = new WebSocket(_url)
      this.socket.binaryType = "arraybuffer"

      return new Observable<ClientPacket>((observer: Subscriber<any>) => {
        
        this.socket?.addEventListener("open", () => {
          if (this.onConnect)
            this.onConnect()
          this.state = WebSocket.OPEN
          this.socket?.addEventListener("message", event => {
            observer.next(new ClientPacket(event.data))
          })
        })
        
        this.socket?.addEventListener("error", _error => {
          if (this.onError)
            this.onError(_error)
          observer.error(_error)
        })

        return {
          unsubscribe: () => {
            this.socket?.close()
          }
        }
      })
    } catch (_err) {
      return throwError(() => _err)
    }
  }

}