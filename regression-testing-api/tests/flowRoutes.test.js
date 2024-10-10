import request from 'supertest';
import app from '../app';
import Flow from '../models/Flow';
import mongoose from 'mongoose';

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(async () => {
  await mongoose.connection.close();
});

afterEach(async () => {
  await Flow.deleteMany({});  // Cleanup created flows after each test
});

describe('Flow API Endpoints', () => {
  it('should create a new flow (Expected to pass)', async () => {
    const res = await request(app)
      .post('/flows')
      .send({
        name: 'New Test Flow',
        description: 'Flow for testing API',
        steps: [
          { action: 'click', selector: '#button' },
          { action: 'navigate', value: 'https://example.com' }
        ]
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201);

    expect(res.body).toHaveProperty('_id');
    expect(res.body.name).toBe('New Test Flow');
  });

  it('should return 400 when required fields are missing (Expected to fail)', async () => {
    const res = await request(app)
      .post('/flows')
      .send({
        description: 'Flow without name'
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400);

    expect(res.body).toHaveProperty('error');
    expect(res.body.error).toBe('Name and steps are required.');
  });

  it('should fail if CSRF token is missing (Expected to fail)', async () => {
    const res = await request(app)
      .post('/flows')
      .send({
        name: 'Flow without CSRF token',
        steps: [{ action: 'click', selector: '#button' }]
      })
      .set('Accept', 'application/json')
      .expect(403);

    expect(res.body.error).toBe('Invalid CSRF token');
  });

  it('should pass with valid CSRF token (Expected to pass)', async () => {
    const getRes = await request(app).get('/flows').expect(200);
    const cookies = getRes.headers['set-cookie'];
    const csrfToken = cookies.find(c => c.includes('_csrf')).split('=')[1].split(';')[0];

    const postRes = await request(app)
      .post('/flows')
      .set('Cookie', [`_csrf=${csrfToken}`])
      .send({
        name: 'Flow with CSRF token',
        steps: [{ action: 'click', selector: '#button' }]
      })
      .expect(201);

    expect(postRes.body).toHaveProperty('_id');
    expect(postRes.body.name).toBe('Flow with CSRF token');
  });
});
