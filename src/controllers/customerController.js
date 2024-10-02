//logica del la api 
//importo el modulo que gestiona la conexion ala base de datos
const { captureRejectionSymbol } = require('supertest/lib/test');
const pool = require('../db');
//definicion de metodos
exports.getAllCustomers = async (req, res) => {
    try{
        //consulta sql
        const result = await pool.query('SELECT * FROM customers');
        return res.status(200).json(result.rows);
    }catch (error) {
        return res.status(500).json({error : 'Error al obtener los clientes'});
    }
    
};
//get by id
exports.getCustomerById = async (req, res) => {
    //extraigo el id del cliente
    const id = req.params.id;
    try{
        const result = await pool.query('SELECT * FROM customers WHERE customer_id = $1', [id]);
        //verifico si existe el cliente
        if(result.rows.length ==0){
            return res.status(404).json({error : 'Cliente no encontrado'});
        }
        return res.json(result.rows[0]);
    } catch (error) {
        return res.status(500).json({error : 'Error al encontrar cliente0'})
    }

  

    
};
//save
exports.saveCustomer = async (req, res) => {
    //extraigo la informacion del cliente 
    const {customer_name, phone} = req.body;
    try{
        //consulta sql
        const result = await pool.query('INSERT INTO customers (customer_name, phone) VALUES ($1, $2) RETURNING *', [customer_name, phone]);
        return res.status(201).json(result.rows[0]);

    } catch (error) {
        return res.status(500).json({error : 'Error al crear cliente'});
    }

};
//update esto fue editado


exports.updateCustomer = async (req, res) => {
    // Aseguro que el id corresponda a la columna en la BD
    const { id } = req.params; // Extracción correcta del ID
    // Extraigo información del cliente
    const { customer_name, phone } = req.body;

    // Validación de datos de entrada
    if (!customer_name || !phone) {
        return res.status(400).json({ error: 'El nombre y el teléfono son obligatorios' });
    }

    // Verificar si el ID es válido (asumiendo que es un número)
    if (isNaN(id)) {
        return res.status(400).json({ error: 'ID de cliente no válido' });
    }

    try {
        const result = await pool.query(
            'UPDATE customers SET customer_name = $1, phone = $2 WHERE customer_id = $3 RETURNING *',
            [customer_name, phone, id]
        );

        // Aseguro que el elemento tenga un resultado
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }

        // Devuelvo el cliente actualizado
        return res.status(200).json({ 
            message: 'Cliente actualizado correctamente', 
            customer: result.rows[0] 
        });
    } catch (error) {
        
        
        return res.status(500).json({ error: 'Error al actualizar el cliente' });
    }
};


//delete
exports.deleteCustomer = async (req, res) => {
    //extraigo el id del cliente y realizo la consulta
    const id = req.params.id;
    try{
        const result = await pool.query
        ('DELETE FROM customers WHERE customer_id = $1 RETURNING *', [id]);
        //verifico si existe el cliente y envio el mensaje
        if(result.rowCount ==0){
           return res.status(404).json({error : 'Cliente no encontrado'})
        }
        return res.status(200).json({message : 'Cliente eliminado'});
    }catch (error) {
         return res.status(500).json({error : 'Error al eliminar cliente'});
    }

};


