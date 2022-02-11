import WebSocket from "ws"
import { ILobby } from "../../src/common/lobby"
import { ReservedPackets } from "../../src/common/net"
import { Lobby, ServerPacket } from "../../src/server"
import { PACKETS } from "../common/packets.enum"

export class TestLobby extends Lobby {

  constructor(_lobby: ILobby) {
    super(_lobby)
    this.on(PACKETS.MESSAGE, this._onMessage.bind(this))
    this.on("destroy", () => {
      console.log(`Destroying lobby [${this.id}]...`)
    })
  }

  public onHandshake(_client: WebSocket, _clientId: byte): void {
    console.log("[TestLobby.onHandshake] Handshaking client [" + _clientId + "]")
    // allocate 2 byte buffer for packet
    const _buffer = Buffer.alloc(Uint8Array.BYTES_PER_ELEMENT * 2)
    const _packet = new ServerPacket(_buffer)
    // write two bytes to packet: packet id and the client's new id
    _packet.writeBytes([ReservedPackets.WELCOME, _clientId])
    _client.send(_packet.data())
	// call example RPC too, why not
	const _rpcCall = this.encoder.encode(JSON.stringify({
		api: "TestApp.exampleRpc",
		arguments: ["Server RPC Message!"]
	}));
	const _rpcBuffer = Buffer.alloc(Uint8Array.BYTES_PER_ELEMENT + _rpcCall.byteLength);
	const _rpcPacket = new ServerPacket(_rpcBuffer);
	_rpcPacket.writeBytes([ReservedPackets.RPC, ..._rpcCall]);
	_client.send(_rpcPacket.data())
  }

  private _onMessage(_packet: ServerPacket): void {
    const _clientId: byte = _packet.readByte()
    const _message: string = _packet.readString()

    console.log(`[TestLobby._onMessage] Received message from client [${_clientId}]: ${_message}`)

    const _bytes: Uint8Array = this.encoder.encode(_message)
    const _byteLength: int = (Uint8Array.BYTES_PER_ELEMENT * 2) + _bytes.byteLength
    const _buffer: Buffer = Buffer.alloc(_byteLength)
    const _out: ServerPacket = new ServerPacket(_buffer)

    _out.writeBytes([PACKETS.MESSAGE, _clientId, ..._bytes])

    this.clients.forEach((_client, _id) => {
      if (_id !== _clientId && _client.readyState === WebSocket.OPEN)
        _client.send(_out.data())
    })
  }

}