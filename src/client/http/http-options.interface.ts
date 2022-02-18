export interface IHttpOptions {
  contentType?: string
  credentials?: RequestCredentials
  headers?: {
    [header: string]: any
  }
  [property: string]: any
}
