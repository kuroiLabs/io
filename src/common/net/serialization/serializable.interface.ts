import { BaseSerializationEvent } from "./base-serialization-event"

export interface ISerializable {
	serialize(event: BaseSerializationEvent<any>): void
}