"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CategorySchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('Category', CategorySchema);
