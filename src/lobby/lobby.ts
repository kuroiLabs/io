import { Numeric } from '@kuroi/numeric'
import WebSocket from 'ws'
import { IPacket } from '../net'
import { ServerPacket } from '../net/server'
import { BasePacketHandler } from '../utils'
import { ILobby } from './lobby.interface'

export interface Lobby {
  onClose?(client: WebSocket, id: byte): void
  onDestroy?(): void
  onHandshake?(client: WebSocket, id: byte): void
  onJoin?(client: WebSocket, id: byte): void
  onLeave?(client: WebSocket, id: byte): void
}

type LobbyPacketHandlerCallback = (
  packet: IPacket<Buffer>,
  clientId: uint16,
  clientMap: Map<uint32, WebSocket>
) => void

export abstract class Lobby extends BasePacketHandler<LobbyPacketHandlerCallback> implements ILobby {

  public static readonly DEFAULT_MAX_CLIENTS: byte = 12

  public clients: Map<uint32, WebSocket>

  public id: uint16

  public name: string

  public maxClients: byte

  public wss: WebSocket.Server

  constructor(_lobby?: ILobby) {
    super()
    this.id = _lobby && _lobby.id || Numeric.generate.generateNumericId()
    this.name = _lobby && _lobby.name || ''
    this.maxClients = _lobby && _lobby.maxClients || Lobby.DEFAULT_MAX_CLIENTS
    this.wss = new WebSocket.Server({ noServer: true })
    this.clients = new Map<uint32, WebSocket>()
    this.connect()
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
      return console.error('NO ID!', _id)
    this.clients.set(_id, _client)
    _client.on('open', this._connectionOpened.bind(this, _id))
    _client.on('message', this._messageReceived.bind(this))
    _client.on('close', this._clientClosed.bind(this, _id))
    if (this.onJoin)
      this.onJoin(_client, _id)
  }

  public connect(): void {
    this.wss.on('connection', (_client: WebSocket) => {
      this._handshake(_client)
    })
  }

  private _handshake(_client: WebSocket): void {
    if (this.clients.size >= this.maxClients)
      return _client.close()
    const _id: byte = Numeric.generate.generateNumericId()
    if (this.onHandshake)
      this.onHandshake(_client, _id)
    this.add(_id, _client)
  }

  public remove(_clientId: uint32): void {
    const _client = this.clients.get(_clientId)
    if (_client) {
      if (this.onLeave)
        this.onLeave(_client, _clientId)
      this.clients.delete(_clientId)
    }
  }

  private _connectionOpened(_clientId: uint32): void {
    console.log(`Client [${_clientId}] connected!`)
  }

  private _messageReceived(_data: WebSocket.Data): void {
    const _packet = new ServerPacket(_data as Buffer)
    const _packetId: byte = _packet.readByte()
    const _clientId: byte = _packet.readByte()
    this.emit(_packetId, _packet, _clientId, this.clients)
  }

  private _clientClosed(_clientId: uint32): void {
    const _client = this.clients.get(_clientId)
    if (_client) {
      _client.removeAllListeners()
      if (this.onClose)
        this.onClose(_client, _clientId)
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
  }

}