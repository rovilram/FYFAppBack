'use Strict';

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const questionsRouter = require('./routes/questionsRouter');
const questionRouter = require('./routes/questionRouter');
const userRouter = require('./routes/userRouter');
const { authUser } = require('./controllers/userController');

const server = express();

const HTTP = {
  port: process.env.HTTP_API_PORT || 8081,
  host: process.env.HTTP_API_HOST || 'localhost',
};

//permitimos CORS sin limitaciones
server.use(cors());

server.use(express.urlencoded({ extended: false }));
server.use(express.json());

//test endpoint
server.get('/', (req, res) => {
  res.send("Hello World! I'm a API server!!!");
});

server.use('/questions', questionsRouter);

server.use('/question', authUser);
server.use('/question', questionRouter);

server.use('/user', userRouter);

server.listen(HTTP.port, HTTP.host, () => {
  console.log(`API server running at http://${HTTP.host}:${HTTP.port}`);
});
