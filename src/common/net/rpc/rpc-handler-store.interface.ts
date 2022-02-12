import { Observable } from "rxjs";
import { BasePacketHandler } from "../../utils";

export interface IRpcHandlerStore {
	get(): Observable<BasePacketHandler>;
	set(handler: BasePacketHandler): void;
}