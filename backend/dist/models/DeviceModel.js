"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const DeviceModelSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    categoryId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Category', required: true },
    brandId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Brand', required: true },
    image: { type: String },
    minPrice: { type: Number, required: true },
    maxPrice: { type: Number, required: true },
    expectedPrice: { type: Number, required: true },
    currentMarketValue: { type: Number, required: true },
    depreciationFormula: { type: String },
    demandMultiplier: { type: Number, default: 1.0 },
    supplyMultiplier: { type: Number, default: 1.0 },
    variants: [{
            ram: String,
            storage: String,
            color: String,
            priceModifier: { type: Number, default: 0 }
        }],
    isActive: { type: Boolean, default: true }
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('DeviceModel', DeviceModelSchema);
