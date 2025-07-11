const express = require('express');
const os = require('os');
const app = express();
const port = process.env.PORT || 3000;

// Middleware for logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url} from ${req.ip}`);
  next();
});

// Handler for the root path
app.get('/', (req, res) => {
  res.json({
    message: 'Hello from the Node.js service! 🚀',
    version: 'v1.0.0',
    hostname: os.hostname(),
    timestamp: new Date().toISOString()
  });
});

// Handler for Kubernetes health probes
app.get('/healthz', (req, res) => {
  res.status(200).send('OK');
});

// Ready probe
app.get('/ready', (req, res) => {
  res.status(200).send('Ready');
});

app.listen(port, () => {
  console.log(`Node.js server listening on port ${port}`);
  console.log(`Health check available at /healthz`);
});