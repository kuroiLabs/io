import { RequestHandler } from "express"
import { IHandler } from "../handler"
import { IEndpoint } from "./endpoint.interface"

export class Endpoint implements IEndpoint {

	public path: string

	public method: string

	public handler: RequestHandler

	public guards: IHandler[] = []

	constructor(_endpoint: IEndpoint) {
		this.path = _endpoint.path || ''
		this.method = _endpoint.method || 'get'
		this.handler = _endpoint.handler
		this.guards = _endpoint.guards || []
	}

}
