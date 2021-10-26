import express from 'express'
import { Endpoint } from '../endpoint'
import { Guard } from '../guard'
import { IRoute } from './route.interface'

export abstract class Route implements IRoute {

  private static readonly ROOT = `*/api`

  public static _endpoints: Endpoint[] = []

  public router = express.Router()

  public guards: Guard[]

  public path: string

  constructor(path: string, guards?: Guard[]) {
    this.path = `${Route.ROOT}/${path}` || ''
    this.guards = guards || []
    const _endpoints: Endpoint[] = Object.getPrototypeOf(this).constructor._endpoints
    this._configureEndpoints(_endpoints)
  }

  private _configureEndpoints(_endpoints: Endpoint[]): void {
    for (const _endpoint of _endpoints) {
      // front load guards/middleware
      const _handlers: express.RequestHandler[] = this.guards && this.guards.map(_guard =>
        _guard.handler.bind(this)
      ) || []
      // append route handler at end
      _handlers.push(_endpoint.handler.bind(this))
      switch (_endpoint.method.toLowerCase()) {
        case "get":
          this.router.get(_endpoint.path, ..._handlers)
          break
        case "patch":
          this.router.patch(_endpoint.path, ..._handlers)
          break
        case "post":
          this.router.post(_endpoint.path, ..._handlers)
          break
        case "put":
          this.router.put(_endpoint.path, ..._handlers)
          break
        case "delete":
          this.router.delete(_endpoint.path, ..._handlers)
          break
        default: throw new Error("Unknown method type \"" + _endpoint.method + "\"")
      }
    }
  }

}
