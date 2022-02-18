import { BaseSerializationEvent } from "../../common";
import { ServerPacket } from "./server-packet";

export class ServerSerializationEvent extends BaseSerializationEvent<Buffer> {
	public getPacket(): ServerPacket {
		const _bytes: Uint8Array = this.byteGroups.reduce(
			(_merged: Uint8Array, _byteGroup: Uint8Array | byte[]) => {
				return new Uint8Array([..._merged, ..._byteGroup])
			},
			new Uint8Array([this.packetId])
		)
		const _packet = new ServerPacket(Buffer.alloc(_bytes.byteLength))
		_packet.writeBytes(_bytes)
		return _packet
	}
}