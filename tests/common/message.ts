import { BaseSerializationEvent, Serializable, IPacket, ISerializable } from "../../src/common"

@Serializable
export class ChatMessage implements ISerializable {

	constructor(public id: byte, public message: string) {
		
	}

	public static deserialize(_packet: IPacket<any>): ChatMessage {
		const _clientId: byte = _packet.readByte()
		const _message: string = _packet.readString()
		return new ChatMessage(_clientId, _message)
	}

	public serialize(event: BaseSerializationEvent<any>): void {
		event.addByteGroup(new Uint8Array([this.id]))
		event.addByteGroup(event.encoder.encode(this.message))
	}

}