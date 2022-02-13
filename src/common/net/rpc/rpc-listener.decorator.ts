import { takeUntil } from "rxjs/operators"
import { Constructor, Destroyable } from "../../utils"
import { IPacket } from "../packet.interface"
import { ReservedPackets } from "../reserved-packet.enum"
import { IRpcCall } from "./rpc-call.interface"
import { RPC_HANDLER_STORE } from "./rpc-handler-store"
import { RpcMethods } from "./rpc-methods.symbol"

export function RpcListener(className?: string) {
	return function _rpcListenerDecorator<T extends Constructor<Destroyable>>(Target: T) {
		class RpcListenerExtension extends Target {
			constructor(...args: any[]) {
				super(...args)
				const _rpcMethods: string[] = Target.prototype[RpcMethods] || [];
				if (!_rpcMethods || !_rpcMethods.length)
					return;
				
				RPC_HANDLER_STORE.get().pipe(takeUntil(this.destroyed$)).subscribe(_handler => {
					_rpcMethods.forEach(_method => {
						_handler.on(ReservedPackets.RPC, (_packet: IPacket<any>) => {
							try {
								const _apiName: string = `${className || Target.name}.${_method}`;
								const _rpcCallJson: string = _packet.readString()
								const _rpcCall: IRpcCall = JSON.parse(_rpcCallJson)
								if (!_rpcCall || _rpcCall.api !== _apiName)
									return
		
								(this as any)[_method](...(_rpcCall.arguments || []))
							} catch (_err) {
								console.error(_err)
							}
						})
					})
				})
			}
		}
		Object.defineProperty(RpcListenerExtension, "name", {
			value: Target.name
		})
		return RpcListenerExtension
	}
}