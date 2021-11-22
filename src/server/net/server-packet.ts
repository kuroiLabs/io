import { IPacket } from "../../common/net"

export class ServerPacket implements IPacket<Buffer> {

  private buffer: Buffer

  private readPosition: int = 0

  private writePosition: int = 0

  private encoder = new TextEncoder()

  constructor(data: Buffer) {
    if (!(data instanceof Buffer)) {
      throw new Error('Invalid data buffer')
    }
    this.buffer = data
  }

  public data(): Buffer {
    return this.buffer
  }

  public readByte(): byte {
    const _byte: byte = this.buffer.readUInt8(this.readPosition)
    this.readPosition += Uint8Array.BYTES_PER_ELEMENT
    return _byte
  }

  public readBytes(_length?: int): Uint8Array {
    return new Uint8Array(this.buffer.slice(this.readPosition, _length || this.buffer.byteLength))
  }

  public writeByte(_byte: byte): void {
    this.buffer.writeUInt8(_byte, this.writePosition)
    this.writePosition += Uint8Array.BYTES_PER_ELEMENT
  }

  public writeBytes(_bytes: byte[] | Uint8Array): void {
    _bytes.forEach((_byte: byte) => this.writeByte(_byte))
  }

  public readUint32(): uint32 {
    const _uint32 = this.buffer.readUInt32BE(this.readPosition)
    this.readPosition += Uint32Array.BYTES_PER_ELEMENT
    return _uint32
  }

  public writeUint32(_uint32: uint32): void {
    this.buffer.writeUInt32BE(_uint32, this.writePosition)
    this.writePosition += Uint32Array.BYTES_PER_ELEMENT
  }

  public readInt32(): int32 {
    const _int32 = this.buffer.readInt32BE(this.readPosition)
    this.readPosition += Int32Array.BYTES_PER_ELEMENT
    return _int32
  }

  public writeInt32(_int32: int32): void {
    this.buffer.writeInt32BE(_int32, this.writePosition)
    this.writePosition += Int32Array.BYTES_PER_ELEMENT
  }

  public readFloat(): float {
    const _float: float = this.buffer.readFloatBE(this.readPosition)
    this.readPosition += Float32Array.BYTES_PER_ELEMENT
    return _float
  }

  public writeFloat(_float: float): void {
    this.buffer.writeFloatBE(_float, this.writePosition)
    this.writePosition += Float32Array.BYTES_PER_ELEMENT
  }

  public readString(end?: int): string {
    const _string = this.buffer.toString('utf-8', this.readPosition, end || this.buffer.byteLength)
    this.readPosition = end || this.buffer.byteLength
    return _string
  }

  public writeString(_string: string): void {
    this.buffer.write(_string, this.writePosition, 'utf-8')
    this.writePosition += this.encoder.encode(_string).byteLength
  }

}