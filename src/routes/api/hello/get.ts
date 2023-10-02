import response from '@/utils/response';

export default async ctx =>
    ctx.json(response.result('hello there'));