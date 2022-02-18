import * as Syringe from "@kuroi/syringe"
import { Request, Response } from "express"
import { Get, BaseRoute, Route } from "../../src/server/rest"
import { TestGuard } from "./test-guard"

@Syringe.Injectable()
@Route
export class TestRoute extends BaseRoute {
  constructor() {
    super("test")
  }

  @Get("/leo", [Syringe.inject(TestGuard)])
  public test(_request: Request, _response: Response) {
    _response.json({
      message: "Hello, it's me, Uncle Leo!"
    })
  }
}
