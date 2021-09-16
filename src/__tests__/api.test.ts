import fetch, { Response } from 'node-fetch';
import { mocked } from 'ts-jest/utils';

import fetchFile, { ORDERS_FILE_URL } from '../api';

jest.mock('node-fetch');

const mockedFetch = mocked(fetch, true);

describe('fetchFile', () => {
  test('should fetch with default url if no parameter provided', () => {
    mockedFetch.mockResolvedValue(new Response());

    fetchFile().then(() =>
      expect(mockedFetch).toHaveBeenCalledWith(ORDERS_FILE_URL)
    );
  });

  test('should fetch url from the parameter', () => {
    mockedFetch.mockResolvedValue(new Response());

    fetchFile('https://google.com').then(() =>
      expect(mockedFetch).toHaveBeenCalledWith('https://google.com')
    );
  });
});
