import { takeUntil } from "rxjs/operators"
import { Constructor, Destroyable } from "../../utils"
import { RpcHandlerInstance } from "./rpc-handler-store"
import { RpcMethods } from "./rpc-methods.symbol"

export function RpcListener(className?: string) {
	return function _rpcListenerDecorator<T extends Constructor<Destroyable>>(Class: T) {
		return new Proxy(Class, {
			construct(_class: T, _args: any[]): Destroyable {
				const _instance: Destroyable = Reflect.construct(_class, _args);
				const _rpcMethods: string[] = Class.prototype[RpcMethods] || [];
				if (_rpcMethods && _rpcMethods.length) {
					RpcHandlerInstance.get().pipe(takeUntil(_instance.destroyed$)).subscribe(_handler => {
						_rpcMethods.forEach(_method => {
							const _apiName: string = `${className || Class.name}.${_method}`;
							_handler.registerRpc(_apiName, (_instance as any)[_method].bind(_instance))
						})
					})
				}
				return _instance;
			}
		})
	}
}