//importo el objeto pool para gestionar bd postgres
const {Pool} = require('pg');
//creo instancia de pool y configuro db
const pool = new Pool({
    host:'localhost',
    user:'postgres',
    password:'solocali123#',
    database:'ensayo_ar',
    port:5432
});
//exporto modulo
module.exports = pool;