import { IPacket } from "../../common/net"

export class ClientPacket implements IPacket<ArrayBuffer> {

	private buffer: ArrayBuffer

	private readPosition: int = 0

	private writePosition: int = 0

	private encoder = new TextEncoder()

	private decoder = new TextDecoder()

	constructor(_buffer?: ArrayBuffer) {
		this.buffer = _buffer || new ArrayBuffer(0)
	}

	public data(): ArrayBuffer {
		return this.buffer
	}

	public readByte(): byte {
		const _byte: byte = new DataView(this.buffer, this.readPosition).getUint8(0)
		this.readPosition += Uint8Array.BYTES_PER_ELEMENT
		return _byte
	}

	public readBytes(_length?: int): Uint8Array {
		return new Uint8Array(this.buffer.slice(this.readPosition, _length || this.buffer.byteLength))
	}

	public writeByte(_byte: byte): void {
		const _view = new DataView(this.buffer)
		_view.setUint8(this.writePosition, _byte)
		this.writePosition += Uint8Array.BYTES_PER_ELEMENT
	}

	public writeBytes(_bytes: byte[] | Uint8Array): void {
		_bytes.forEach((_byte: byte) => this.writeByte(_byte))
	}

	public readUint32(): uint32 {
		const _uint32: uint32 = new DataView(this.buffer, this.readPosition).getUint32(0)
		this.readPosition += Uint32Array.BYTES_PER_ELEMENT
		return _uint32
	}

	public writeUint32(_uint32: uint32): void {
		const _view = new DataView(this.buffer)
		_view.setUint32(this.writePosition, _uint32)
		this.writePosition += Uint32Array.BYTES_PER_ELEMENT
	}

	public readInt32(): int32 {
		const _int32: int32 = new DataView(this.buffer, this.readPosition).getInt32(0)
		this.readPosition += Int32Array.BYTES_PER_ELEMENT
		return _int32
	}

	public writeInt32(_int32: int32): void {
		const _view = new DataView(this.buffer)
		_view.setInt32(this.writePosition, _int32)
		this.writePosition += Int32Array.BYTES_PER_ELEMENT
	}

	public readFloat(): float {
		const _float: float = new DataView(this.buffer, this.readPosition).getFloat32(0)
		this.readPosition += Float32Array.BYTES_PER_ELEMENT
		return _float
	}

	public writeFloat(_float: float): void {
		const _view = new DataView(this.buffer)
		_view.setFloat32(this.writePosition, _float)
		this.writePosition += Float32Array.BYTES_PER_ELEMENT
	}

	public readString(end?: int): string {
		const _bytes: Uint8Array = new Uint8Array(this.buffer, end || this.readPosition)
		const _string: string = this.decoder.decode(_bytes)
		this.readPosition = end || _bytes.byteLength
		return _string
	}

	public writeString(_string: string): void {
		const _bytes: Uint8Array = this.encoder.encode(_string)
		_bytes.forEach(_byte => this.writeByte(_byte))
	}

}