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

  private _socketOpenHandler!: Function

  private _socketErrorHandler!: Function

  private _socketMessageHandler!: Function

  get stream$(): Observable<ClientPacket> {
    if (!this._stream) {
      this._stream = this._startStream().pipe(shareReplay(1))
    }
    return this._stream
  }

  /* Unsubscribe to disconnect */
  public connect(_url: string): Observable<ClientPacket> {
    try {
      if (this.beforeConnect)
        this.beforeConnect()
      if (this.socket)
        this._disconnect()
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

  private _createSocket(_url: string): WebSocket {
    const _socket = new WebSocket(_url)
    _socket.binaryType = "arraybuffer"
    return _socket
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
    const _messageHandler = (_event: any) => _observer.next(new ClientPacket(_event.data))
    const _connectionHandler = () => {
      if (this.onConnect)
        this.onConnect()
      this.state = WebSocket.OPEN
      _socket.addEventListener("message", _messageHandler)
    }
    _socket.addEventListener("open", _connectionHandler)
    this._socketOpenHandler = _connectionHandler
    this._socketMessageHandler = _messageHandler
  }

  private _handleConnectionErrors(_socket: WebSocket, _observer: Subscriber<ClientPacket>): void {
    const _handler = (_context: WebSocket, _error: Event) => {
      if (this.onError)
        this.onError(_error)
      console.error(new Error("kuroi.io.client.WebClient encountered error during packet stream"))
    }
    _socket.addEventListener("error", _handler.bind(this, _socket))
    this._socketErrorHandler = _handler
  }

  private _disconnect(): void {
    if (this.state === WebSocket.CLOSED)
      return

    if (this.beforeDisconnect)
      this.beforeDisconnect()

    this.socket?.close()
    this.state = WebSocket.CLOSED
    this._resetSocket()

    if (this.onDisconnect)
      this.onDisconnect()
  }

  private _resetSocket(): void {
    if (this.socket) {
      this.socket.removeEventListener("open", this._socketOpenHandler.bind(this))
      this.socket.removeEventListener("error", this._socketErrorHandler.bind(this))
      this.socket.removeEventListener("message", this._socketMessageHandler.bind(this))
      this.socket = undefined
    }
    this._stream = undefined
  }

}