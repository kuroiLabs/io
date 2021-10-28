import { GeneratorService } from "@kuroi/numeric/generate"
import { isUInt16 } from "@kuroi/numeric/typing"
import { Syringe } from "@kuroi/syringe"
import { Request, Response } from "express"
import { BaseLobbyManager, Delete, Post, Route } from "../../src/server"
import { TestLobby } from "./test-lobby"
import { TestLobbyManager } from "./test-lobby-manager"

@Syringe.Injectable()
export class LobbyRoute extends Route {

  constructor(
    @Syringe.Inject(TestLobbyManager)
    private lobbyManager: BaseLobbyManager,
    private _generator = new GeneratorService()
  ) {
    super("lobby", LobbyRoute)
  }

  @Post("/new")
  public newLobby(_request: Request, _response: Response) {
    try {
      const _lobby = new TestLobby({
        name: "My Lobby",
        id: this._generator.generateNumericId(),
        maxClients: 2
      })
      this.lobbyManager.addLobby(_lobby)
      _response.status(200).json(_lobby.getConfig())
    } catch (_err) {
      console.error('[LobbyRoute.newLobby] :::  uncaught exception', _err)
      _response.status(500).json(new Error("Internal server error"))
    }
  }

  @Delete("/:lobbyId")
  public endLobby(_request: Request, _response: Response): void {
    const _lobbyId: uint16 = +_request.params.lobbyId
    if (!isUInt16(_lobbyId)) {
      _response.status(400).json(new Error("Invalid lobby ID: " + _lobbyId))
      return
    }
    const _lobby = this.lobbyManager.getLobby(_lobbyId)
    _lobby?.destroy()
    this.lobbyManager.removeLobby(_lobbyId)
    _response.status(200).json(null)
  }

}
