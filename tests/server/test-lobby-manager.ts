import * as Syringe from "@kuroi/syringe"
import { BaseLobbyManager } from "../../src/server/lobby"

@Syringe.Injectable({
  scope: "global"
})
export class TestLobbyManager extends BaseLobbyManager {

}
