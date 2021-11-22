import { Lobby } from "./lobby"

export interface ILobbyManager {
  addLobby(_lobby: Lobby): void
  removeLobby(_lobbyId: string): void
  getLobby(_lobbyId: string): Lobby | null
}
