import { Syringe } from "@kuroi/syringe"
import { NextFunction, Request, Response } from "express"
import { Guard } from "../src/guard"

@Syringe.Injectable({
  scope: "global"
})
export class TestGuard extends Guard {
  constructor() {
    super(function _testGuard(_req: Request, _res: Response, _next: NextFunction) {
      console.log("testGuard:::", "Succesfully ran guard")
      _next()
    })
  }
}