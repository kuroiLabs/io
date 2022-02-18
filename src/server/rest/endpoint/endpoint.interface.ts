import { IHandler } from "../handler"

export interface IEndpoint extends IHandler {
  /** URL path extension from route */
  path: string
  /** Type of endpoint (GET, POST, etc) */
  method: string
  /** Optional guards that must pass before allowing the handler to run */
  guards?: IHandler[]
}
