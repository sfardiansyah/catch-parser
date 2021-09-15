import fs from 'fs';
import fetch from 'node-fetch';

const fetchOrders = async () => {
  const res = await fetch(
    'https://s3-ap-southeast-2.amazonaws.com/catch-code-challenge/challenge-1-in.jsonl'
  );

  const fileStream = fs.createWriteStream('out.csv');
  await new Promise((resolve, reject) => {
    res.body?.pipe(fileStream);
    res.body?.on('error', reject);
    fileStream.on('finish', resolve);
  });
};

export default fetchOrders;
