import { Syringe } from "@kuroi/syringe"
import { Request, Response } from "express"
import { Get } from "../src/endpoint"
import { Route } from "../src/route"
import { TestGuard } from "./test-guard"

@Syringe.Injectable()
export class TestRoute extends Route {
  constructor() {
    super('test')
  }

  @Get("/leo", [Syringe.inject(TestGuard)])
  public test(_request: Request, _response: Response) {
    _response.json({
      message: "Hello, it's me, Uncle Leo!"
    })
  }
}
