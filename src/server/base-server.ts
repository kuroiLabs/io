import express from "express"
import http from "http"
import https from "https"
import { BaseLobbyManager } from "./lobby"
import { Guard, Route } from "./rest"

export abstract class BaseServer {

  protected httpServer?: http.Server | https.Server

  constructor(
    public api: express.Express,
    public port: number,
    public routes: Route[] = [],
    public guards: Guard[] = [],
    private lobbyManager?: BaseLobbyManager
  ) {
    this._configureGuards()
    this._configureRoutes()
  }

  private _configureRoutes(): void {
    for (let i = 0; i < this.routes.length; i++)
      this.api.use(this.routes[i].path, this.routes[i].router)
  }

  private _configureGuards(): void {
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
          if (_lobbyId && +_lobbyId === _lobby.id)
            _lobby.upgrade(_request, _socket, _head)
        })
      }
    })
  }

}
