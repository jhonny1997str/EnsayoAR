//configuracion y ejecucion de la apirest
//importo framwork express para la creacion de app
const express = require('express');
//importo el middleware morgan que lleva el registro de las peticiones http
const morgan = require('morgan');
//importo rutas relacionada con clientes
const customerRoutes = require('./routes/customerRoutes');
//creo instancia de express que es el punto de entrada
const app = express();
//uso morgan y dev me proporciona el formato del registro
app.use(morgan('dev'));
//uso express para el parseo de peticiones en formato json
app.use(express.json());
//defino la ruta base de la api
app.use('/api', customerRoutes);
//defino el puerto
const PORT = process.env.PORT || 3000;
//inicio el servidor para que escuche el puerto
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//exporto modulos para ser usado en otras partes tambien para pruebas
module.exports = {app, server};