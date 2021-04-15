'use Strict';

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const courseRouter = require('./srcBackEnd/routes/courseRouter');
const loginRouter = require('./srcBackEnd/routes/loginRouter');
const userRouter = require('./srcBackEnd/routes/userRouter');
const { authUser } = require('./srcBackEnd/controllers/loginController');

const server = express();

const HTTP = {
  port: process.env.HTTP_API_PORT || 80,
  host: process.env.HTTP_API_HOST || 'localhost',
};

//permitimos CORS sin limitaciones
server.use(cors());




server.use(express.urlencoded({ extended: false }));
server.use(express.json());

//test endpoint
server.get('/', (req, res) => {
  res.send("Hello World! I'm a API server!!");
});

// COURSES ENDPOINTS
server.use('/courses', courseRouter);

// AUTH ENDPOINTS
//server.use('/', authUser);
server.use('/', loginRouter);

// USER ENDPOINTS
server.use('/user', authUser);
server.use('/user', userRouter);

server.listen(HTTP.port, HTTP.host, () => {
  console.log(`API server running at http://${HTTP.host}:${HTTP.port}`);
});
