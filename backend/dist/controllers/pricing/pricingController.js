"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.evaluatePricing = exports.getQuestionsForModel = void 0;
const InspectionQuestion_1 = __importDefault(require("../../models/InspectionQuestion"));
const DeviceModel_1 = __importDefault(require("../../models/DeviceModel"));
const pricingEngine_1 = require("../../services/pricing-engine/final-price/pricingEngine");
const getQuestionsForModel = async (req, res) => {
    try {
        const { modelId } = req.params;
        const model = await DeviceModel_1.default.findById(modelId);
        if (!model) {
            return res.status(404).json({ message: 'Model not found' });
        }
        // Fetch questions applicable to this category, brand or model
        const questions = await InspectionQuestion_1.default.find({
            isActive: true,
            $or: [
                { modelIds: model._id },
                { brandIds: model.brandId },
                { categoryIds: model.categoryId },
                { modelIds: { $size: 0 }, brandIds: { $size: 0 }, categoryIds: { $size: 0 } } // Global questions
            ]
        }).sort({ displayOrder: 1 });
        return res.status(200).json(questions);
    }
    catch (error) {
        return res.status(500).json({ message: error.message || 'Internal server error' });
    }
};
exports.getQuestionsForModel = getQuestionsForModel;
const evaluatePricing = async (req, res) => {
    try {
        const { modelId, variantIndex, answers, region, distanceKm } = req.body;
        if (!modelId || !answers) {
            return res.status(400).json({ message: 'modelId and answers are required fields' });
        }
        const result = await (0, pricingEngine_1.calculateEstimatedPrice)({
            modelId,
            variantIndex,
            answers,
            region,
            distanceKm
        });
        return res.status(200).json(result);
    }
    catch (error) {
        return res.status(500).json({ message: error.message || 'Internal server error' });
    }
};
exports.evaluatePricing = evaluatePricing;
