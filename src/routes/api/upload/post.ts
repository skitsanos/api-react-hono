import {Context} from 'hono';
import response from '@/utils/response';
import Logger from '@/utils/logger';

export default async (ctx: Context) =>
{
    Logger.log('got file');
    const {req} = ctx;

    const data = await req.formData();
    const image = data.get('file');

    if (image instanceof File)
    {
        // use image.stream(); to stream the file to disk or a cloud provider like GCS, S3 etc
        Logger.log('streaming file');
    }

    return ctx.jsonT(response.result({message: 'hello there'}));
};