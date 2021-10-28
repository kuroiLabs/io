import { Syringe } from "@kuroi/syringe"
import { BaseWebClient, IHttpClient } from "../../../src/net/client"
import { HTTP } from "./http.token"

@Syringe.Injectable({
  scope: "global"
})
export class TestClient extends BaseWebClient {

  constructor(@Syringe.Inject(HTTP) http: IHttpClient) {
    super(http)
    http.get("http://localhost:6969/api/test/leo").subscribe({
      next: res => console.log(res)
    })
  }

}