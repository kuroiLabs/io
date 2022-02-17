import { Constructor } from "../../utils"
import { IRpcHandler } from "./rpc-handler.interface"
import { RpcHandlerInstance } from "./rpc-handler-store"

export function RpcHandler<T extends Constructor<IRpcHandler>>(Class: T) {
	return new Proxy(Class, {
		construct(_class: T, _args: any[]) {
			const _instance: IRpcHandler = Reflect.construct(_class, _args)
			RpcHandlerInstance.set(_instance)
			return _instance
		}
	})
}