import bufferIndexOf from '@/utils/bufferIndexOf';

const bufferSplit = (buf: Buffer, splitBuf: Buffer, includeDelimeter = false) =>
{
    const lines = [];
    const move = includeDelimeter ? splitBuf.length : 0;
    let search = -1;

    while ((search = bufferIndexOf(buf, splitBuf)) > -1)
    {
        lines.push(buf.subarray(0, search + move));
        buf = buf.subarray(search + splitBuf.length, buf.length);
    }

    lines.push(buf);

    return lines;
};

export default bufferSplit;