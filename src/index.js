import app from './app';
import {Server as WebSocketServer} from 'socket.io'
import http from 'http';
import sockets from './sockets';

import {connectDB} from './db'
connectDB();


const server = http.createServer(app)
const HttpServer = server.listen(3000)
console.log('Server is listening on port: 3000')

const io = new WebSocketServer(HttpServer)

sockets(io)