import { RequestHandler } from "express";

export interface IEndpoint {
  /** URL path extension from route */
  path: string
  /** Type of endpoint (GET, POST, etc) */
  method: string
  /** Logic to run when endoint is called */
  handler: RequestHandler
  /** Optional guards that must pass before allowing the handler to run */
  guards?: IEndpoint[]
}
