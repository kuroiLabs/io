import { Observable, Subscriber, throwError } from "rxjs"
import { tap } from "rxjs/operators"
import { ILobby } from "../../lobby"
import { ClientPacket } from "./client-packet"
import { IHttpClient } from "./http/http-client.interface"

export interface BaseWebClient {
  beforeConnect?(): void
  onConnect?(): void
  onError?(_error: Event): void
}

export abstract class BaseWebClient {
  
  public id: byte | uint16 | uint32 | undefined

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
      return new Observable<ClientPacket>(_observer => {
        if (this.socket) {
          this._handleConnectionStream(this.socket, _observer)
          this._handleConnectionErrors(this.socket, _observer)
        }  
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

  public send(_packet: ClientPacket): void {
    if (!this.socket || this.socket.readyState === WebSocket.CLOSED) {
      console.warn("No available WebSocket")
      return
    }
    this.socket.send(_packet.data())
  }

  private _handleConnectionStream(_socket: WebSocket, _observer: Subscriber<ClientPacket>): void {
    _socket.addEventListener("open", () => {
      if (this.onConnect)
        this.onConnect()
      this.state = WebSocket.OPEN
      this.socket?.addEventListener("message", event =>
        _observer.next(new ClientPacket(event.data))
      )
    })
  }

  private _handleConnectionErrors(_socket: WebSocket, _observer: Subscriber<ClientPacket>): void {
    _socket.addEventListener("error", _error => {
      if (this.onError)
        this.onError(_error)
      _observer.error(_error)
    })
  }

}