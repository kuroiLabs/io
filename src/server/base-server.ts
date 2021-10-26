import express from 'express'
import { Guard } from '../guard'
import { ILobby, Lobby } from '../lobby'
import { Route } from '../route'

export abstract class BaseServer {

  public lobbies: ILobby[] = []

  constructor(
    public api: express.Express,
    public port: number,
    public routes: Route[],
    public guards: Guard[]
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
    for (let i = 0; i < this.routes.length; i++)
      this.api.use(this.routes[i].path, this.routes[i].router)
  }

  private configureGuards(): void {
    for (let i = 0; i < this.guards.length; i++)
      this.api.use(this.guards[i].handler)
  }

  public abstract start(): void

}
