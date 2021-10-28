import { RequestHandler } from "express"
import { IEndpoint } from "./endpoint.interface"

export class Endpoint implements IEndpoint {

  public path: string

  public method: string

  public handler: RequestHandler

  public guards: IEndpoint[] = []

  public _route?: { _endpoints: IEndpoint[] }

  constructor(_endpoint: IEndpoint) {
    this.path = _endpoint.path || ''
    this.method = _endpoint.method || 'get'
    this.handler = _endpoint.handler
    this.guards = _endpoint.guards || []
    this._route = _endpoint._route
  }

}
