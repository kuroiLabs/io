import { Guard } from "../guard";

export interface IRoute {
	path: string;
	guards?: Guard[]
}
