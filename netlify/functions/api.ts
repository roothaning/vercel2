// Netlify serverless function to proxy API requests
import { Handler } from '@netlify/functions';
import express, { Request, Response, NextFunction } from 'express';
import serverless from 'serverless-http';
import { registerRoutes } from '../../server/routes';

// Express app oluştur
const app = express();

// JSON parser middleware
app.use(express.json());

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    return res.status(200).json({});
  }
  next();
});

// API routes
registerRoutes(app);

// Hata işleme middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  return res.status(500).json({
    error: err.message || 'Internal Server Error',
  });
});

// Serverless uygulamayı oluştur
const serverlessHandler = serverless(app);

export const handler: Handler = async (event, context) => {
  // Call serverless handler and return response
  const response = await serverlessHandler(event, context) as any;
  return {
    statusCode: response.statusCode || 200,
    body: response.body || '',
    headers: response.headers || {}
  };
};