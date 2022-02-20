import WebSocket from "ws"
import { ILobby } from "../../src/common/lobby"
import { ReservedPackets } from "../../src/common/net"
import { Lobby, ServerPacket, ServerSerializationEvent } from "../../src/server"
import { ChatMessage, PACKETS } from "../common"

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
		const _chatMessage = ChatMessage.deserialize(_packet)

		console.log(`[TestLobby._onMessage] Received message from client [${_chatMessage.id}]: ${_chatMessage.message}`)

		const _serializationEvent = new ServerSerializationEvent(PACKETS.MESSAGE)
		_chatMessage.serialize(_serializationEvent)
		const _out = _serializationEvent.getPacket()

		this.clients.forEach((_client, _id) => {
			if (_id !== _chatMessage.id && _client.readyState === WebSocket.OPEN)
				_client.send(_out.data())
		})
	}

}