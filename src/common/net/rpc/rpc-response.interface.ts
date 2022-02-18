export interface IRpcResponse<T = any> {
	id: string
	value?: T
	error?: string
}