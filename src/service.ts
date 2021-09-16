import jsonlines from 'jsonlines';
import fs from 'fs';

import fetchFile from './api';
import { OrderRecord } from './types';
import summarizeOrder from './summarize';

export default async () => {
  const fileStream = fs.createWriteStream(`download/out.csv`);
  const parser = jsonlines.parse();

  parser.once('data', (record: OrderRecord) => {
    const summary = summarizeOrder(record);

    fileStream.write(`${Object.keys(summary).join(',')}\n`);
  });

  parser.on('data', (record: OrderRecord) => {
    const summary = summarizeOrder(record);

    if (summary.total_order_value)
      fileStream.write(`${Object.values(summary).join(',')}\n`);
  });

  const response = await fetchFile();

  await new Promise((resolve, reject) => {
    response.body?.pipe(parser);
    response.body?.on('error', reject);
    parser.on('end', resolve);
  });
};
