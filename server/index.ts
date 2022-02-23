import express, { Express } from 'express';
import * as http from 'http';
import next, { NextApiHandler } from 'next';
import * as socketio from 'socket.io';
import Match from './Match';

const port: number = parseInt(process.env.PORT || '3000', 10);
const dev: boolean = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const nextHandler: NextApiHandler = nextApp.getRequestHandler();

nextApp.prepare().then(async () => {
    const app: Express = express();
    const server: http.Server = http.createServer(app);
    const io = new socketio.Server();
    io.attach(server);

    Match.io = io;

    io.on('connection', (socket: socketio.Socket) => {
        const { matchId } = socket.handshake.query;

        console.log(`${socket.id} wants to join match ${matchId}`);

        if (typeof matchId === 'string') {
            Match.get(matchId).then(match => {
                match.join(socket);
            }).catch((err) => {
                console.log('Could not join match', err);

                socket.disconnect(true);
            });
        }

        socket.on('disconnect', () => {
            console.log('Client disconnected ' + socket.id);
        });
    });

    app.all('*', (req: any, res: any) => nextHandler(req, res));

    server.listen(port, () => {
        console.log(`> Ready on http://localhost:${port}`);
    });
});