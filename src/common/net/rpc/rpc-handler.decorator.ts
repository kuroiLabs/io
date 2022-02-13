import { BasePacketHandler, Constructor } from "../../utils"
import { RPC_HANDLER_STORE } from "./rpc-handler-store"

export function RpcHandler<T extends Constructor>(Target: T) {
	class RpcHandlerExtension extends Target {
		constructor(...args: any[]) {
			super(...args)
			RPC_HANDLER_STORE.set(<any>this as BasePacketHandler)
		}
	}
	Object.defineProperty(RpcHandlerExtension, "name", {
		value: Target.name
	})
	return RpcHandlerExtension
}