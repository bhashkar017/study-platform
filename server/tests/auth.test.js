const request = require('supertest');
const mongoose = require('mongoose');
const server = require('../index'); // Import the server
const User = require('../models/User');

describe('Auth Endpoints', () => {
    // Clean up database before tests
    beforeAll(async () => {
        await User.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.close();
        server.close(); // Close the server connection
    });

    it('should register a new user', async () => {
        const res = await request(server)
            .post('/api/auth/register')
            .send({
                name: 'Test User',
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123'
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('token');
        expect(res.body.user).toHaveProperty('username', 'testuser');
    });

    it('should not register user with existing email', async () => {
        const res = await request(server)
            .post('/api/auth/register')
            .send({
                name: 'Test User 2',
                username: 'testuser2',
                email: 'test@example.com', // Same email
                password: 'password123'
            });

        expect(res.statusCode).toEqual(400);
    });

    it('should login a user', async () => {
        const res = await request(server)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com',
                password: 'password123'
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body.user).toHaveProperty('email', 'test@example.com');
    });

    it('should reject invalid login', async () => {
        const res = await request(server)
            .post('/api/auth/login')
            .send({
                email: 'test@example.com',
                password: 'wrongpassword'
            });

        expect(res.statusCode).toEqual(400);
    });
});
