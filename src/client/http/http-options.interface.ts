export interface IHttpOptions {
  contentType?: string
  credentials?: RequestCredentials
  headers?: {
    [header: string]: any
  }
}
