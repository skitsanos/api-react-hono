import bufferSplit from '@/utils/bufferSplit';
import bufferStartsWith from '@/utils/bufferStartsWith';
import bufferIndexOf from '@/utils/bufferIndexOf';

import {join as pathJoin} from 'path';
import {openSync, writeFileSync} from 'fs';

const parseChunks = (arr: Buffer[]): any[] =>
{
    // drop beginning and the end of the payload
    const actualPayload = arr.filter(el =>
        el.compare(new Uint8Array([45, 45])) !== 0
    );

    const marker = 'Content-Disposition: ';

    const result = [];

    for (const el of actualPayload)
    {
        if (bufferStartsWith(el, Buffer.from(marker)))
        {
            const indexNewLine = bufferIndexOf(el, new Uint8Array([13, 10]));
            const contentDispositionLine = el.subarray(marker.length, indexNewLine).toString();

            const [kind, ...rawBlocks] = contentDispositionLine.split('; ');

            if (kind === 'form-data')
            {
                const postedItem = {};

                //extract field name
                const fieldNameLine = rawBlocks.find(item => item.startsWith('name'));
                const fileNameLine = rawBlocks.find(item => item.startsWith('filename'));

                //form data
                postedItem['type'] = (fieldNameLine && !fileNameLine) ? 'form' : 'file';

                if (fieldNameLine)
                {
                    const [, fieldName] = /^name="(.*)"/gi.exec(fieldNameLine);
                    postedItem['name'] = fieldName;
                }

                //extract file name
                if (fileNameLine)
                {
                    const [, fileName] = /^filename="(.*)"/gi.exec(fileNameLine);
                    postedItem['fileName'] = fileName;
                }

                const rawContent = el.subarray(indexNewLine);
                console.log(rawContent);

                result.push(postedItem);
            }
        }
    }
    return result;
};

const parseBody = (req): Promise<any[]> =>
{
    const rawContentType = req.headers.get('content-type');

    if (!rawContentType)
    {
        return Promise.reject({
            message: 'Missing Content-Type header'
        });
    }

    return new Promise(async (resolve, reject): Promise<void> =>
    {
        const tempFile = pathJoin('.', 'temp.txt');

        // node.js readable streams implement the async iterator protocol

        for await (const data of req.body)
        {
            writeFileSync(tempFile, data);
        }

        const [contentType] = rawContentType.split(';');

        if (contentType === 'multipart/form-data')
        {

            const [, boundary] = rawContentType.split('boundary=');
            if (!boundary)
            {
                return reject({
                    message: 'Missing boundary ID'
                });
            }

            //const boundaryBuffer = Buffer.from(`${boundary}\r\n`, 'utf8');

            //return resolve(parseChunks(chunks));
        }

        return resolve([]);
    });
};

export default parseBody;