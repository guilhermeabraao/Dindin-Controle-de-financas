const express = require("express");

const { Pool } = require('pg')
const roteador = express();

const pool = new Pool({
    host: "localhost",
    port: 5432,
    user: "postgres",
    password: "123456",
    database: "dindin",
});


module.exports = { roteador, pool };