import express, { Request, Response, NextFunction, Application } from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import routes from './routes/index';
import './db';

const server: Application = express();

server.use(express.urlencoded({ extended: true, limit: '50mb' }));
server.use(express.json({ limit: '50mb' }));
server.use(cookieParser());
server.use(morgan('dev'));

// CORS configuration
server.use((_req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173'); // Vite runs on port 5173
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

server.use('/', routes);

// Error catching middleware
interface ErrorWithStatus extends Error {
  status?: number;
}

server.use((err: ErrorWithStatus, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

export default server;

