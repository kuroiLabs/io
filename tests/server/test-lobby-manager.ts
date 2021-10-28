import { Syringe } from "@kuroi/syringe"
import { BaseLobbyManager } from "../../src/lobby";

@Syringe.Injectable({
  scope: "global"
})
export class TestLobbyManager extends BaseLobbyManager {

}
