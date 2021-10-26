import { Numeric } from '@kuroi/numeric'
import WebSocket from 'ws'
import { ServerPacket } from '../net/server'
import { BasePacketHandler } from '../utils'
import { ILobby } from './lobby.interface'

export class Lobby extends BasePacketHandler implements ILobby {

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

  public connect(): void {
    this.wss.on('connection', (_client: WebSocket) => {
      this.handshake(_client)
    })
  }

  private handshake(_client: WebSocket): void {
    if (this.clients.size >= this.maxClients) {
      return _client.close()
    }
    const id: byte = Numeric.generate.generateNumericId()
    // allocate 2 byte buffer for packet
    const _buffer = Buffer.alloc(Uint8Array.BYTES_PER_ELEMENT * 2)
    const _packet = new ServerPacket(_buffer)
    // write two bytes to packet: packet id and the client's new id
    _packet.writeBytes([0, id])
    _client.send(_packet.data())
    this.add(id, _client)
  }

  public add(id: byte, _client: WebSocket): void {
    if (!id) {
      console.error('NO ID!', id)
      return
    }
    this.clients.set(id, _client)
    _client.on('open', this.onOpen.bind(this, id))
    _client.on('message', this.onMessage.bind(this))
    _client.on('close', this.onClose.bind(this, id))
  }

  public remove(_clientId: uint32): void {
    this.clients.delete(_clientId)
  }

  private onOpen(_clientId: uint32): void {
    console.log(`Client [${_clientId}] connected!`)
  }

  private onMessage(_data: WebSocket.Data): void {
    const _packet = new ServerPacket(_data as Buffer)
    const _packetId: byte = _packet.readByte()
    const _clientId: byte = _packet.readByte()
    this.emit(_packetId, _clientId, _packet, this.clients)
  }

  private onClose(clientId: uint32): void {
    const _client = this.clients.get(clientId)
    if (_client)
      _client.removeAllListeners()  
  }

  public setMaxClients(_max: byte): void {
    this.maxClients = _max
  }

  public destroy(): void {
    this.clients.forEach(_client => _client.close())
    this.wss.close()
  }

}