import request from 'supertest';
import app from '../index';

describe('server app', () => {
  afterEach(() => {
    app.close();
  });

  test('should respond 200 on index route', () =>
    request(app).get('/').expect(200));
});

test('app', () => {
  expect(1 + 2).toBe(3);
});
