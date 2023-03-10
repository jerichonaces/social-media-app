import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { readdirSync } from 'fs';
const morgan = require('morgan');
require('dotenv').config();

const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  path: '/socket.io',
  cors: {
    origin: [process.env.CLIENT_URL],
    methods: ['GET', 'POST'], // include OPTIONS method
    allowedHeaders: [
      'Access-Control-Allow-Origin',
      'Access-Control-Allow-Methods',
      'Access-Control-Allow-Headers',
    ],
    credentials: true,
  },
});

// db
mongoose.set('strictQuery', false);
mongoose
  .connect(process.env.DATABASE)
  .then(() => console.log('DB CONNECTED'))
  .catch((err) => console.log('DB CONNECTION ERROR => ', err));

app.use(
  cors({
    origin: [process.env.CLIENT_URL],
  })
);

// Add the Access-Control-Allow-Origin header to all responses
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', process.env.CLIENT_URL);
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

// middlewares
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// autoload routes
readdirSync('./routes').map((r) => app.use('/api', require(`./routes/${r}`)));

io.on('connect', (socket) => {
  // console.log('SOCKET.IO', socket.id);
  socket.on('new-post', (newPost) => {
    // console.log('socketio new post => ', newPost);
    socket.broadcast.emit('new-post', newPost);
  });

  socket.on('delete-post', (deletePost) => {
    socket.broadcast.emit('delete-post', deletePost);
  });
});

const port = process.env.PORT || 8000;

http.listen(port, () => console.log(`Server running on port ${port}`));
