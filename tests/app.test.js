import request from 'supertest';
import app from '#src/app.js';

describe('API endpoints', () => {
  describe('Get /health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health').expect(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
    });
  });

  describe('Get /api', () => {
    it('should return API message', async () => {
      const response = await request(app).get('/api').expect(200);
      expect(response.body).toHaveProperty(
        'message',
        'Acquisition API is running'
      );
    });
  });

  describe('Get /nonexitent', () => {
    it('should return 404 for non-existing routes', async () => {
      const response = await request(app).get('/nonexitent').expect(404);
      expect(response.body).toHaveProperty('error', ' Route no found');
    });
  });
});
