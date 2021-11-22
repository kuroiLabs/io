import { Syringe } from "@kuroi/syringe"
import { Request, Response } from "express"
import { Get, Route } from "../../src/server/rest"
import { TestGuard } from "./test-guard"

@Syringe.Injectable()
export class TestRoute extends Route {
  constructor() {
    super("test", TestRoute)
  }

  @Get("/leo", [Syringe.inject(TestGuard)])
  public test(_request: Request, _response: Response) {
    _response.json({
      message: "Hello, it's me, Uncle Leo!"
    })
  }
}
