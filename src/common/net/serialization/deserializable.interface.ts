import { Constructor } from "../../utils"
import { IPacket } from "../packet.interface"

export interface IDeserializable extends Constructor {
	deserialize(packet: IPacket<any>): any
}
