import {existsSync, readdirSync, statSync} from 'fs';
import {basename, isAbsolute, join as pathJoin, posix, sep as pathSeparator} from 'path';
import Logger from '@/utils/logger';

const parsePath = async (root: string, p: string, instance) =>
{
    if (existsSync(p))
    {
        const fsItems = readdirSync(p);
        if (fsItems.length > 0)
        {
            for (const item of fsItems)
            {
                const fullPath = pathJoin(p, item);
                if (statSync(fullPath).isDirectory())
                {
                    await parsePath(root, fullPath, instance);
                }

                if (statSync(fullPath).isFile())
                {
                    const posixPath = fullPath.split(pathSeparator).join(posix.sep);
                    const urlPath = posixPath.substring(posixPath.indexOf('routes') + 6)
                        .replace(`/${root}`, '')
                        .replace(/\/\w+\.(.+)$/gi, '');

                    const pathParsed = urlPath === ''
                        ? '/'
                        : urlPath.replace(/\$/gi, ':');

                    const method = basename(fullPath).replace(/\.[^/.]+$/, '');

                    Logger.log(`Mounting ${method.toUpperCase()} ${pathParsed}`);

                    const routeModule = await import(posixPath);
                    instance[method.toLowerCase()](pathParsed, routeModule.default, {logger: Logger});
                }
            }
        }
    }
};

const parseRoutes = async (path: string, instance) =>
{
    Logger.log(`Parsing routes at ${path}`);
    const posixPath = path.split(pathSeparator).join(posix.sep);
    const routesRoot = posixPath.split('/').pop();

    if (isAbsolute(path))
    {
        await parsePath(routesRoot, path, instance);
    }
    else
    {
        const initPath = pathJoin(__dirname, '..', 'routes');
        await parsePath(routesRoot, initPath, instance);
    }
};

export default parseRoutes;