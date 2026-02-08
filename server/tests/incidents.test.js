const request = require('supertest');
const express = require('express');
const incidentsRouter = require('../src/routes/incidents');

describe('Incidents API', () => {
  let app;
  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/api/incidents', incidentsRouter);
  });

  it('should return 400 if type is missing', async () => {
    const res = await request(app)
      .post('/api/incidents')
      .send({ lat: 1, lon: 2 });
    expect(res.statusCode).toBe(400);
  });
});
