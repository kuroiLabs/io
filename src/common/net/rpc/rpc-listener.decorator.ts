import { Constructor } from "../../utils";
import { IPacket } from "../packet.interface";
import { ReservedPackets } from "../reserved-packet.enum";
import { IRpcCall } from "./rpc-call.interface";
import { RPC_HANDLER } from "./rpc-handler";
import { RpcMethods } from "./rpc-methods.symbol";

export function RpcListener<T extends Constructor>(Target: T) {
	class RpcListenerExtension extends Target {
		constructor(...args: any[]) {
			super(...args);
			const _rpcMethods: string[] = Target.prototype[RpcMethods] || [];
			_rpcMethods.forEach(_method => {
				RPC_HANDLER.get().subscribe(_handler => {
					_handler.on(ReservedPackets.RPC, (_packet: IPacket<any>) => {
						try {
							const _rpcCallJson: string = _packet.readString();
							const _rpcCall: IRpcCall = JSON.parse(_rpcCallJson);
							if (_rpcCall && _rpcCall.api !== _rpcCall.api)
								return

							this[_method](...(_rpcCall.arguments || []))
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
	});
	return RpcListenerExtension;
}