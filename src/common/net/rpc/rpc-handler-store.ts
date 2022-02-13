import { Observable, ReplaySubject } from "rxjs"
import { BasePacketHandler } from "../../utils"
import { IRpcHandlerStore } from "./rpc-handler-store.interface"

export const RPC_HANDLER_STORE: IRpcHandlerStore = (() => {

	let _handler = new ReplaySubject<BasePacketHandler>()

	return {
		get(): Observable<BasePacketHandler> {
			return _handler
		},
		set(_instance: BasePacketHandler): void {
			_handler.next(_instance)
		}
	}
})()