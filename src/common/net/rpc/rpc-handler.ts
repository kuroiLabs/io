import { Observable, ReplaySubject } from "rxjs";
import { BasePacketHandler } from "../../utils";
import { IRpcHandler } from "./rpc-handler.interface";

export const RPC_HANDLER: IRpcHandler = (() => {

	let _handler = new ReplaySubject<BasePacketHandler>();

	return {
		get(): Observable<BasePacketHandler> {
			return _handler;
		},
		set(_instance: BasePacketHandler): void {
			_handler.next(_instance);
		}
	}
})();