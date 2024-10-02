//defino las rutas de la app
//importo modulo expres para la definicion de rutas
const express = require('express');
//importo los metodos del controlador
const {getAllCustomers, getCustomerById, saveCustomer, updateCustomer, deleteCustomer} = require('../controllers/customerController');
//creo un objeto router
const router = express.Router();
//defino los metodos
router.get('/customers', getAllCustomers);
router.get('/customers/:id', getCustomerById);
router.post('/customers', saveCustomer);
router.put('/customers/:id', updateCustomer);
router.delete('/customers/:id', deleteCustomer);
//exporto el modulo 
module.exports = router; 