import { BaseSerializationEvent } from "../../common";
import { ClientPacket } from "./client-packet";

export class ClientSerializationEvent extends BaseSerializationEvent<ArrayBuffer> {

	public getPacket(): ClientPacket {
		const _bytes: Uint8Array = this.byteGroups.reduce(
			(_mergedBytes: Uint8Array, _byteGroup: Uint8Array | byte[]) => {
				return new Uint8Array([..._mergedBytes, ..._byteGroup])
			},
			new Uint8Array([this.packetId])
		);
		const _packet = new ClientPacket(new ArrayBuffer(_bytes.byteLength))
		_packet.writeBytes(_bytes)
		return _packet
	}
	
}