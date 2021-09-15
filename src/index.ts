import express from 'express';
import dotenv from 'dotenv';

import fetchAndTransform from './service';

dotenv.config();

const app = express();

const port = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('Hello from Catch JSONL Parser!'));

fetchAndTransform();

const server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running at http://localhost:${port}`);
});

export default server;
