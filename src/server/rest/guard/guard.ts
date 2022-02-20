import { RequestHandler } from "express"
import { IHandler } from "../handler"

export abstract class Guard implements IHandler {
  constructor(public handler: RequestHandler) {
	  
  }
}
