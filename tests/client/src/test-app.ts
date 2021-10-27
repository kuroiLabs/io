import { Syringe } from "@kuroi/syringe"
import { Observable } from "rxjs"
import { switchMap } from "rxjs/operators"
import { IPacket } from "../../../src/net"
import { ClientPacket } from "../../../src/net/client"
import { BasePacketHandler } from "../../../src/utils"
import { TestClient } from "./test-client"

enum PACKETS {
  WELCOME,
  MESSAGE
}

@Syringe.Injectable({
  scope: "global"
})
export class TestApp extends BasePacketHandler implements Syringe.OnInit {

  private root: string = `http://localhost:6969`

  constructor(
    @Syringe.Inject(TestClient) private client: TestClient
  ) {
    super()
  }

  onInit(): void {
    const _lobbyId: string = location.hash
    const _connection: Observable<ClientPacket> = _lobbyId ?
      this.client.connect(`${this.root}/${_lobbyId}`) :
      this.client.createLobby(this.root + "/api/newlobby").pipe(
        switchMap(_lobby =>
          this.client.connect(`${this.root}/${_lobby.id}`)
        )
      )

    _connection.subscribe({
      next: _packet => this._emitPacket(_packet)
    })

    this.on(PACKETS.WELCOME, this._onWelcome)
    this.on(PACKETS.MESSAGE, this._onMessage)

    this._setUpListeners()
  }

  private _emitPacket(_packet: IPacket): void {
    const _packetId: byte = _packet.readByte()
    this.emit(_packetId, _packet)
  }

  private _onWelcome(_packet: IPacket): void {
    const _clientId: byte = _packet.readByte()
    console.log("Received welcome packet from server and client ID [" + _clientId + "]")
  }

  private _onMessage(_packet: IPacket): void {
    const _clientId: byte = _packet.readByte()
    const _message: string = _packet.readString()
    console.log(
      "Received message from client [" + _clientId + "]",
      _message
    )
  }

  public sendMessage(_message: string): void {
    const _bytes: Uint8Array = this.encoder.encode(_message)
    const _byteLength: int = _bytes.byteLength + (Uint8Array.BYTES_PER_ELEMENT * 2)
    const _buffer: ArrayBuffer = new ArrayBuffer(_byteLength)
    const _packet = new ClientPacket(_buffer)
    _packet.writeByte(PACKETS.MESSAGE)
    _packet.writeByte(this.client.id as byte)
    _packet.writeBytes(_bytes)
  }

  private _setUpListeners(): void {
    const _textbox: HTMLTextAreaElement = document.getElementById("user-input") as HTMLTextAreaElement
    const _button: HTMLButtonElement = document.getElementById("submit-button") as HTMLButtonElement
    _button?.addEventListener("click", () => {
      if (_textbox && _textbox.value)
        this.sendMessage(_textbox.value)
    })
  }

}

