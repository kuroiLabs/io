import { GeneratorService } from "@kuroi/numeric/generate"
import { isUInt16 } from "@kuroi/numeric/typing"
import { Syringe } from "@kuroi/syringe"
import { Request, Response } from "express"
import { Delete, Post } from "../../src/endpoint"
import { ILobbyManager, Lobby } from "../../src/lobby"
import { Route } from "../../src/route"
import { TestLobby } from "./test-lobby"

@Syringe.Injectable()
export class LobbyRoute extends Route implements ILobbyManager {

  private lobbies = new Map<uint16, Lobby>()

  constructor(
    // @todo: create an injection token for this
    private _generator = new GeneratorService()
  ) {
    super("lobby")
  }

  public addLobby(_lobby: Lobby): void {
    this.lobbies.set(_lobby.id, _lobby)
  }

  public removeLobby(_lobbyId: number): void {
    this.lobbies.delete(_lobbyId)
  }

  public getLobby(_lobbyId: number): Lobby | null {
    return this.lobbies.get(_lobbyId) || null
  }

  @Post("/new")
  public newLobby(_request: Request, _response: Response) {
    try {
      const _lobby = new TestLobby({
        id: this._generator.generateNumericId(),
        name: this._generator.randomString(),
        maxClients: 2
      })
      this.addLobby(_lobby)
      console.log("[LobbyRoute.newLobby] ::: Succesfully created new Lobby [" + _lobby.id + "]")
      return _response.json(_lobby.getConfig())
    } catch (_err) {
      console.error('[LobbyRoute.newLobby] :::  uncaught exception', _err)
      return _response.sendStatus(500).json({ error: 'Internal server error' })
    }
  }

  @Delete("/:lobbyId")
  public endLobby(_request: Request, _response: Response) {
    const _lobbyId: uint16 = +_request.params.lobbyId
    if (!isUInt16(_lobbyId))
      return _response.sendStatus(400).json({
        error: "Invalid lobby ID"
      })
    const _lobby = this.getLobby(_lobbyId)
    _lobby?.destroy()
    this.removeLobby(_lobbyId)
    return _response.sendStatus(200)
  }

}
