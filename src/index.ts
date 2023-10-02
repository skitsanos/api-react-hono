import {Hono} from 'hono';
import parseRoutes from '@/utils/parseRoutes';
import {serveStatic} from 'hono/bun';
import {join} from 'path';

const app = new Hono();

//https://plugins.jenkins.io/generic-webhook-trigger/

// @ts-ignore
await parseRoutes('routes', app);

app.use('/favicon.ico', serveStatic({path: './public/favicon.ico'}));
app.use('/*', serveStatic({root: join(__dirname, '..', 'public')}));

export default {
    port: Number(process.env.PORT) || 3000,
    fetch: app.fetch
};