import * as Syringe from "@kuroi/syringe"
import { NextFunction, Request, Response } from "express"
import { Guard } from "../../src/server/rest"

@Syringe.Injectable({
  scope: "global"
})
export class TestGuard extends Guard {
  constructor() {
    super((_req: Request, _res: Response, _next: NextFunction) => {
      console.log("[testGuard] Succesfully ran guard")
      if (this.validate(_req)) {
        _next()
      }
    })
  }

  private validate(_req: Request): boolean {
    return true
  }
}