"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const pricingController_1 = require("../controllers/pricing/pricingController");
const router = (0, express_1.Router)();
// Route to get questions for a specific device model
router.get('/questions/:modelId', pricingController_1.getQuestionsForModel);
// Route to evaluate answers and calculate price in real-time
router.post('/evaluate', pricingController_1.evaluatePricing);
exports.default = router;
