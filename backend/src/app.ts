import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pricingRouter from './routes/pricing.routes';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Register routes
app.use('/api/pricing', pricingRouter);

export default app;

