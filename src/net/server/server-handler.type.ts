import WebSocket from 'ws'
import { ServerPacket } from './server-packet'

export type ServerPacketHandler = (
  _clientId: uint32,
  _packet: ServerPacket,
  _clients?: Map<uint32, WebSocket>
) => void
