import { RequestHandler } from "express";
import { Constructor } from "../../../common";
import { BaseRoute } from "../route";

export interface IStaticRoute {
  _endpoints: IEndpoint[]
}

export interface IEndpoint {
  /** URL path extension from route */
  path: string
  /** Type of endpoint (GET, POST, etc) */
  method: string
  /** Logic to run when endoint is called */
  handler: RequestHandler
  /** Optional guards that must pass before allowing the handler to run */
  guards?: IEndpoint[]
  _route?: Constructor<BaseRoute>
}
