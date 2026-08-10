import http from 'http';
import app from './app';
import { Server } from 'socket.io';
import { connectDatabase } from './config/database';

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);
  
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

async function startServer() {
  await connectDatabase();
  server.listen(PORT, () => {
    console.log(`Backend server running on port ${PORT}`);
  });
}

startServer();

