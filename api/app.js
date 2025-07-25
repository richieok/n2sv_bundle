import express from 'express';
import { getParameters } from './aws.js';

const path = '/devconzero/env/';

if (process.env.NODE_ENV === 'production') {
  if (process.env.CLOUD === 'aws') {
    getParameters(path).then(() => {
      console.log('Environment variables loaded successfully');
    }).catch(error => {
      console.error('Failed to load environment variables:', error);
    })
  }
}

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