import { Endpoint } from "../endpoint"
import { Guard } from "../../guard"
import { __ENDPOINTS } from "../endpoint.symbol"

export function endpointDecorator(_path: string, _method: string, _guards?: Guard[]) {
	return function _endpointDecorator(
		_target: any,
		_key: string,
		_descriptor: PropertyDescriptor,
	) {
		_target[__ENDPOINTS] = _target[__ENDPOINTS] || []
		_target[__ENDPOINTS].push(new Endpoint({
			path: _path,
			method: _method,
			handler: _descriptor.value,
			guards: _guards
		}))
	}
}