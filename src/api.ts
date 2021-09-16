import fetch from 'node-fetch';
import 'core-js/stable';
import 'regenerator-runtime/runtime';

export const ORDERS_FILE_URL =
  'https://s3-ap-southeast-2.amazonaws.com/catch-code-challenge/challenge-1-in.jsonl';

const fetchFile = async (fileUrl?: string) => fetch(fileUrl || ORDERS_FILE_URL);

export default fetchFile;
