import { GeneratorService } from "@kuroi/numeric/generate"
import http from "http"
import WebSocket from "ws"
import { ILobby } from "../../common/lobby"
import { BasePacketHandler } from "../../common/utils"
import { ServerPacket } from "../net"

type LobbyPacketHandlerCallback = (packet: ServerPacket) => void

export interface Lobby {
  onClose?(client: WebSocket, ...args: any[]): void
  onDestroy?(): void
  onHandshake?(client: WebSocket, ...args: any[]): void
  onJoin?(client: WebSocket, ...args: any[]): void
  onLeave?(client: WebSocket, ...args: any[]): void
}

export abstract class Lobby extends BasePacketHandler<LobbyPacketHandlerCallback> implements ILobby {

  public static readonly DEFAULT_MAX_CLIENTS: byte = 12

  protected clients: Map<uint32, WebSocket>

  public id: string

  public name: string

  public maxClients: byte

  public wss: WebSocket.Server

  private _generator: GeneratorService = new GeneratorService()

  constructor(_lobby: ILobby) {
    super()
    this.id = _lobby && _lobby.id 
    this.name = _lobby && _lobby.name || ""
    this.maxClients = _lobby && _lobby.maxClients || Lobby.DEFAULT_MAX_CLIENTS
    this.wss = new WebSocket.Server({ noServer: true })
    this.clients = new Map<uint32, WebSocket>()
    this._openConnection()
  }

  private _openConnection(): void {
    this.wss.on("connection", this._handshake.bind(this))
  }

  private _handshake(_client: WebSocket): void {
    if (this.clients.size >= this.maxClients)
      return _client.close()
    const _id: byte = this._generator.generateNumericId()
    if (this.onHandshake)
      this.onHandshake(_client, _id)
    this.add(_id, _client)
  }

  public getConfig(): ILobby {
    return {
      id: this.id,
      name: this.name,
      maxClients: this.maxClients
    }
  }

  public add(_id: byte, _client: WebSocket): void {
    if (!_id)
      return console.error("Invalid client ID:", _id)
    this.clients.set(_id, _client)
    _client.on("open", this._connectionOpened.bind(this, _client, _id))
    _client.on("message", this._messageReceived.bind(this))
    _client.on("close", this._clientClosed.bind(this, _id))
    if (this.onJoin)
      this.onJoin(_client, _id)
  }

  private _connectionOpened(_client: WebSocket, _clientId: byte): void {
    if (this.onJoin)
      this.onJoin(_client, _clientId)
  }

  private _messageReceived(_data: WebSocket.Data): void {
    const _packet: ServerPacket = new ServerPacket(_data as Buffer)
    const _packetId: byte = _packet.readByte()
    this.emit(_packetId, _packet)
  }

  private _clientClosed(_clientId: uint32): void {
    const _client = this.clients.get(_clientId)
    if (_client) {
      _client.removeAllListeners()
      if (this.onClose)
        this.onClose(_client, _clientId)
      this.clients.delete(_clientId)
    }
    if (!this.clients.size) {
      this.destroy()
    }
  }

  public upgrade(request: http.IncomingMessage, socket: any, head: any): void {
    this.wss.handleUpgrade(request, socket, head, (_ws: WebSocket) =>
      this.wss.emit("connection", _ws, request)
    )
  }

  public remove(_clientId: byte): void {
    const _client = this.clients.get(_clientId)
    if (_client) {
      if (this.onLeave)
        this.onLeave(_client, _clientId)
      _client.close()
      this.clients.delete(_clientId)
    }
  }

  public setMaxClients(_max: byte): void {
    this.maxClients = _max
  }

  public destroy(): void {
    this.clients.forEach(_client => _client.close())
    this.wss.close()
    if (this.onDestroy)
      this.onDestroy()
    this.emit("destroy")
  }

}