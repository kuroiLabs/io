import { Guard } from "../../guard"
import { endpointDecorator } from "./endpoint.decorator"

export function Delete(path: string, guards?: Guard[]) {
	return endpointDecorator(path, "delete", guards)
}