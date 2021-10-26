export interface IWebClient {
  id?: uint32
  socket?: WebSocket
  decoder?: TextDecoder
  encoder?: TextEncoder
  state: byte
  beforeConnect?(): void
  onConnect?(): void
}
