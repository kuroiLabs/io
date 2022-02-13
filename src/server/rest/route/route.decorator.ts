import { Constructor } from "../../../common";
import { Endpoint, IEndpoint } from "../endpoint";
import { __ENDPOINTS } from "../endpoint/endpoint.symbol";
import { BaseRoute } from "./base-route";

export function Route<T extends Constructor<BaseRoute>>(Class: T) {
	class DecoratedRoute extends Class {
		constructor(...args: any[]) {
			super(...args);
			const _endpoints: Endpoint[] = (this as any)[__ENDPOINTS];
			if (_endpoints) {
				this._configureEndpoints(_endpoints);
			}
		}
		_configureEndpoints(_endpoints: IEndpoint[]): void {
			super._configureEndpoints(_endpoints);
		}
	}
	// preserve prototype info
	Object.defineProperty(DecoratedRoute, "name", {
		value: Class.name
	});
	return DecoratedRoute;
}