export interface ISingleton<T> {
	get Instance(): T
}