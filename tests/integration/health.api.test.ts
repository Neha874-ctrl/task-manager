import request from 'supertest';
import app from '../../src/app';

describe('Health Endpoint Integration Test', () => {
  it('GET /health should return 200 with status UP', async () => {
    const res = await request(app).get('/health');

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('UP');
    expect(res.body.timestamp).toBeDefined();
    expect(res.body.uptime).toBeGreaterThanOrEqual(0);
    expect(res.body.version).toBe('1.0.0');
  });

  it('GET / should return 200 with welcome message', async () => {
    const res = await request(app).get('/');

    expect(res.status).toBe(200);
    expect(res.body.message).toBeDefined();
    expect(res.body.health).toBe('/health');
    expect(res.body.documentation).toBe('/api/tasks');
  });
});
