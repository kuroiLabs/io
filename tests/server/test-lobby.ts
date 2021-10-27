import WebSocket from "ws"
import { PACKETS } from "../common/packets.enum"
import { Lobby } from "../../src/lobby"
import { ServerPacket } from "../../src/net/server"

export class TestLobby extends Lobby {
  public onHandshake(_client: WebSocket, _clientId: byte): void {
    // allocate 2 byte buffer for packet
    const _buffer = Buffer.alloc(Uint8Array.BYTES_PER_ELEMENT * 2)
    const _packet = new ServerPacket(_buffer)
    // write two bytes to packet: packet id and the client's new id
    _packet.writeBytes([PACKETS.WELCOME, _clientId])
    _client.send(_packet.data())
  }
}