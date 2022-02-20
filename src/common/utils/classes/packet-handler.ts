import { Observable } from "rxjs"
import { IPacket } from "../../net"

export type PacketHandlerCallback = (..._args: any[]) => void

export abstract class BasePacketHandler<T extends PacketHandlerCallback = PacketHandlerCallback> {

	protected encoder: TextEncoder = new TextEncoder()

	protected decoder: TextDecoder = new TextDecoder()

	private _events = new Map<string | int, PacketHandlerCallback[]>()

	public on(_packetId: string | int, _callback: T): void {
		if (!this._events.has(_packetId))
			this._events.set(_packetId, [])
		const _callbacks: PacketHandlerCallback[] = this._events.get(_packetId) || []
		if (_callbacks.indexOf(_callback) > -1)
			return
		_callbacks.push(_callback)
	}

	public off(_eventName: string | int, _callback: T): void {
		if (!this._events.has(_eventName))
			return
		const _callbacks: PacketHandlerCallback[] = this._events.get(_eventName) || []
		const _index: int = _callbacks.indexOf(_callback)
		if (_index > -1)
			_callbacks.splice(_index, 1)
		_callback()
	}

	public emit(_packetId: string | int, _packet?: IPacket<any>, ..._args: any[]): void {
		const _callbacks: PacketHandlerCallback[] = this._events.get(_packetId) || []
		_callbacks.forEach(_callback => _callback(_packet, ..._args))
	}

	public stream<U>(_packetId: string | int): Observable<IPacket<U>> {
		const _this = this
		return new Observable(_subscriber => {
			const _callback: PacketHandlerCallback = (_packet): void => {
				_subscriber.next(_packet);
			};
			_this.on(_packetId, <any>_callback);
			return {
				unsubscribe() {
					_this.off(_packetId, <any>_callback)
				}
			}
		})
	}

}
