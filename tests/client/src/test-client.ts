import { Syringe } from "@kuroi/syringe"
import { Observable } from "rxjs"
import { take } from "rxjs/operators"
import { IHttpClient, WebClient } from "../../../src/client"
import { ILobby, RpcHandler } from "../../../src/common"
import { HTTP } from "./http.token"

@Syringe.Injectable({
	scope: "global"
})
@RpcHandler
export class TestClient extends WebClient {

	constructor(@Syringe.Inject(HTTP) private http: IHttpClient) {
		super()
		http.get("http://localhost:6969/api/test/leo").pipe(take(1)).subscribe({
			next: res => console.log(res)
		})
	}

	public createLobby(_url: string): Observable<ILobby> {
		return this.http.post<ILobby>(_url, null)
	}

}