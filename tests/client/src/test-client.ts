import { Syringe } from "@kuroi/syringe"
import { Observable } from "rxjs"
import { ILobby } from "../../../src/lobby"
import { BaseWebClient, IHttpClient } from "../../../src/net/client"
import { HTTP } from "./http.token"

@Syringe.Injectable({
  scope: "global"
})
export class TestClient extends BaseWebClient {

  constructor(@Syringe.Inject(HTTP) private http: IHttpClient) {
    super()
    http.get("http://localhost:6969/api/test/leo").subscribe({
      next: res => console.log(res)
    })
  }

  public createLobby(_url: string): Observable<ILobby> {
    return this.http.post<ILobby>(_url, null)
  }

}