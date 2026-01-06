import express, { Request, Response } from 'express';
import { EventEmitter } from 'events';
import { ingest } from './workers/ingest';
import { transform } from './workers/transform';
import { analyze } from './workers/analyze';
import { alert } from './workers/alert';

const app = express();
const PORT = process.env.PORT || 3000;
const eventEmitter = new EventEmitter();

app.use(express.json());

app.post('/ingest', async (req: Request, res: Response, next: express.NextFunction) => {
  try {
    const data = req.body;
    await ingest(data);
    eventEmitter.emit('transform', data);
    res.json({ message: 'Successfully ingested data' });
  } catch (error) {
    next(error);
  }
});

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

// Event listeners for worker pipeline
eventEmitter.on('transform', async (data: unknown) => {
  try {
    const transformedData = await transform(data);
    eventEmitter.emit('analyze', transformedData);
  } catch (error) {
    console.error('Error in transform worker:', error);
  }
});

eventEmitter.on('analyze', async (data: unknown) => {
  try {
    const analyzedData = await analyze(data);
    eventEmitter.emit('alert', analyzedData);
  } catch (error) {
    console.error('Error in analyze worker:', error);
  }
});

eventEmitter.on('alert', async (data: unknown) => {
  try {
    await alert(data);
  } catch (error) {
    console.error('Error in alert worker:', error);
  }
});

// Global error handler middleware
app.use((err: Error, req: Request, res: Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Process-level error handlers
process.on('unhandledRejection', (reason: unknown) => {
  console.error('Unhandled Promise Rejection:', reason);
});

process.on('uncaughtException', (error: Error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});


if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;

