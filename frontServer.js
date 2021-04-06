"use Strict";

const express = require("express");
require("dotenv").config();
const server = express();

const HTTP = {
  port: process.env.HTTP_STATIC_PORT || 80,
  host: process.env.HTTP_STATIC_HOST || "127.0.0.1"
}

//ver porque aparece en el terminal
server.use(express.urlencoded({ extended: false }))
server.use(express.json())

//Hacemos sendFile para los html, de forma que no aparezca el nombre de archivo
//y la extensión en la barra del navegador
const sendFileOptions = {
  root: `${__dirname}/staticFrontEnd/`,
}

server.get("/", (req, res) => {
  res.sendFile("index.html", sendFileOptions);
})

server.get("/quiz", (req, res)=> {
  res.sendFile("quiz/quiz.html", sendFileOptions);
})


server.get("/login", (req, res) => {
  res.sendFile("login.html", sendFileOptions);
}) 

server.get("/admin/questions", (req, res) => {
  res.sendFile("admin/questions.html", sendFileOptions);
})
//hacemos que /admin también apunte a la gestión de preguntas
server.get("/admin", (req, res) => {
  res.sendFile("admin/questions.html", sendFileOptions);
})

server.get("/admin/question", (req, res) => {
  res.sendFile("admin/question.html", sendFileOptions);
})


//servidor de ficheros estáticos 
server.use('/', express.static('./staticFrontEnd'));

server.listen(HTTP.port, HTTP.host, () => {
  console.log(`Static File server running at http://${HTTP.host}:${HTTP.port}`)
})





