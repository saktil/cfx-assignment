const express = require('express');
const os = require('os');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({
    message: 'Hello from Node.js service! 🚀',
    hostname: os.hostname(),
    version: 'v1.0.0'
  });
});

app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

app.listen(port, () => {
  console.log(`Node.js server listening on port ${port}`);
});
