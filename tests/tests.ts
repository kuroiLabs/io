import { Syringe } from "@kuroi/syringe"
import { TestServer } from "./test-server"

const testApp: TestServer = Syringe.inject(TestServer)
testApp.start()
