import { RequestHandler } from "express"
import { Endpoint } from "../endpoint"

export abstract class Guard extends Endpoint {
  constructor(handler: RequestHandler) {
    super({
      path: '',
      method: '',
      handler
    })
  }
}
