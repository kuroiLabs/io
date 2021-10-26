export interface IPacket {
  data(): ArrayBuffer
  readByte(): byte
  readBytes(_length?: int): Uint8Array
  writeByte(_byte: byte): void
  writeBytes(_bytes: byte[] | Uint8Array): void
  readUint32(): uint32
  writeUint32(_uint32: uint32): void
  readInt32(): int32
  writeInt32(_int32: int32): void
  readFloat(): float
  writeFloat(_float: float): void
  readString(end?: int): string
  writeString(_string: string): void
}