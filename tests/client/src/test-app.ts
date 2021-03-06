import * as Syringe from "@kuroi/syringe"
import { switchMap } from "rxjs/operators"
import { ClientPacket, ClientSerializationEvent } from "../../../src/client/net"
import { Destroyable, ReservedPackets, Rpc, RpcListener } from "../../../src/common"
import { PACKETS, ChatMessage } from "../../common"
import { MessageService } from "./message.service"
import { TestClient } from "./test-client"

@Syringe.Injectable({
	scope: "global"
})
@RpcListener("TestApp")
export class TestApp extends Destroyable implements Syringe.OnInit {

	private root: string = `localhost:6969`

	private get apiRoot(): string {
		return `http://${this.root}/api/lobby`
	}

	private get wsRoot(): string {
		return `ws://${this.root}`
	}

	constructor(
		@Syringe.Inject(TestClient)
		private _client: TestClient,

		@Syringe.Inject(MessageService)
		private _messages: MessageService
	) {
		super();
	}

	onInit(): void {
		console.log("[TestApp.onInit] ::: TestApp successfully initialized")
		const _lobbyId: string = location.hash && location.hash.replace("#", "")
		if (_lobbyId) {
			const _url: string = `${this.wsRoot}/lobby/${_lobbyId}`
			this._client.connect(_url).subscribe({
				next: _packet => this._emitPacket(_packet)
			})
		}

		this._client.on(ReservedPackets.WELCOME, this._onWelcome.bind(this))
		this._client.on(PACKETS.MESSAGE, this._onMessage.bind(this))

		this._setUpListeners()
	}

	private _emitPacket(_packet: ClientPacket): void {
		const _packetId: byte = _packet.readByte()
		this._client.emit(_packetId, _packet)
	}

	private _onWelcome(_packet: ClientPacket): void {
		const _clientId: byte = _packet.readByte()
		this._client.id = _clientId
		console.log("Received welcome packet from server and client ID [" + _clientId + "]")
	}

	private _onMessage(_packet: ClientPacket): void {
		const _chatMessage = ChatMessage.deserialize(_packet)
		this._messages.addMessage(_chatMessage)
	}

	public sendMessage(_message: string): void {
		const _chatMessage = new ChatMessage(<byte>this._client.id, _message)
		const _serializationEvent = new ClientSerializationEvent(PACKETS.MESSAGE, this._client.encoder)
		_chatMessage.serialize(_serializationEvent)
		this._client.send(_serializationEvent.getPacket())
		this._messages.addMessage(_chatMessage)
	}

	private _setUpListeners(): void {
		document.addEventListener("DOMContentLoaded", () => {
			const _messageBox: HTMLTextAreaElement = document.getElementById("message-input") as HTMLTextAreaElement
			const _sendMessageButton: HTMLButtonElement = document.getElementById("send-button") as HTMLButtonElement
			const _newLobbyButton: HTMLButtonElement = document.getElementById("new-lobby-button") as HTMLButtonElement
			_sendMessageButton?.addEventListener("click", () => {
				if (_messageBox && _messageBox.value) {
					this.sendMessage(_messageBox.value)
					_messageBox.value = ""
				}
			})
			_newLobbyButton?.addEventListener("click", () => this._createLobby())
			_messageBox.addEventListener("keydown", e => {
				if (
					e.key.toLowerCase() === "enter" &&
					_messageBox &&
					_messageBox.value
				) {
					e.preventDefault()
					this.sendMessage(_messageBox.value)
					_messageBox.value = ""
					_messageBox.blur()
				}
			})
			window.addEventListener("unload", () => {
				if (this._client.socket?.readyState === WebSocket.OPEN)
					this._client.socket.close()
			})
		})
	}

	private _createLobby(): void {
		console.log("Attempting to create lobby...")
		this._client.createLobby(this.apiRoot + "/new").pipe(
			switchMap(_lobby => {
				alert("Welcome to lobby: " + _lobby.id)
				return this._client.connect(`${this.wsRoot}/lobby/${_lobby.id}`)
			})
		).subscribe({
			next: _packet => {
				this._emitPacket(_packet)
			}
		})
	}

	@Rpc("exampleRpc")
	public exampleRpc(_message: string): void {
		console.log("[RPC][TestApp.exampleRpc]", _message);
	}

}

