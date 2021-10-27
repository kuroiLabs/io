import { Lobby } from "./lobby"

export abstract class LobbyManager {
  private lobbies: Map<int, Lobby>

  constructor() {
    this.lobbies = new Map()
  }

  public addLobby(_lobby: Lobby): void {
    this.lobbies.set(_lobby.id, _lobby)
  }

  public removeLobby(_lobbyId: int): void {
    this.lobbies.delete(_lobbyId)
  }

  public getLobby(_lobbyId: int): Lobby | null {
    return this.lobbies.get(_lobbyId) || null
  }

}