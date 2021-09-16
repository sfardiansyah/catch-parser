import request from 'supertest';
import { mocked } from 'ts-jest/utils';

import app from '../index';
import service from '../service';

jest.mock('../service', () => jest.fn());

const mockedService = mocked(service, true);

describe('server app', () => {
  afterEach(() => {
    app.close();
  });

  test('should respond 200 on index route', () =>
    request(app).get('/').expect(200));

  test('should call service function when running', () => {
    request(app).get('/');
    expect(mockedService.mock.calls).toHaveLength(1);
  });
});
