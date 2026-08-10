"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateEstimatedPrice = void 0;
const DeviceModel_1 = __importDefault(require("../../../models/DeviceModel"));
const InspectionQuestion_1 = __importDefault(require("../../../models/InspectionQuestion"));
const PricingRule_1 = __importDefault(require("../../../models/PricingRule"));
const calculateEstimatedPrice = async (input) => {
    const { modelId, variantIndex, answers, region, distanceKm } = input;
    // 1. Fetch Model
    const model = await DeviceModel_1.default.findById(modelId);
    if (!model) {
        throw new Error('Device model not found');
    }
    let basePrice = model.expectedPrice;
    let variantPrice = basePrice;
    // 2. Adjust for variant
    if (variantIndex !== undefined && model.variants && model.variants[variantIndex]) {
        const variant = model.variants[variantIndex];
        if (variant.priceModifier) {
            variantPrice += variant.priceModifier;
        }
    }
    let runningPrice = variantPrice;
    const deductions = [];
    // Extract answers lookup map for fast query
    const answersMap = new Map();
    answers.forEach((ans) => {
        answersMap.set(ans.questionId, ans.selectedOptionText);
    });
    // 3. Question-level Deductions
    const questionIds = Array.from(answersMap.keys());
    const questions = await InspectionQuestion_1.default.find({ _id: { $in: questionIds } });
    questions.forEach((question) => {
        const selectedOptionText = answersMap.get(question._id.toString());
        if (!selectedOptionText)
            return;
        const matchedOption = question.options.find((opt) => opt.optionText.toLowerCase() === selectedOptionText.toLowerCase());
        if (matchedOption) {
            let impactAmount = 0;
            if (matchedOption.deductionType === 'flat') {
                impactAmount = matchedOption.deductionValue;
            }
            else if (matchedOption.deductionType === 'percentage') {
                impactAmount = (runningPrice * matchedOption.deductionValue) / 100;
            }
            runningPrice -= impactAmount;
            deductions.push({
                name: `Question: ${question.title} (${matchedOption.optionText})`,
                type: 'option_deduction',
                deductionType: matchedOption.deductionType,
                value: matchedOption.deductionValue,
                impactPrice: impactAmount,
            });
        }
    });
    // 4. Advanced Rule Evaluator
    const activeRules = await PricingRule_1.default.find({ isActive: true });
    // Build dynamic variables scope from answers for evaluations
    // For helper rules:
    // e.g. "batteryHealth < 80%" or "screenCondition = Broken"
    // Map questions titles/slugs to selected answers
    const scope = {};
    questions.forEach((q) => {
        const ansText = answersMap.get(q._id.toString());
        if (ansText) {
            // Normalize variable keys (e.g. "batteryHealth", "screenBroken")
            const key = q.title.toLowerCase().replace(/[^a-zA-Z0-9]/g, '');
            scope[key] = ansText;
            // Check numeric parses (e.g. for Battery Health "Below 80%" or "85%")
            const matchNum = ansText.match(/\d+/);
            if (matchNum) {
                scope[`${key}Numeric`] = parseInt(matchNum[0], 10);
            }
        }
    });
    // Evaluate rules
    activeRules.forEach((rule) => {
        let matchesRule = false;
        if (rule.conditions && rule.conditions.length > 0) {
            const matchResults = rule.conditions.map((cond) => {
                // e.g., cond.field = 'batteryHealth', scope.batteryhealthnumeric
                const normalizedField = cond.field.toLowerCase();
                const valueInScope = scope[`${normalizedField}numeric`] !== undefined
                    ? scope[`${normalizedField}numeric`]
                    : scope[normalizedField];
                if (valueInScope === undefined)
                    return false;
                switch (cond.operator) {
                    case 'eq':
                        return valueInScope === cond.value;
                    case 'ne':
                        return valueInScope !== cond.value;
                    case 'lt':
                        return valueInScope < cond.value;
                    case 'gt':
                        return valueInScope > cond.value;
                    case 'lte':
                        return valueInScope <= cond.value;
                    case 'gte':
                        return valueInScope >= cond.value;
                    default:
                        return false;
                }
            });
            if (rule.conditionType === 'AND') {
                matchesRule = matchResults.every((res) => res === true);
            }
            else {
                matchesRule = matchResults.some((res) => res === true);
            }
        }
        if (matchesRule) {
            let impactAmount = 0;
            if (rule.deductionType === 'flat') {
                impactAmount = rule.deductionValue;
            }
            else if (rule.deductionType === 'percentage') {
                impactAmount = (runningPrice * rule.deductionValue) / 100;
            }
            runningPrice -= impactAmount;
            deductions.push({
                name: `Rule Match: ${rule.name}`,
                type: 'advanced_rule',
                deductionType: rule.deductionType,
                value: rule.deductionValue,
                impactPrice: impactAmount,
            });
        }
    });
    // 5. Global multipliers & logistics
    // Logistics cost: if distance > 30 KM deduct flat amount
    if (distanceKm && distanceKm > 30) {
        runningPrice -= 200;
        deductions.push({
            name: 'Logistics Deduction (Distance > 30 KM)',
            type: 'logistics',
            deductionType: 'flat',
            value: 200,
            impactPrice: 200,
        });
    }
    // 6. Constrain price between Min/Max
    let finalPrice = Math.round(runningPrice);
    if (finalPrice < model.minPrice) {
        finalPrice = model.minPrice;
    }
    if (finalPrice > model.maxPrice) {
        finalPrice = model.maxPrice;
    }
    const totalDeductions = variantPrice - finalPrice;
    const conditionScore = Math.max(0, Math.min(100, Math.round((finalPrice / variantPrice) * 100)));
    return {
        basePrice,
        variantPrice,
        finalPrice,
        totalDeductions,
        conditionScore,
        deductions,
    };
};
exports.calculateEstimatedPrice = calculateEstimatedPrice;
