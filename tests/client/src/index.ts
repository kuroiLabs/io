import * as Syringe from "@kuroi/syringe"
import { HttpClient } from "../../../src/client"
import { TestApp } from "./test-app"

Syringe.inject(TestApp, {
	providers: [HttpClient]
})
