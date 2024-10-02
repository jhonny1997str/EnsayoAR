// tests/customer.test.js

const request = require('supertest');
const { app, server } = require('../app'); // Asegúrate de que la ruta es correcta
const pool = require('../db'); // Importa tu conexión a la base de datos

let customerId; // Variable para almacenar el ID del cliente creado durante las pruebas

// Limpia la base de datos después de todas las pruebas (opcional)
afterAll(async () => {
    // Si deseas eliminar los datos creados durante las pruebas
    if (customerId) {
        await pool.query('DELETE FROM customers WHERE customer_id = $1', [customerId]);
    }
    server.close(); // Cierra el servidor después de las pruebas
    pool.end(); // Cierra la conexión a la base de datos
});

describe('Customer API', () => {

    // Prueba para crear un nuevo cliente
    it('should create a new customer', async () => {
        const res = await request(app)
            .post('/api/customers')
            .send({ customer_name: 'John Doe', phone: '123456789' });
        
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('customer_name', 'John Doe');
        expect(res.body).toHaveProperty('phone', '123456789');
        expect(res.body).toHaveProperty('customer_id');
        
        customerId = res.body.customer_id; // Guarda el ID del cliente creado
    });

    // Prueba para obtener todos los clientes
    it('should get all customers', async () => {
        const res = await request(app).get('/api/customers');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        // Opcional: Verifica que el cliente creado esté en la lista
        const customer = res.body.find(c => c.customer_id === customerId);
        expect(customer).toBeDefined();
        expect(customer.customer_name).toBe('John Doe');
    });

    // Prueba para obtener un cliente por ID
    it('should get a customer by ID', async () => {
        const res = await request(app).get(`/api/customers/${customerId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('customer_id', customerId);
        expect(res.body).toHaveProperty('customer_name', 'John Doe');
    });

    // Prueba para actualizar un cliente
    it('should update a customer', async () => {
        const res = await request(app)
            .put(`/api/customers/${customerId}`)
            .send({ customer_name: 'Jane Doe', phone: '987654321' });
        
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Cliente actualizado correctamente');
        
        // Verifica que los cambios se hayan aplicado
        const updatedRes = await request(app).get(`/api/customers/${customerId}`);
        expect(updatedRes.body).toHaveProperty('customer_name', 'Jane Doe');
        expect(updatedRes.body).toHaveProperty('phone', '987654321');
    });

    // Prueba para eliminar un cliente
    it('should delete a customer', async () => {
        const res = await request(app).delete(`/api/customers/${customerId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('message', 'Cliente eliminado');
        
        // Verifica que el cliente ya no exista
        const deletedRes = await request(app).get(`/api/customers/${customerId}`);
        expect(deletedRes.statusCode).toBe(404);
    });

});
