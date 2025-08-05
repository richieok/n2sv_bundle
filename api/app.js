import express from 'express';
import { createServer } from 'node:http'
import multer from 'multer'
import { Server } from 'socket.io';
import { getFriends, sendFriendReq, pendingFriendRequests, acceptFriendReq } from './middleware/chatapp-cmds.js';
import { getParameters } from './aws.js';

if (process.env.CLOUD === 'aws') {
  getParameters(process.env['SSM_PARAMETER_PATH']).then(() => {
    console.log("Parameters loaded from AWS SSM");
    startservice();
  })

} else {
  console.log("No AWS SSM parameters to load, starting service...");
  startservice();
}

async function startservice() {
  console.log("Starting service...");
  let { authenticateToken, login, registerUser } = await import('./auth.js');

  const app = express();
  const server = createServer(app);
  const io = new Server(server, {
    path: "/api/socketio/"
  });
  const upload = multer()

  app.use(express.urlencoded({ extended: true }))
  app.use(express.json());

  app.get('/api', (req, res) => {
    res.json({ "message": "/api endpoint", "status": "true" })
  });

  app.get('/api/test', (req, res) => {
    res.json({ "message": "Test endpoint", "status": "true", "test": process.env.TEST || 'NOT_FOUND' });
  });

  app.post('/api/login', upload.none(), login);

  app.post('/api/register', upload.none(), registerUser);

  // app.get('/api/profile', authenticateToken, getProfile);

  app.get('/api/send-friend-request', authenticateToken, sendFriendReq)

  app.get('/api/pending-friend-requests', authenticateToken, pendingFriendRequests);

  app.get('/api/accept-friend-request', authenticateToken, acceptFriendReq)

  app.get('/api/friends', authenticateToken, getFriends)

  io.on('connection', (socket) => {
    console.log('A user connected');
    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
    socket.on('chat message', (msg) => {
      console.log('message: ' + msg);
      io.emit('chat message', `Received: ${msg}`);
    });
  })

  const PORT = process.env.PORT || 4000;

  server.listen(PORT, () => {
    console.log(`API server is running on port ${PORT}`);
  });
}
