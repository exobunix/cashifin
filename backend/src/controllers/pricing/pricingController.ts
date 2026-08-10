import { Request, Response } from 'express';
import InspectionQuestion from '../../models/InspectionQuestion';
import DeviceModel from '../../models/DeviceModel';
import { calculateEstimatedPrice } from '../../services/pricing-engine/final-price/pricingEngine';

export const getQuestionsForModel = async (req: Request, res: Response) => {
  try {
    const { modelId } = req.params;
    const model = await DeviceModel.findById(modelId);
    if (!model) {
      return res.status(404).json({ message: 'Model not found' });
    }

    // Fetch questions applicable to this category, brand or model
    const questions = await InspectionQuestion.find({
      isActive: true,
      $or: [
        { modelIds: model._id },
        { brandIds: model.brandId },
        { categoryIds: model.categoryId },
        { modelIds: { $size: 0 }, brandIds: { $size: 0 }, categoryIds: { $size: 0 } } // Global questions
      ]
    }).sort({ displayOrder: 1 });

    return res.status(200).json(questions);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
};

export const evaluatePricing = async (req: Request, res: Response) => {
  try {
    const { modelId, variantIndex, answers, region, distanceKm } = req.body;
    if (!modelId || !answers) {
      return res.status(400).json({ message: 'modelId and answers are required fields' });
    }

    const result = await calculateEstimatedPrice({
      modelId,
      variantIndex,
      answers,
      region,
      distanceKm
    });

    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || 'Internal server error' });
  }
};
