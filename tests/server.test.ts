import mongoose from 'mongoose';
import app from '../src/app';
import supertest from 'supertest';
import User from '../src/models/user';

type AuthUser = {
  fullName: string,
  role: string,
  email: string,
  password: string
}

beforeEach((done) => {
  mongoose.connect('mongodb://localhost:27017/repair-shop-test',
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => done());
});

afterEach((done) => {
  mongoose.connection.db.dropDatabase(() => {
    mongoose.connection.close(() => done())
  });
});


const signUp = async (user: AuthUser) => {
  const response = await supertest(app).post('/api/signUp')
    .send(user)
    .expect(201)
  return response.body.token;
}

describe('GET /api/users',  () => {

  test('should require authorization', async () => {
    await supertest(app).get('/api/users')
      .expect(401);
  })

  test('should require manager role', async () => {
    const token = await signUp({
      fullName: 'Manager One',
      email: 'mnanager01@example.com',
      password: 'manager01',
      role: 'user'
    });
    const response = await supertest(app).get('/api/users')
      .set('token', token)
      .expect(401);
    
    expect(response.body.message).toBe('Unauthorized role');
  })

  test('should return a JSON with the users', async () => {
    const token = await signUp({
      fullName: 'Manager One',
      email: 'mnanager01@example.com',
      password: 'manager01',
      role: 'manager'
    });
    const user = await User.create({ fullName: 'User One', email:'user01@example.com', password: 'test', role: 'user' });

    await supertest(app).get('/api/users')
      .set('token', token)
      .expect(200)
      .then((response) => {
        // Check type and length
        expect(Array.isArray(response.body.users)).toBeTruthy();
        expect(response.body.users.length).toEqual(1);

        // Check data
        expect(response.body.users[0].id).toBe(user._id.toString());
        expect(response.body.users[0].fullName).toBe(user.fullName);
        expect(response.body.users[0].role).toBe(user.role);
      });
  })
});

describe('GET /api/user/:id',  () => {

  test('should require authorization', async () => {
    await supertest(app).get('/api/users/1')
      .expect(401);
  })

  test('should require manager role', async () => {
    const token = await signUp({
      fullName: 'Manager One',
      email: 'mnanager01@example.com',
      password: 'manager01',
      role: 'user'
    });
    const response = await supertest(app).get('/api/users/1')
      .set('token', token)
      .expect(401);
    
    expect(response.body.message).toBe('Unauthorized role');
  })

  test('should return a JSON with the user', async () => {
    const token = await signUp({
      fullName: 'Manager One',
      email: 'mnanager01@example.com',
      password: 'manager01',
      role: 'manager'
    });
    const user = await User.create({ fullName: 'User One', email:'user01@example.com', password: 'test', role: 'user' });

    await supertest(app).get(`/api/users/${user._id.toString()}`)
      .set('token', token)
      .expect(200)
      .then((response) => {
        // Check type and length
        expect(response.body.user && typeof response.body.user === 'object').toBeTruthy();
        expect(response.body.user).not.toBeNull();

        // Check data
        expect(response.body.user.id).toBe(user._id.toString());
        expect(response.body.user.fullName).toBe(user.fullName);
        expect(response.body.user.role).toBe(user.role);
        expect(response.body.user.email).toBe(user.email);
      });
  })
});