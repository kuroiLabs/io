import { Observable, Subscriber, throwError } from "rxjs"
import { shareReplay } from "rxjs/operators"
import { BasePacketHandler } from "../common/utils"
import { ClientPacket } from "./net/client-packet"

export interface WebClient {
  beforeConnect?(): void
  beforeDisconnect?(): void
  beforeSend?(packet: ClientPacket): boolean
  onConnect?(): void
  onDisconnect?(): void
  onError?(_error: any): void
}

export class WebClient extends BasePacketHandler {
  
  public id: byte | uint16 | uint32 | undefined

  public socket: WebSocket | undefined

  public state: byte = WebSocket.CLOSED

  public encoder: TextEncoder = new TextEncoder()

  public decoder: TextDecoder = new TextDecoder()

  private _stream: Observable<ClientPacket> | undefined

  get stream$(): Observable<ClientPacket> {
    if (!this._stream) {
      this._stream = this._startStream().pipe(shareReplay(1))
    }
    return this._stream
  }

  public connect(_url: string): Observable<ClientPacket> {
    try {
      if (this.beforeConnect)
        this.beforeConnect()
      this.socket = this._createSocket(_url)
      return this.stream$
    } catch (_err) {
      if (this.onError)
        this.onError(_err)
      return throwError(() => _err)
    }
  }

  public send(_packet: ClientPacket): void {
    if (!this.socket || this.socket.readyState === WebSocket.CLOSED) {
      console.warn("No available WebSocket")
      return
    }
    if (this.beforeSend) {
      const _proceed = this.beforeSend(_packet)
      if (!_proceed)
        return
    }
    this.socket.send(_packet.data())
  }

  private _disconnect(): void {
    if (this.state === WebSocket.CLOSED)
      return

    if (this.beforeDisconnect)
      this.beforeDisconnect()
    
    this.socket?.close()
    this.state = WebSocket.CLOSED

    if (this._stream)
      this._stream
    
    if (this.onDisconnect)
      this.onDisconnect()
  }

  private _startStream(): Observable<ClientPacket> {
    return new Observable<ClientPacket>(_observer => {
      if (this.socket) {
        this._handleConnectionStream(this.socket, _observer)
        this._handleConnectionErrors(this.socket, _observer)
      }
      return {
        unsubscribe: () => {
          this._disconnect()
        }
      }
    })
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
    })
  }

  private _createSocket(_url: string): WebSocket {
    const _socket = new WebSocket(_url)
    _socket.binaryType = "arraybuffer"
    return _socket
  }

}