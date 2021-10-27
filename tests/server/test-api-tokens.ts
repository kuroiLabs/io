import { Syringe } from "@kuroi/syringe"
import express from "express"

export const EXPRESS = new Syringe.InjectionToken("Express", {
  scope: "global",
  factory: () => express
})

export const PORT = new Syringe.InjectionToken("PORT", {
  scope: "global",
  factory: () => 6969
})
