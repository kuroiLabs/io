import { Lobby } from "./lobby"
import { ILobbyManager } from "./lobby-manager.interface"

/**
 * @classdesc Basic lobby manager class for extension or instantiation
 */
export class BaseLobbyManager implements ILobbyManager {

  protected lobbies: Map<string, Lobby>

  constructor() {
    this.lobbies = new Map()
  }

  public addLobby(_lobby: Lobby): void {
    _lobby.on("destroy", () => this.removeLobby(_lobby.id))
    this.lobbies.set(_lobby.id, _lobby)
  }

  public removeLobby(_lobbyId: string): void {
    this.lobbies.delete(_lobbyId)
  }

  public getLobby(_lobbyId: string): Lobby | null {
    return this.lobbies.get(_lobbyId) || null
  }

  public getLobbies(): Lobby[] {
    return Array.from(this.lobbies.values())
  }

}