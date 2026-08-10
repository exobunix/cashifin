"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const PricingRuleSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: { type: String },
    conditionType: { type: String, enum: ['AND', 'OR'], default: 'AND' },
    conditions: [{
            field: { type: String, required: true },
            operator: { type: String, enum: ['eq', 'ne', 'lt', 'gt', 'lte', 'gte', 'in'], required: true },
            value: mongoose_1.Schema.Types.Mixed
        }],
    deductionType: { type: String, enum: ['flat', 'percentage'], required: true },
    deductionValue: { type: Number, required: true },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('PricingRule', PricingRuleSchema);
