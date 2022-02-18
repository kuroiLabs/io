import { IPacket } from "../packet.interface";
import { ISerializationEvent } from "./serialization-event.interface"

export abstract class BaseSerializationEvent<T> implements ISerializationEvent {

	protected byteGroups: (Uint8Array | byte[])[] = [];

	constructor(
		public packetId: byte,
		public encoder: TextEncoder = new TextEncoder()
	) {

	}
	
	public addByteGroup(bytes: Uint8Array | byte[]): void {
		this.byteGroups.push(bytes)
	}

	public abstract getPacket(): IPacket<T>

}