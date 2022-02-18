import { Observable, ReplaySubject } from "rxjs"
import { IRpcHandler } from "./rpc-handler.interface"

export namespace RpcHandlerInstance {
	const _handler = new ReplaySubject<IRpcHandler>()
	export function get(): Observable<IRpcHandler> {
		return _handler
	}
	export function set(_instance: IRpcHandler): void {
		_handler.next(_instance)
	}
}
