import { Subject } from "rxjs";

export interface Destroyable {
	onDestroy?(): void;
}

export abstract class Destroyable {
	public destroyed$ = new Subject<boolean>();
	public destroy(): void {
		this.destroyed$.next(true);
		this.destroyed$.complete();
		if (this.onDestroy)
			this.onDestroy();
	}
}
