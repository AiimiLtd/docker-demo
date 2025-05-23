// server/src/index.js

// Ensure this is the VERY FIRST line of executable code.
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// import { rendered } from './rendered.js';

import express from 'express';
import fs from 'fs';

// Import the React App component
// import App from '../../frontend/src/App.js';

const app = express();
const PORT = process.env.PORT || 8080;
const IS_DEV = process.env.NODE_ENV === 'development';


// API Endpoints (no changes)
app.get('/api/data', (req, res) => {
  res.json({ message: 'Hello from the Server API!' });
});

app.get('/api/time', (req, res) => {
  res.json({ time: new Date().toLocaleTimeString() });
});


app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT} in ${process.env.NODE_ENV || 'production'} mode.`);
});

// rendered(app);