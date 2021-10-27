import { Syringe } from "@kuroi/syringe"
import { HttpClient } from "../../../src/net/client"

const http = new HttpClient()

export const HTTP = new Syringe.InjectionToken("HTTP", {
  scope: "global",
  factory: () => http
})
