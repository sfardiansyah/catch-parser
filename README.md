# Catch JSONL Parser
> By: Syahrul Ardiansyah <syahrul.findi@gmail.com>

## Prerequisites
- [Node](https://nodejs.org/en/download/) v14
- [Yarn](https://classic.yarnpkg.com/en/docs/install#install-via-npm) (Optional)

## Installation
```
# if yarn installed
yarn

# or use npm
npm install
```

## How to Use
```
# if yarn installed
yarn start

# or use npm
npm run start
```
When the server starts it will fetch the file and parse it asynchronously to the file named `out.csv`.

## Explanation
This app uses 3 main packages: 
- `express`: To create a web server
- `node-fetch`: To fetch the file
- `jsonlines`: To parse the data stream to JSON/Object format

This app doesn't use any package to parse JSON to CSV, because we just have to get the values in `OrderSummary` object, then join them with comma delimiter and write to the file.

This app parse the file asynchronously, so the web server will be available while the app parsing a very large file. Thanks to `jsonlines` package, we could pipe the stream from `node-fetch`, parse the chunks, and write it line by line.

Because we still need the CSV header, this app will write the keys of `OrderSummary` object before the first valid JSONL line only.