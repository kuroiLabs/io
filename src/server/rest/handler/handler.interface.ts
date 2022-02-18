import { RequestHandler } from "express"

export interface IHandler {
	handler: RequestHandler
}