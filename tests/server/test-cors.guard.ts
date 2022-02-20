import * as Syringe from "@kuroi/syringe"
import { NextFunction, Request, Response } from "express"
import { Guard } from "../../src/server/rest"

@Syringe.Injectable({
  scope: "global"
})
export class TestCorsGuard extends Guard {
  constructor() {
    super(async function _corsGuard(req: Request, res: Response, next: NextFunction) {
      res.setHeader("Access-Control-Allow-Origin", "*")
      res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
      res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, apikey, X-API-KEY")
      if (req.method === "OPTIONS")
        return res.status(200).end()
      next()
    })
  }
}

