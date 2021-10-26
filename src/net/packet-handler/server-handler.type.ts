import WebSocket from 'ws'
import { IPacket } from '../packet.interface'

export type ServerPacketHandler = (
  _clientId: uint32,
  _packet: IPacket,
  _clients?: Map<uint32, WebSocket>
) => void
