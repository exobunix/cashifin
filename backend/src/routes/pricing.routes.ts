import { Router } from 'express';
import { getQuestionsForModel, evaluatePricing } from '../controllers/pricing/pricingController';

const router = Router();

// Route to get questions for a specific device model
router.get('/questions/:modelId', getQuestionsForModel);

// Route to evaluate answers and calculate price in real-time
router.post('/evaluate', evaluatePricing);

export default router;
