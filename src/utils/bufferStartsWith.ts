const bufferStartsWith = (buffer: Uint8Array, pattern: Uint8Array): boolean =>
    Buffer.compare(buffer.slice(0, pattern.length), Buffer.from(pattern)) === 0;

export default bufferStartsWith;