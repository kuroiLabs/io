import { Syringe } from "@kuroi/syringe"
import express from "express"
import http from "http"
import { Route } from "../../src/route"
import { BaseServer } from "../../src/server"
import { LobbyRoute } from "./lobby-route"
import { EXPRESS, PORT } from "./test-api-tokens"
import { TestRoute } from "./test-route"

@Syringe.Injectable({
  scope: "global"
})
export class TestServer extends BaseServer {
  constructor(
    @Syringe.Inject(EXPRESS) api: express.Express,
    @Syringe.Inject(PORT) port: number,
    @Syringe.Inject(LobbyRoute) lobbyRoute: LobbyRoute,
    @Syringe.Inject(TestRoute) testRoute: Route 
  ) {
    super(api, port, [lobbyRoute, testRoute], [])
  }

  public start(): void {
    http.createServer(this.api).listen(this.port, () => {
      console.log("[TestServer] ::: Successfully started HTTP server")
    })
  }
}
