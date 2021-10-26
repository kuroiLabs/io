import WebSocket from "ws"
import { IPacket } from "../net/packet.interface"

type ClientMap = Map<int, WebSocket>

type PacketHandlerCallback = (
  _clientId: int,
  _packet: IPacket,
  _clients?: ClientMap
) => void

export abstract class BasePacketHandler {

  private _events = new Map<string | int, PacketHandlerCallback[]>()

  public on(_packetId: byte, _callback: PacketHandlerCallback): void {
    if (!this._events.has(_packetId))
      this._events.set(_packetId, [])
    const _callbacks: PacketHandlerCallback[] = this._events.get(_packetId) || []
    if (_callbacks.indexOf(_callback) > -1)
      return
    _callbacks.push(_callback)
  }

  public off(_eventName: string, _callback: PacketHandlerCallback): void {
    if (!this._events.has(_eventName))
      return
    const _callbacks: PacketHandlerCallback[] = this._events.get(_eventName) || []
    const _index: int = _callbacks.indexOf(_callback)
    if (_index > -1) {
      _callbacks.splice(_index, 1)
    }
  }

  public emit(_packetId: byte, _clientId: int, _packet: IPacket, _clients?: ClientMap): void {
    const _callbacks: PacketHandlerCallback[] = this._events.get(_packetId) || []
    _callbacks.forEach(_callback => _callback(_clientId, _packet, _clients))
  }

} 