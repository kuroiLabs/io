import { RpcMethods } from "./rpc-methods.symbol"

export function Rpc(methodName?: string) {
	return function _rpcDecorator(target: any, propertyKey: string) {
		target[RpcMethods] = target[RpcMethods] || []
		target[RpcMethods].push(methodName || propertyKey)
	}
}