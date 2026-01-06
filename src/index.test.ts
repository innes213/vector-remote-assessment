import request from 'supertest';
import app from './index';

describe('Express App', () => {
  describe('POST /ingest', () => {
    it('should ingest data', async () => {
      const response = await request(app).post('/ingest').send({});
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ message: 'Successfully ingested data' });
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ status: 'ok' });
    });
  });
});

