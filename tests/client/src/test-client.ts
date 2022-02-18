import * as Syringe from "@kuroi/syringe"
import { Observable } from "rxjs"
import { take } from "rxjs/operators"
import { ClientPacket, HttpClient, IHttpClient, WebClient } from "../../../src/client"
import { ILobby, IRpcCall, IRpcHandler, ReservedPackets, RpcHandler } from "../../../src/common"

@Syringe.Injectable({
	scope: "global"
})
@RpcHandler
export class TestClient extends WebClient implements IRpcHandler {

	private rpcListeners = new Map<string, Function>();

	constructor(@Syringe.Inject(HttpClient) private http: IHttpClient) {
		super()
		http.get("http://localhost:6969/api/test/leo").pipe(take(1)).subscribe({
			next: res => console.log(res)
		})
		this.on(ReservedPackets.RPC, (_packet: ClientPacket) => {
			try {
				const _rpcCallJson: string = _packet.readString()
				const _rpcCall: IRpcCall = JSON.parse(_rpcCallJson)
				this.invoke(_rpcCall)
			} catch (_err) {
				console.error("Failure invoking RPC", _err)
			}
		})
	}

	public createLobby(_url: string): Observable<ILobby> {
		return this.http.post<ILobby>(_url, null)
	}

	registerRpc(api: string, method: Function): void {
		this.rpcListeners.set(api, method);
	}

	unregisterRpc(api: string): void {
		this.rpcListeners.delete(api);
	}

	invoke(request: IRpcCall): void {
		const _method: Function | undefined = this.rpcListeners.get(request.api);
		if (!_method) {
			throw new Error("Invalid RPC: " + request.api)
		}
		_method(...(request.arguments || []))
	}

}