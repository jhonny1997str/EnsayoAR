// Importo supertest para realizar solicitudes HTTP a la API
const request = require('supertest');

// Importo la app para las pruebas sobre la lógica de la API y server para el ciclo de vida del servidor (abrir o cerrar)
const { app, server } = require('../app');

// Importo la conexión a la base de datos para interactuar directamente con ella en las pruebas
const pool = require('../db');

// Variable para almacenar el id del cliente creado para las pruebas
let customerId;

// Función que se ejecuta cuando todas las pruebas finalizan
afterAll(async () => {
    // Cierro el servidor para liberar el puerto
    server.close();
    
    // Cierro la conexión a la base de datos
    await pool.end(); // Es recomendable usar await para asegurar que la conexión se cierre
});

// Describo las pruebas relacionadas con la API de clientes
describe('Customer API', () => {

    // Antes de cada prueba, elimino todos los clientes y creo uno nuevo
    beforeEach(async () => {
        // Elimino todos los clientes para asegurar que empezamos con una base de datos limpia
        await pool.query('DELETE FROM customers');
        
        // Creo un cliente para todas las pruebas que lo necesiten
        const res = await request(app)
            .post('/api/customers')
            .send({ customer_name: 'John Doe', phone: '12345' });
        
        customerId = res.body.customer_id; // Guardo el ID del cliente creado
    });

    // Función que se ejecuta después de cada prueba individual
    afterEach(async () => {
        // Elimino el cliente creado de las pruebas para mantener la base de datos limpia
        if (customerId) {
            await pool.query('DELETE FROM customers WHERE customer_id = $1', [customerId]);
            customerId = null;
        }
    });

    // Prueba para verificar la creación de un cliente nuevo
    it('debería crear un cliente nuevo', async () => {
        const res = await request(app)
            .post('/api/customers')
            .send({ customer_name: 'Jane Doe', phone: '45678' });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('customer_name', 'Jane Doe');
        expect(res.body).toHaveProperty('phone', '45678');
        expect(res.body).toHaveProperty('customer_id');
    });

    // Prueba para obtener todos los clientes
    it('debería obtener clientes', async () => {
        const res = await request(app).get('/api/customers');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);

        const customer = res.body.find(c => c.customer_id === customerId);
        expect(customer).toBeDefined();
        expect(customer.customer_name).toBe('John Doe');
    });

    // Prueba para obtener cliente por ID
    it('debería obtener cliente por Id', async () => {
        const res = await request(app).get(`/api/customers/${customerId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('customer_name', 'John Doe');
        expect(res.body).toHaveProperty('customer_id', customerId);
    });

    // Prueba para guardar cliente
    it('deberia crear cliente nuevo',async () => {
        //realizo solicitud post 
        const res = await request(app)
            .post('/api/customers')
            .send({customer_name : 'Jean Doe', phone : '98765'});
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('customer_name', 'Jean Doe');
        expect(res.body).toHaveProperty('phone', '98765');
        expect(res.body).toHaveProperty('customer_id');
    });

    // Prueba para manejar duplicados
    it('debería devolver un error si el cliente ya existe', async () => {
        // Primero, crea el cliente
        await request(app)
            .post('/api/customers')
            .send({ customer_name: 'John Doe', phone: '12345' });

        // intenta crear el mismo cliente nuevamente
        const res = await request(app)
            .post('/api/customers')
            .send({ customer_name: 'John Doe', phone: '12345' });

        expect(res.statusCode).toBe(409);
        expect(res.body).toHaveProperty('error', 'El cliente ya existe');
    });
    // Prueba para verificar la actualización de un cliente existente.
    it('debería actualizar un cliente', async () => {
        // Realiza una solicitud PUT para actualizar el cliente con el ID almacenado.
        const res = await request(app)
            .put(`/api/customers/${customerId}`)
            .send({ customer_name: 'Janeth Doe', phone: '987654321' });
        
        // Verifica que el código de estado HTTP sea 200 (OK).
        expect(res.statusCode).toBe(200);
        
        // Verifica que la respuesta contenga el mensaje de éxito esperado.
        expect(res.body).toHaveProperty('message', 'Cliente actualizado correctamente');
        
        // Realiza una solicitud GET para obtener el cliente actualizado y verificar los cambios.
        const updatedRes = await request(app).get(`/api/customers/${customerId}`);
        
        // Verifica que el nombre del cliente haya sido actualizado a 'Jane Doe'.
        expect(updatedRes.body).toHaveProperty('customer_name', 'Janeth Doe');
        
        // Verifica que el número de teléfono del cliente haya sido actualizado a '987654321'.
        expect(updatedRes.body).toHaveProperty('phone', '987654321');
    });

      // Prueba para verificar la eliminación de un cliente existente.
      it('debería eliminar un cliente', async () => {
        // Realiza una solicitud DELETE para eliminar el cliente con el ID almacenado.
        const res = await request(app).delete(`/api/customers/${customerId}`);
        
        // Verifica que el código de estado HTTP sea 200 (OK).
        expect(res.statusCode).toBe(200);
        
        // Verifica que la respuesta contenga el mensaje de eliminación esperado.
        expect(res.body).toHaveProperty('message', 'Cliente eliminado');
        
        // Realiza una solicitud GET para verificar que el cliente ya no existe.
        const deletedRes = await request(app).get(`/api/customers/${customerId}`);
        
        // Verifica que el código de estado HTTP sea 404 (No Encontrado), indicando que el cliente fue eliminado.
        expect(deletedRes.statusCode).toBe(404);
    });
    

});













/**
 * // Importo supertest para realizar solicitudes HTTP a la API
const request = require('supertest');

// Importo la app para las pruebas sobre la lógica de la API y server para el ciclo de vida del servidor (abrir o cerrar)
const { app, server } = require('../app');

// Importo la conexión a la base de datos para interactuar directamente con ella en las pruebas
const pool = require('../db');

// Variable para almacenar el id del cliente creado para las pruebas
let customerId;

// Función que se ejecuta cuando todas las pruebas finalizan
afterAll(async () => {
    // Cierro el servidor para liberar el puerto
    server.close();
    
    // Cierro la conexión a la base de datos
    await pool.end(); // Es recomendable usar await para asegurar que la conexión se cierre
});

// Describo las pruebas relacionadas con la API de clientes
describe('Customer API', () => {

    // Antes de cada prueba, elimino todos los clientes y creo uno nuevo
    beforeEach(async () => {
        // Elimino todos los clientes para asegurar que empezamos con una base de datos limpia
        await pool.query('DELETE FROM customers');
        
        // Creo un cliente para todas las pruebas que lo necesiten
        const res = await request(app)
            .post('/api/customers')
            .send({ customer_name: 'John Doe', phone: '12345' });
        
        customerId = res.body.customer_id; // Guardo el ID del cliente creado
    });

    // Función que se ejecuta después de cada prueba individual
    afterEach(async () => {
        // Elimino el cliente creado de las pruebas para mantener la base de datos limpia
        if (customerId) {
            await pool.query('DELETE FROM customers WHERE customer_id = $1', [customerId]);
            customerId = null;
        }
    });

    // Prueba para verificar la creación de un cliente nuevo
    it('debería crear un cliente nuevo', async () => {
        const res = await request(app)
            .post('/api/customers')
            .send({ customer_name: 'Jane Doe', phone: '45678' });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('customer_name', 'Jane Doe');
        expect(res.body).toHaveProperty('phone', '45678');
        expect(res.body).toHaveProperty('customer_id');
    });

    // Prueba para obtener todos los clientes
    it('debería obtener clientes', async () => {
        const res = await request(app).get('/api/customers');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);

        const customer = res.body.find(c => c.customer_id === customerId);
        expect(customer).toBeDefined();
        expect(customer.customer_name).toBe('John Doe');
    });

    // Prueba para obtener cliente por ID
    it('debería obtener cliente por Id', async () => {
        const res = await request(app).get(`/api/customers/${customerId}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('customer_name', 'John Doe');
        expect(res.body).toHaveProperty('customer_id', customerId);
    });

    // Prueba para guardar cliente
    it('deberia crear cliente nuevo',async () => {
        //realizo solicitud post 
        const res = await request(app)
            .post('/api/customers')
            .send({customer_name : 'Jean Doe', phone : '98765'});
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('customer_name', 'Jean Doe');
        expect(res.body).toHaveProperty('phone', '98765');
        expect(res.body).toHaveProperty('customer_id');
    });

    // Prueba para manejar duplicados
    it('debería devolver un error si el cliente ya existe', async () => {
        // Primero, crea el cliente
        await request(app)
            .post('/api/customers')
            .send({ customer_name: 'John Doe', phone: '12345' });

        // intenta crear el mismo cliente nuevamente
        const res = await request(app)
            .post('/api/customers')
            .send({ customer_name: 'John Doe', phone: '12345' });

        expect(res.statusCode).toBe(409);
        expect(res.body).toHaveProperty('error', 'El cliente ya existe');
    });
    // Prueba para verificar la actualización de un cliente existente.
    it('debería actualizar un cliente', async () => {
        // Realiza una solicitud PUT para actualizar el cliente con el ID almacenado.
        const res = await request(app)
            .put(`/api/customers/${customerId}`)
            .send({ customer_name: 'Janeth Doe', phone: '987654321' });
        
        // Verifica que el código de estado HTTP sea 200 (OK).
        expect(res.statusCode).toBe(200);
        
        // Verifica que la respuesta contenga el mensaje de éxito esperado.
        expect(res.body).toHaveProperty('message', 'Cliente actualizado correctamente');
        
        // Realiza una solicitud GET para obtener el cliente actualizado y verificar los cambios.
        const updatedRes = await request(app).get(`/api/customers/${customerId}`);
        
        // Verifica que el nombre del cliente haya sido actualizado a 'Jane Doe'.
        expect(updatedRes.body).toHaveProperty('customer_name', 'Janeth Doe');
        
        // Verifica que el número de teléfono del cliente haya sido actualizado a '987654321'.
        expect(updatedRes.body).toHaveProperty('phone', '987654321');
    });

      // Prueba para verificar la eliminación de un cliente existente.
      it('debería eliminar un cliente', async () => {
        // Realiza una solicitud DELETE para eliminar el cliente con el ID almacenado.
        const res = await request(app).delete(`/api/customers/${customerId}`);
        
        // Verifica que el código de estado HTTP sea 200 (OK).
        expect(res.statusCode).toBe(200);
        
        // Verifica que la respuesta contenga el mensaje de eliminación esperado.
        expect(res.body).toHaveProperty('message', 'Cliente eliminado');
        
        // Realiza una solicitud GET para verificar que el cliente ya no existe.
        const deletedRes = await request(app).get(`/api/customers/${customerId}`);
        
        // Verifica que el código de estado HTTP sea 404 (No Encontrado), indicando que el cliente fue eliminado.
        expect(deletedRes.statusCode).toBe(404);
    });
    

});
 */