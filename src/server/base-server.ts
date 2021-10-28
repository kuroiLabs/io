import express from "express"
import http from "http"
import https from "https"
import { Guard } from "../guard"
import { BaseLobbyManager } from "../lobby"
import { Route } from "../route"

export abstract class BaseServer {

  protected httpServer?: http.Server | https.Server

  constructor(
    public api: express.Express,
    public port: number,
    public ws: boolean = false,
    public routes: Route[] = [],
    public guards: Guard[] = [],
    private lobbyManager?: BaseLobbyManager
  ) {

  }

  public onInit(): void {
    this.configureGuards()
    this.configureRoutes()
  }

  private configureRoutes(): void {
    for (let i = 0; i < this.routes.length; i++)
      this.api.use(this.routes[i].path, this.routes[i].router)
  }

  private configureGuards(): void {
    for (let i = 0; i < this.guards.length; i++)
      this.api.use(this.guards[i].handler)
  }

  public abstract start(): void

  protected enableWebSockets(): void {
    if (!this.httpServer || !this.lobbyManager)
      return
    this.httpServer.on("upgrade", (_request: http.IncomingMessage, _socket: any, _head: any) => {
      if (!_request.url)
        return
      const _url: string = _request.url.substring(_request.url.indexOf('/'), _request.url.length)
      if (_url.startsWith("/lobby")) {
        const _lobbyId = _request.url.split('/').pop()
        this.lobbyManager?.getLobbies().forEach(_lobby => {
          if (_lobbyId && +_lobbyId === _lobby.id) {
            _lobby.upgrade(_request, _socket, _head)
          }
        })
      }
    })
  }

}
