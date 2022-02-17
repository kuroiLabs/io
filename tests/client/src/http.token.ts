import * as Syringe from "@kuroi/syringe"
import { HttpClient } from "../../../src/client/http"

const http = new HttpClient()

export const HTTP = new Syringe.InjectionToken("HTTP", {
  scope: "global",
  factory: () => http
})
