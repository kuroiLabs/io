import * as Syringe from "@kuroi/syringe"
import cors from "cors"
import express from "express"
import http from "http"
import { BaseLobbyManager, BaseServer } from "../../src/server"
import { LobbyRoute } from "./lobby-route"
import { EXPRESS, PORT } from "./test-api-tokens"
import { TestCorsGuard } from "./test-cors.guard"
import { TestLobbyManager } from "./test-lobby-manager"
import { TestRoute } from "./test-route"

@Syringe.Injectable({
  scope: "global"
})
export class TestServer extends BaseServer implements Syringe.OnInit {
  constructor(
    @Syringe.Inject(EXPRESS) api: express.Express,
    @Syringe.Inject(PORT) port: number,
    @Syringe.Inject(LobbyRoute) lobbyRoute: LobbyRoute,
    @Syringe.Inject(TestRoute) testRoute: TestRoute,
    @Syringe.Inject(TestCorsGuard) corsGuard: TestCorsGuard,
    @Syringe.Inject(TestLobbyManager) lobbyManager: BaseLobbyManager
  ) {
    super(api, port, [lobbyRoute, testRoute], [corsGuard], lobbyManager)
  }

  onInit(): void {
    this.api.use(cors())
  }

  public start(): void {
    this.httpServer = http.createServer(this.api).listen(this.port, () => {
      console.log("[TestServer] Successfully started HTTP server on port:" + this.port)
      this.enableWebSockets()
    })
  }

}
