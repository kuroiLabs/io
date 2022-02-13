import { Guard } from "../../guard"
import { endpointDecorator } from "./endpoint.decorator"

export function Patch(path: string, guards?: Guard[]) {
  return endpointDecorator(path, "patch", guards)
}