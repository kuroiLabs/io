import { GeneratorService } from "@kuroi/numeric/generate"
import { Syringe } from "@kuroi/syringe"
import { Request, Response } from "express"
import { Post } from "../../src/endpoint"
import { Lobby } from "../../src/lobby"
import { Route } from "../../src/route"
import { TestLobby } from "./test-lobby"

@Syringe.Injectable()
export class LobbyRoute extends Route {

  public lobbies: Map<uint32, Lobby> = new Map()

  // @todo: create an injection token for this and add to constructor
  private _generator = new GeneratorService()

  constructor() {
    super("test")
  }

  @Post("/newlobby")
  public newLobby(_request: Request, _response: Response) {
    try {
      const _lobby = new TestLobby({
        id: this._generator.generateNumericId(),
        name: GeneratorService.randomString(),
        maxClients: 2
      })
      this.lobbies.set(_lobby.id, _lobby)
      _response.json(_lobby.getConfig())
      console.log("[LobbyRoute.newLobby] ::: Succesfully created new Lobby [" + _lobby.id + "]")
    } catch (_err) {
      console.error('[LobbyRoute.newLobby] :::  uncaught exception', _err)
      _response.sendStatus(500).json({ error: 'Internal server error' })
    }
  }

}
