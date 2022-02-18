import { Constructor } from "../../utils"
import { IDeserializable } from "./deserializable.interface"
import { ISerializable } from "./serializable.interface"

export function Serializable<T extends Constructor<ISerializable>>(
	Class: IDeserializable & T
) {}
