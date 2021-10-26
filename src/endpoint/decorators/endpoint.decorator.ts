import { Endpoint } from "../endpoint"
import { Guard } from "../../guard"

export function endpointDecorator(_path: string, _method: string, _guards?: Guard[]) {
  return function _endpointDecorator(
    _target: any,
    _key: string,
    _descriptor: PropertyDescriptor,
  ) {
    if (!_target.constructor['_endpoints']) {
      _target.constructor['_endpoints'] = []
    }
    _target.constructor['_endpoints'].push(
      new Endpoint({
        path: _path,
        method: _method,
        handler: _descriptor.value,
        guards: _guards
      })
    )
    return _descriptor
  }
}