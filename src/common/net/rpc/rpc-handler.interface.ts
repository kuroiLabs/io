import { Observable } from "rxjs";
import { BasePacketHandler } from "../../utils";

export interface IRpcHandler {
	get(): Observable<BasePacketHandler>;
	set(handler: BasePacketHandler): void;
}