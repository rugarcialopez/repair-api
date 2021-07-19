import mongoose from 'mongoose';
import app from '../src/app';
import supertest from 'supertest';
import User from '../src/models/user';
import Repair from '../src/models/repair';
import { IUserDocument } from '../src/types/user';

type AuthUser = {
  fullName: string,
  role: string,
  email: string,
  password: string
}

type RepairObj = {  
  description: string,
  date: string,
  time: number,
  userId: string
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

describe('GET /api/users/:id',  () => {

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

describe('POST /api/add-user',  () => {

  const newUser =  { fullName: 'User One', email:'user01@example.com', password: 'test', role: 'user' };

  test('should require authorization', async () => {
    await supertest(app).post('/api/add-user')
      .send(newUser)
      .expect(401);
  })

  test('should require manager role', async () => {
    const token = await signUp({
      fullName: 'Manager One',
      email: 'mnanager01@example.com',
      password: 'manager01',
      role: 'user'
    });
    const response = await supertest(app).post('/api/add-user')
      .set('token', token)
      .send(newUser)
      .expect(401);
    
    expect(response.body.message).toBe('Unauthorized role');
  })

  test('should create a new user', async () => {
    const token = await signUp({
      fullName: 'Manager One',
      email: 'mnanager01@example.com',
      password: 'manager01',
      role: 'manager'
    }); 

    await supertest(app).post('/api/add-user')
    .set('token', token)
    .send(newUser)
    .expect(201)
    .then(async (response) => {
      // Check the response
      expect(response.body.message).toBeTruthy();
      expect(response.body.message).toBe('User added');

      // Check data in the database
      const user = await User.findOne({ email: 'user01@example.com' });
      expect(user?.fullName).toBe(newUser.fullName);
      expect(user?.role).toBe(newUser.role);
    });
  })
});

describe('PUT /api/edit-user/:id',  () => {

  const updatedUser = { fullName: 'User One updated' };

  test('should require authorization', async () => {
    await supertest(app).put('/api/edit-user/1')
      .send(updatedUser)
      .expect(401);
  })

  test('should require manager role', async () => {
    const token = await signUp({
      fullName: 'Manager One',
      email: 'mnanager01@example.com',
      password: 'manager01',
      role: 'user'
    });
    const response = await supertest(app).put('/api/edit-user/1')
      .set('token', token)
      .send(updatedUser)
      .expect(401);
    
    expect(response.body.message).toBe('Unauthorized role');
  })

  test('should update an existing user', async () => {
    const user = await User.create({ fullName: 'User One', email:'user01@example.com', password: 'test', role: 'user' });
    const token = await signUp({
      fullName: 'Manager One',
      email: 'mnanager01@example.com',
      password: 'manager01',
      role: 'manager'
    }); 

    await supertest(app).put(`/api/edit-user/${user._id.toString()}`)
    .set('token', token)
    .send(updatedUser)
    .expect(200)
    .then(async (response) => {
      // Check the response
      expect(response.body.message).toBeTruthy();
      expect(response.body.message).toBe('User updated');

      // Check data in the database
      const user = await User.findOne({ email: 'user01@example.com' });
      expect(user?.fullName).toBe(updatedUser.fullName);
    });
  })
});

describe('DELETE /api/delete-user/:id',  () => {

  test('should require authorization', async () => {
    await supertest(app).delete('/api/delete-user/1')
      .expect(401);
  })

  test('should require manager role', async () => {
    const token = await signUp({
      fullName: 'Manager One',
      email: 'mnanager01@example.com',
      password: 'manager01',
      role: 'user'
    });
    const response = await supertest(app).delete('/api/delete-user/1')
      .set('token', token)
      .expect(401);
    
    expect(response.body.message).toBe('Unauthorized role');
  })

  test('should remove an existing user', async () => {
    const user = await User.create({ fullName: 'User One', email:'user01@example.com', password: 'test', role: 'user' });
    const token = await signUp({
      fullName: 'Manager One',
      email: 'mnanager01@example.com',
      password: 'manager01',
      role: 'manager'
    }); 

    await supertest(app).delete(`/api/delete-user/${user._id.toString()}`)
    .set('token', token)
    .expect(200)
    .then(async (response) => {
      // Check the response
      expect(response.body.users).toBeTruthy();
      expect(response.body.users.length).toEqual(0);
    });
  })
});

describe('GET /api/repairs',  () => {

  test('should require authorization', async () => {
    await supertest(app).get('/api/repairs')
      .expect(401);
  })

  test('should return a JSON with the repairs', async () => {
    const token = await signUp({
      fullName: 'Manager One',
      email: 'mnanager01@example.com',
      password: 'manager01',
      role: 'manager'
    });
    const repair = await Repair.create({comments: [], description: 'Repair 1', date: '2021-07-14', time: 11, repairState: 'uncompleted', user: { id: '60eebbe11d8ccf132014db78', fullName: 'Learner One'}});

    await supertest(app).get('/api/repairs')
      .set('token', token)
      .expect(200)
      .then((response) => {
        // Check type and length
        expect(Array.isArray(response.body.repairs)).toBeTruthy();
        expect(response.body.repairs.length).toEqual(1);

        // Check data
        expect(response.body.repairs[0].id).toBe(repair._id.toString());
        expect(response.body.repairs[0].description).toBe(repair.description);
        expect(response.body.repairs[0].time).toBe(repair.time);
        expect(response.body.repairs[0].repairState).toBe(repair.repairState);
      });
  })
});

describe('GET /api/repairs/:id',  () => {

  test('should require authorization', async () => {
    await supertest(app).get('/api/repairs/60eebc041d8ccf132014db7a')
      .expect(401);
  })

  test('should require manager role', async () => {
    const token = await signUp({
      fullName: 'Manager One',
      email: 'mnanager01@example.com',
      password: 'manager01',
      role: 'user'
    });
    const response = await supertest(app).get('/api/repairs/60eebc041d8ccf132014db7a')
      .set('token', token)
      .expect(401);
    
    expect(response.body.message).toBe('Unauthorized role');
  })

  test('should return a JSON with the repair', async () => {
    const token = await signUp({
      fullName: 'Manager One',
      email: 'mnanager01@example.com',
      password: 'manager01',
      role: 'manager'
    });
    const repair = await Repair.create({comments: [], description: 'Repair 1', date: '2021-07-14', time: 11, repairState: 'uncompleted', user: { id: '60eebbe11d8ccf132014db78', fullName: 'Learner One'}});

    await supertest(app).get(`/api/repairs/${repair._id.toString()}`)
      .set('token', token)
      .expect(200)
      .then((response) => {
        // Check type and length
        expect(response.body.repair && typeof response.body.repair === 'object').toBeTruthy();
        expect(response.body.repair).not.toBeNull();

        // Check data
        expect(response.body.repair.id).toBe(repair._id.toString());
        expect(response.body.repair.description).toBe(repair.description);
        expect(response.body.repair.time).toBe(repair.time);
        expect(response.body.repair.repairState).toBe(repair.repairState);
      });
  })
});

describe('POST /api/add-repair', () => {

  let newRepair: RepairObj;

  beforeEach(async () => {
    const user = await User.create({ fullName: 'User One', email:'user01@example.com', password: 'test', role: 'user' });
    newRepair = {description: 'Repair 1', date: '2021-07-14', time: 11, userId: user._id.toString() };
  });
  

  test('should require authorization', async () => {
    await supertest(app).post('/api/add-repair')
      .send(newRepair)
      .expect(401);
  })

  test('should require manager role', async () => {
    const token = await signUp({
      fullName: 'Manager One',
      email: 'mnanager01@example.com',
      password: 'manager01',
      role: 'user'
    });
    const response = await supertest(app).post('/api/add-repair')
      .set('token', token)
      .send(newRepair)
      .expect(401);
    
    expect(response.body.message).toBe('Unauthorized role');
  })

  test('should create a new repair', async () => {
    const token = await signUp({
      fullName: 'Manager One',
      email: 'mnanager01@example.com',
      password: 'manager01',
      role: 'manager'
    }); 

    await supertest(app).post('/api/add-repair')
    .set('token', token)
    .send(newRepair)
    .expect(201)
    .then(async (response) => {
      // Check the response
      expect(response.body.message).toBeTruthy();
      expect(response.body.message).toBe('Repair added');

      // Check data in the database
      const repair = await Repair.findOne({ description: 'Repair 1' });
      expect(repair?.description).toBe(newRepair?.description)
      expect(repair?.time).toBe(newRepair?.time);
    });
  })
});

describe('PUT /api/edit-repair/:id',  () => {

  let updatedRepair: RepairObj;
  let user: IUserDocument;


  beforeEach(async () => {
    user = await User.create({ fullName: 'User One', email:'user01@example.com', password: 'test', role: 'user' });
    updatedRepair = {description: 'Repair 1 updated', date: '2021-07-14', time: 11, userId: user._id.toString() };
  });

  test('should require authorization', async () => {
    await supertest(app).put('/api/edit-user/60eebc041d8ccf132014db7a')
      .send(updatedRepair)
      .expect(401);
  })

  test('should require manager role', async () => {
    const token = await signUp({
      fullName: 'Manager One',
      email: 'mnanager01@example.com',
      password: 'manager01',
      role: 'user'
    });
    const response = await supertest(app).put('/api/edit-user/60eebc041d8ccf132014db7a')
      .set('token', token)
      .send(updatedRepair)
      .expect(401);
    
    expect(response.body.message).toBe('Unauthorized role');
  })

  test('should update an existing repair', async () => {
    const repair = await Repair.create({comments: [], description: 'Repair 1', date: '2021-07-14', time: 11, repairState: 'uncompleted', user: { id: user._id.fullName, fullName: user.fullName}});
    const token = await signUp({
      fullName: 'Manager One',
      email: 'mnanager01@example.com',
      password: 'manager01',
      role: 'manager'
    }); 

    await supertest(app).put(`/api/edit-repair/${repair._id.toString()}`)
    .set('token', token)
    .send(updatedRepair)
    .expect(200)
    .then(async (response) => {
      // Check the response
      expect(response.body.message).toBeTruthy();
      expect(response.body.message).toBe('Repair updated');

      // Check data in the database
      const repair = await Repair.findOne({ time: 11 });
      expect(repair?.description).toBe(updatedRepair.description);
    });
  })
});

describe('DELETE /api/delete-repair/:id',  () => {

  test('should require authorization', async () => {
    await supertest(app).delete('/api/delete-repair/1')
      .expect(401);
  })

  test('should require manager role', async () => {
    const token = await signUp({
      fullName: 'Manager One',
      email: 'mnanager01@example.com',
      password: 'manager01',
      role: 'user'
    });
    const response = await supertest(app).delete('/api/delete-repair/1')
      .set('token', token)
      .expect(401);
    
    expect(response.body.message).toBe('Unauthorized role');
  })

  test('should remove an existing repair', async () => {
    const repair = await Repair.create({comments: [], description: 'Repair 1', date: '2021-07-14', time: 11, repairState: 'uncompleted', user: { id: '1', fullName: 'User One'}});
    const token = await signUp({
      fullName: 'Manager One',
      email: 'mnanager01@example.com',
      password: 'manager01',
      role: 'manager'
    }); 

    await supertest(app).delete(`/api/delete-repair/${repair._id.toString()}`)
    .set('token', token)
    .expect(200)
    .then(async (response) => {
      // Check the response
      expect(response.body.repairs).toBeTruthy();
      expect(response.body.repairs.length).toEqual(0);
    });
  })
});

describe('GET /api/repairs/:id/mark',  () => {

  test('should require authorization', async () => {
    await supertest(app).get('/api/repairs/60eebc041d8ccf132014db7a/mark')
      .expect(401);
  })

  test('should require manager or user role', async () => {
    const token = await signUp({
      fullName: 'Manager One',
      email: 'mnanager01@example.com',
      password: 'manager01',
      role: 'learner'
    });
    const response = await supertest(app).get('/api/repairs/60eebc041d8ccf132014db7a/mark')
      .set('token', token)
      .expect(401);
    
    expect(response.body.message).toBe('Unauthorized role');
  })

  test('should return a JSON with the info of repair state', async () => {
    const token = await signUp({
      fullName: 'Manager One',
      email: 'mnanager01@example.com',
      password: 'manager01',
      role: 'manager'
    });
    const repair = await Repair.create({comments: [], description: 'Repair 1', date: '2021-07-14', time: 11, repairState: 'uncompleted', user: { id: '60eebbe11d8ccf132014db78', fullName: 'Learner One'}});

    await supertest(app).get(`/api/repairs/${repair._id.toString()}`)
      .set('token', token)
      .expect(200)
      .then((response) => {
        // Check type and length
        expect(response.body.repair && typeof response.body.repair === 'object').toBeTruthy();
        expect(response.body.repair).not.toBeNull();

        // Check data
        expect(response.body.repair.description).toBe(repair.description);
        expect(response.body.repair.repairState).toBe(repair.repairState);
      });
  })
});

