# @kuroi/io
Node.js Typescript framework for full-stack JavaScript applications

## Server
`@kuroi/io` exposes an object-oriented wrapper around Express for easy REST APIs and real-time socket communications with clients.

### Setting up a server
Extend the `BaseServer` class and include your routes and guards in the super call.

```typescript
import { BaseServer } from "@kuroi/io/server"
import cors from "cors"
import express from "express"
import http from "http"
...

export class MyServer extends BaseServer {
  constructor(
    api: express.Express,
    port: number,
    myRoute: MyRoute,
    myGuard: TestCorsGuard,
    lobbyManager?: BaseLobbyManager
  ) {
    super(api, port, true, [myRoute], [myGuard], lobbyManager)
    // used for most server apps
    this.api.use(cors())
  }

  // implement the abstract start method and spin up an HTTP/HTTPS server from
  // the supplied express instance
  public start(): void {
    this.httpServer = http.createServer(this.api).listen(this.port, () => {
      // if your application uses WebSockets, call this method after startup
      this.enableWebSockets()
    })
  }

}
```

### Adding API routes and endpoints
As illustrated above, routes should be supplied to your server's `super` call as class instances.

Decorate your route class's methods with `@Get`, `@Post`, `@Put`, etc. to create endpoints on the route.

```typescript
import { Route, Get } from "@kuroi/io/server"

export class MyRoute extends Route {
  constructor() {
    super("example", MyRoute) // */api/example
  }

  @Get("/leo") // GET */api/example/leo
  public test(_request: Request, _response: Response) {
    _response.json({
      message: "Jerry, hello! It's me, Uncle Leo!"
    })
  }
}
```

### Adding API Guards
`Guard`s are essentially just Express middleware and can be applied at any level of your REST API: an endpoint, a route, or the whole API. `Guard` is an extension of `Endpoint`, but only takes a handler function to its constructor.

```typescript
import { Guard } from "@kuroi/io/server"

export class MyGuard extends Guard {
  constructor() {
    super((req: Request, res: Response, next: NextFunction) => {
      if (this.validateRequest(req))
        next()
    })
  }
  private validateRequest(req: Request): boolean {
    ...
  }
}
```

Pass the `Guard` instance to the `super` call for `BaseServer` and `Route` implementations, and as an argument to `@Endpoint` decorators.

### Setting up Lobbies and real-time communication
If your application supports real-time client communications, set up one or more "lobbies" in which clients await messages from the server.

First, make sure that your `BaseServer` implementation has a `BaseLobbyManager` passed to its `constructor` and `super` call. It usually makes sense to manage a singleton instance of your `BaseLobbyManager`.

Next, create your application's concretion of `Lobby` with its handlers.

```typescript
import { Lobby } from "@kuroi/io/server"

// shared enum between server and client
enum PACKETS {
  WELCOME,
  MESSAGE
}

export class ExampleLobby extends Lobby {

  constructor(_lobby: ILobby) {
    super(_lobby)
    // register listeners by packet ID
    this.on(PACKETS.MESSAGE, this._onMessage.bind(this))
  }

  public onHandshake(_client: WebSocket, _clientId: number): void {
    // handshake/security logic and exit conditions
    ...
    // typically on handshake, you would send the assigned ID back to client
    const _buffer = Buffer.alloc(Uint8Array.BYTES_PER_ELEMENT * 2)
    const _packet = new ServerPacket(_buffer)
    _packet.writeBytes([PACKETS.WELCOME, _clientId])
    _client.send(_packet.data())
  }

  private _onMessage(_packet: ServerPacket, _clientId: byte): void {
    const _message: string = _packet.readString()
    console.log(`Received message from client [${_clientId}]: ${_message}`)
    this.clients.forEach((_client, _id) => {
      if (_id !== _clientId)
        // relay message to other clients
    })
  }

}
```

Wherever your application receives requests to create new lobbies, construct your lobby and add it to your `BaseLobbyManager` instance.

```typescript
export class MyLobbyRoute {
  ...
  @Post("/new")
  public newLobby(_request: Request, _response: Response) {
    const _lobby = new TestLobby({
      name: "My Lobby",
      id: generateId(), // ID generation implementation is up to you
      maxClients: 2
    })
    this.lobbyManager.addLobby(_lobby)
    _response.status(200).json(_lobby.getConfig())
  }
}
```

## Client
`@kuroi/io` exposes utilities to create clients for browser-based web apps to communicate with your IO server.

### HttpClient
`@kuroi/io` comes with an HTTP request utility class called `HttpClient` that exposes all major HTTP methods. `HttpClient` methods interface directly with XHR and return `rxjs` `Observable` objects.

```typescript
import { HttpClient } from "@kuroi/io/client"

const http = new HttpClient()
http.get("/api/resource").subscribe({
  next: data => {...}
})
```

### WebClient
The base `WebClient` class works out of the box, but you may want to extend it in your web application.

```typescript
import { WebClient } from "@kuroi/io/client"
import { ILobby } from "@kuroi/io/common"

export class MyWebClient extends WebClient {
  constuctor(private http: HttpClient) {
    super()
    // set up custom logic
    this.on(SOME_PACKET_ID, this._someListener.bind(this))
  }
  private _someListener(...): void {
    ...
  }
  // additional client-side implementation logic in your extension
  public createLobby(): void {
    this.http.post<ILobby>(NEW_LOBBY_URL, null).subscribe({
      next: lobby => {
        console.log("Successfully created new lobby:", lobby)
      }
    })
  }
}
```

## Reading and writing packets
The real-time communication stack leverages a wrapping interface around the binary data being sent over network: `IPacket`. There are two implementations of this interface included in this library: `ClientPacket` and `ServerPacket`, each written for their respective runtime environments.

### Writing packets
Packets must be read in the same order in which they're written, so it's important to be careful and consistent about how you write packets. You'll also need to be aware of how many bytes your packet will need to hold, which may require byte padding in some cases.

```typescript
function sendMessage(message: string): void {
  // translate message to byte array
  const bytes: Uint8Array = new TextEncoder().encode(message)
  // calculate byteLength of string bytes + packet ID + client ID
  const byteLength: int = Uint8Array.BYTES_PER_ELEMENT
    + Uint16Array.BYTES_PER_ELEMENT
    + bytes.byteLength
  // instantiate a new ArrayBuffer to hold bytes
  const buffer: ArrayBuffer = new ArrayBuffer(byteLength)
  // create a packet instance around the buffer
  const packet = new ClientPacket(buffer)
  // write data to packet
  packet.writeByte(PACKET_ID)
  packet.writeUInt16(CLIENT_ID)
  packet.writeBytes(bytes)
  // send data through WebClient instance
  myWebClient.send(packet)
}
```

### Reading packets
Reading a packet requires knowing how the packet was written. As the developer, only you and other contributors to your project know how the bytes are packed and in what order.

Read each set of bytes from the packet in order:

```typescript
class ChatMessage {
  constructor(public clientId: number, public message: string) {}
}

function deserializeChatMessage(packet: ServerPacket): ChatMessage {
  const clientId: number = packet.readUint16()
  const message: string = packet.readString()
  return new ChatMessage(clientId, message)
}
```