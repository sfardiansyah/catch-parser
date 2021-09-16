import fs from 'fs';
import { PassThrough, Transform } from 'stream';
import { Response } from 'node-fetch';
import { mocked } from 'ts-jest/utils';
import jsonlines from 'jsonlines';

import fetchFile from '../api';
import service from '../service';
import summarize from '../summarize';
import { OrderSummary } from '../types';

const mockedWriteStream = {
  write: jest.fn(),
};

jest.mock('fs', () => ({
  createWriteStream: jest.fn().mockImplementation(() => mockedWriteStream),
}));

jest.mock('../summarize');
jest.mock('../api');
jest.mock('jsonlines');

const mockedFs = mocked(fs, true);
const mockedSummarize = mocked(summarize, true);
const mockedFetchFile = mocked(fetchFile, true);
const mockedJsonlines = mocked(jsonlines, true);

describe('service', () => {
  const summary: OrderSummary = {
    order_id: 1,
    order_datetime: '2021-09-16T06:47:15.000Z',
    total_order_value: 27.67,
    average_unit_price: 9.22,
    distinct_unit_count: 2,
    total_unit_count: 3,
    customer_state: 'SEMARANG',
  };

  test('should create file stream', async () => {
    const stream = new PassThrough();
    const parser = new Transform();

    mockedFetchFile.mockResolvedValue(new Response(stream));
    mockedJsonlines.parse.mockReturnValue(parser);

    service();

    stream.emit('data', '{"response": "ok"}');
    stream.emit('end');

    expect(mockedFs.createWriteStream).toBeCalledTimes(1);
  });

  describe('parser', () => {
    mockedSummarize.mockReturnValue(summary);
    mockedFetchFile.mockResolvedValue(new Response(new PassThrough()));

    beforeEach(() => jest.clearAllMocks());

    test('should write csv header on the first chunk only', () => {
      const parser = new Transform();

      mockedJsonlines.parse.mockReturnValue(parser);

      service();

      parser.emit('data', '{"response": "ok"}');
      parser.emit('end');

      expect(mockedWriteStream.write).toHaveBeenNthCalledWith(
        1,
        `${Object.keys(summary).join(',')}\n`
      );
    });

    test('should write csv-parsed string for the 2nd row until stream finished', () => {
      const parser = new Transform();

      mockedJsonlines.parse.mockReturnValue(parser);

      service();

      parser.emit('data', '{"response": "ok"}');
      parser.emit('data', '{"response": "ok"}');
      parser.emit('data', '{"response": "ok"}');
      parser.emit('end');

      const csvParsedStr = `${Object.values(summary).join(',')}\n`;

      expect(mockedWriteStream.write).toHaveBeenNthCalledWith(2, csvParsedStr);
      expect(mockedWriteStream.write).toHaveBeenNthCalledWith(3, csvParsedStr);
      expect(mockedWriteStream.write).toHaveBeenNthCalledWith(4, csvParsedStr);
    });

    test('should not write records which have 0 total order value', () => {
      const zeroOrderValue: OrderSummary = { ...summary, total_order_value: 0 };
      const parser = new Transform();

      mockedJsonlines.parse.mockReturnValue(parser);
      mockedSummarize.mockReturnValue(zeroOrderValue);

      service();

      parser.emit('data', '{"response": "ok"}');
      parser.emit('end');

      expect(mockedWriteStream.write).toHaveBeenCalledTimes(1);
    });
  });
});
