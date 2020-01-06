import express from 'express';
import http from 'http';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import { promises as fs } from 'fs';
import IRouteExport from './interfaces/IRouteExport';
import cors from 'cors';
import Database from './database';

const port = normalizePort(process.env.PORT || '3000');

async function main() {
    const app: express.Application = express();
    await appSetup(app);
    await loadRoutes(app);
    await Database.initialize();

    const server = http.createServer(app);
    server.listen(port);
    server.on('error', onError);
    server.on('listening', () => onListening(server));
}

async function appSetup(app: express.Application) {
    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(express.static(path.resolve(__dirname, '../dist')));
    app.set('port', port);
    // Only for dev
    app.use(cors())
}

async function loadRoutes(app: express.Application) {
    const routesFolder = path.resolve(__dirname, './routes');
    const routes = await fs.readdir(routesFolder);
    for (const routePath of routes) {
        const route: IRouteExport = (await import(path.join(routesFolder, routePath))).default;
        app.use(route.path, route.router);
    }
}

function normalizePort(val: any) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

function onError(error: NodeJS.ErrnoException) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening(server: http.Server) {
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + (addr!.port);
    console.log('Listening on ' + bind);
}

main();