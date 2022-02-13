import { GeneratorService } from "@kuroi/numeric/generate"
import { Syringe } from "@kuroi/syringe"
import { Request, Response } from "express"
import { BaseLobbyManager, Delete, Post, BaseRoute, Route } from "../../src/server"
import { TestLobby } from "./test-lobby"
import { TestLobbyManager } from "./test-lobby-manager"

@Syringe.Injectable()
@Route
export class LobbyRoute extends BaseRoute {

	constructor(
		@Syringe.Inject(TestLobbyManager)
		private lobbyManager: BaseLobbyManager,
		private _generator = new GeneratorService()
	) {
		super("lobby")
	}

	@Post("/new")
	public newLobby(_request: Request, _response: Response) {
		try {
			const _lobby = new TestLobby({
				name: "My Lobby",
				id: this._generator.randomString(),
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
		const _lobbyId: string = _request.params.lobbyId
		if (!_lobbyId) {
			_response.status(400).json(new Error("Invalid lobby ID: " + _lobbyId))
			return
		}
		const _lobby = this.lobbyManager.getLobby(_lobbyId)
		_lobby?.destroy()
		this.lobbyManager.removeLobby(_lobbyId)
		_response.status(200).json(null)
	}

}
