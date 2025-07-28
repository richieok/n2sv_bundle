import express from 'express';
import { getParameters } from './aws.js';

const path = process.env['SSM_PARAMETER_PATH'] || '/devconzero/env/';

if (process.env.NODE_ENV === 'production') {
  if (process.env.CLOUD === 'aws') {
    getParameters(path).then(() => {
      console.log("Parameters loaded from AWS SSM");
      startservice();
    })
  }
} else {
  console.log("No AWS SSM parameters to load, starting service...");
  startservice();
}

async function startservice() {
  console.log("Starting service...");

  const app = express();
  
  app.use(express.urlencoded({ extended: true }))
  app.use(express.json());
  
  app.get('/api', (req, res) => {
    res.json({ "message": "/api endpoint", "status": "true" })
  });
  
  app.get('/api/test', (req, res) => {
    res.json({ "message": "Test endpoint", "status": "true", "test": process.env.TEST || 'NOT_FOUND' });
  });
  
  const PORT = process.env.PORT || 4000;
  
  app.listen(PORT, () => {
    console.log(`API server is running on port ${PORT}`);
  });
}
