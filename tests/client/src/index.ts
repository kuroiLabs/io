import { Syringe } from "@kuroi/syringe"
import { IPacket } from "../../../src/net"
import { BasePacketHandler } from "../../../src/utils"
import { TestClient } from "./test-client"

enum PACKETS {
  WELCOME,
  MESSAGE
}

@Syringe.Injectable({
  scope: "global"
})
class ClientApp extends BasePacketHandler implements Syringe.OnInit {

  constructor(
    @Syringe.Inject(TestClient) private client: TestClient
  ) {
    super()
  }

  onInit(): void {
    const _lobbyId: string = location.pathname
    if (_lobbyId) {
      this.client.connect(`http://localhost:6969/${_lobbyId}`).subscribe({
        next: _packet => {
          const _packetId: byte = _packet.readByte()
          this.emit(_packetId, _packet)
        }
      })
    }
    this.on(PACKETS.WELCOME, this.onWelcome)
  }

  private onWelcome(_packet: IPacket): void {
    const _clientId: byte = _packet.readByte()
    console.log("Received welcome packet from server and client ID [" + _clientId + "]")
  }

  private onMessage(_packet: IPacket): void {
    const _clientId: byte = _packet.readByte()
    const _message: string = _packet.readString()
    console.log(
      "Received message from client [" + _clientId + "]",
      _message
    )
  }

}

