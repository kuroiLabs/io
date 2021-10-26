import { Guard } from "../../guard"
import { endpointDecorator } from "./endpoint.decorator"

export function Get(path: string, guards?: Guard[]) {
  return endpointDecorator(path, "get", guards)
}