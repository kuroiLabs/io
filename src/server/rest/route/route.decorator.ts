import { Constructor } from "../../../common";
import { Endpoint } from "../endpoint";
import { __ENDPOINTS } from "../endpoint/endpoint.symbol";
import { BaseRoute } from "./base-route";

export function Route<T extends Constructor<BaseRoute>>(Class: T) {
	return new Proxy(Class, {
		construct(_class: T, _args: any[]): BaseRoute {
			const _instance: BaseRoute = Reflect.construct(_class, _args)
			const _endpoints: Endpoint[] = Class.prototype[__ENDPOINTS] || []
			_instance._configureEndpoints(_endpoints)
			return _instance
		}
	})
}