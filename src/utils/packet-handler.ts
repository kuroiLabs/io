import { IPacket } from "../net/packet.interface"

type PacketHandlerCallback = (_packet: IPacket<any>, ..._args: any[]) => void

export abstract class BasePacketHandler {

  protected encoder: TextEncoder = new TextEncoder()

  protected decoder: TextDecoder = new TextDecoder()

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
    if (_index > -1)
      _callbacks.splice(_index, 1)
  }

  public emit(_packetId: byte, _packet: IPacket<any>, ..._args: any[]): void {
    const _callbacks: PacketHandlerCallback[] = this._events.get(_packetId) || []
    _callbacks.forEach(_callback => _callback(_packet, ..._args))
  }

} 