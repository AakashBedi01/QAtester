// tests/csrfProtection.test.js
import request from 'supertest';
import app from '../app';  // Your Express app

describe('CSRF Protection', () => {

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
    // First request to get the CSRF token
    const getRes = await request(app).get('/flows').expect(200);
    const csrfToken = getRes.headers['set-cookie'][0].split('=')[1].split(';')[0];

    // Use the token in the next request
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
