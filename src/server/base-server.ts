import express from 'express'
import { Guard } from '../guard'
import { ILobby, Lobby } from '../lobby'
import { Route } from '../route'

export abstract class BaseServer {

  public routes: Route[] = []

  public guards: Guard[] = []

  public lobbies: ILobby[] = []

  constructor(
    public api: express.Express,
    public port: number
  ) {

  }

  public addLobby(_lobby: ILobby): Lobby {
    const _newLobby: Lobby = new Lobby(_lobby)
    this.lobbies.push(_newLobby)
    return _newLobby
  }

  public removeLobby(_lobbyId: uint16): void {
    const _lobbyIndex: int = this.lobbies.findIndex(_lobby =>
      _lobby.id === _lobbyId
    )
    if (_lobbyIndex > -1)
      this.lobbies.splice(_lobbyIndex, 1)
  }

  public onInit(): void {
    this.configureGuards()
    this.configureRoutes()
  }

  private configureRoutes(): void {
    if (this.routes)
      for (const route of this.routes)
        this.api.use(route.path, route.router)
  }

  private configureGuards(): void {
    if (this.guards) {
      for (const _guard of this.guards)
        if (_guard && _guard.handler)
          this.api.use(_guard.handler)
    }
  }

}
