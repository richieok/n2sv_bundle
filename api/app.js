const express = require('express');

const app = express();

const TEST = process.env.TEST || 'NOT_FOUND';

app.use(express.urlencoded({ extended: true }))
app.use(express.json());

app.get('/api', (req, res) => {
  res.json({ "message": "/api endpoint", "status": "true" })
});

app.get('/api/test', (req, res) => {
  res.json({ "message": "Test endpoint", "status": "true", "test": TEST })
});

const PORT = 4000;

app.listen(PORT, () => {
  console.log(`API server is running on port ${PORT}`);
});