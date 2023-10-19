import app from './app';
import { Server as WebSocketServer } from 'socket.io'
import http from 'http';
import sockets from './sockets';

import { connectDB } from './db'
connectDB();


const server = http.createServer(app)
const HttpServer = server.listen(80)
console.log('Server is listening on port: 80')

const io = new WebSocketServer(HttpServer)

sockets(io)