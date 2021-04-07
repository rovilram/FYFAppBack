const express = require('express');

const mysql = require('./configs/db');

const app = express();

// Aquí el middleware correspondiente para parsear el body de la request
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/', express.static('./src/public'));

const PORT = 4000;
app.listen(PORT, () => console.info(`> listening at http://localhost:${PORT}`));