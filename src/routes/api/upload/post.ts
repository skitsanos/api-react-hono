import {Context} from 'hono';

export default async (ctx: Context) =>
{
    console.log('got file');
    const {req} = ctx;

    const data = await req.formData();
    const image = data.get('file');

    if (image instanceof File)
    {
        // use image.stream(); to stream the file to disk or a cloud provider like GCS, S3 etc
        console.log('streaming file');
    }

    return ctx.jsonT({message: 'hello there'});
};