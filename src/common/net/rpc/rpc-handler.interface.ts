import { IRpcCall } from "./rpc-call.interface";

export interface IRpcHandler {
	registerRpc(api: string, method: Function): void;
	unregisterRpc(api: string): void;
	invoke(request: IRpcCall): void;
}