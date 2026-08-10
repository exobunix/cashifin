"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const BrandSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String },
    categories: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Category' }],
    isActive: { type: Boolean, default: true }
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Brand', BrandSchema);
