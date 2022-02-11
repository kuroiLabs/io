import { BasePacketHandler, Constructor } from "../../utils";
import { RPC_HANDLER } from "./rpc-handler";

export function RpcHandler<T extends Constructor>(Target: T) {
	class RpcHandlerExtension extends Target {
		constructor(...args: any[]) {
			super(...args)
			RPC_HANDLER.set(<any>this as BasePacketHandler)
		}
	}
	Object.defineProperty(RpcHandlerExtension, "name", {
		value: Target.name
	})
	return RpcHandlerExtension
}