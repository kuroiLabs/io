import { Guard } from "../../guard"
import { endpointDecorator } from "./endpoint.decorator"

export function Put(path: string, guards?: Guard[]) {
  return endpointDecorator(path, "put", guards)
}