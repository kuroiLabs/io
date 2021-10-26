import { Syringe } from "@kuroi/syringe"
import http from "http"
import express from "express"
import { Route } from "../src/route"
import { BaseServer } from "../src/server"
import { TestGuard } from "./test-guard"

@Syringe.Injectable({
  scope: "global"
})
export class TestServer extends BaseServer {
  constructor(
    api: express.Express,
    port: number,
    @Syringe.Inject(TestGuard) _testRoute: Route 
  ) {
    super(api, port, [_testRoute], [])
  }

  public start(): void {
    http.createServer(this.api).listen(this.port, () => {
      console.log("TestServer::: Successfully started HTTP server")
    })
  }
}
