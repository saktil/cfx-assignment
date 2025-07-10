const express = require('express');
const app = express();
const port = 3000;

// Handler for the root path
app.get('/', (req, res) => {
  console.log('Node service: Received request for /');
  res.send('Hello from the Node.js service!');
});

// Handler for Kubernetes health probes
app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

app.listen(port, () => {
  console.log(`Node.js server listening on port ${port}`);
});