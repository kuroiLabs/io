import { Observable } from "rxjs"
import { IRpcHandler } from "./rpc-handler.interface"

export interface IRpcHandlerStore {
	get(): Observable<IRpcHandler>
	set(handler: IRpcHandler): void
}