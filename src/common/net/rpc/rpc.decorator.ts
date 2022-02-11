import { RpcMethods } from "./rpc-methods.symbol";

export function Rpc(target: any, propertyKey: string) {
	target[RpcMethods] = target[RpcMethods] || [];
	target[RpcMethods].push(propertyKey);
}