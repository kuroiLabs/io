import { Guard } from "../../guard"
import { endpointDecorator } from "./endpoint.decorator"

export function Post(path: string, guards?: Guard[]) {
  return endpointDecorator(path, "post", guards)
}