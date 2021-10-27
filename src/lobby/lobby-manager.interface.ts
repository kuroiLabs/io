import { Lobby } from "./lobby"

export interface ILobbyManager {
  addLobby(_lobby: Lobby): void
  removeLobby(_lobbyId: int): void
  getLobby(_lobbyId: int): Lobby | null
}
