"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const InspectionQuestionSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    description: { type: String },
    questionType: {
        type: String,
        enum: ['radio', 'checkbox', 'dropdown', 'yes_no', 'slider', 'number', 'image', 'video', 'diagnostic'],
        required: true
    },
    options: [{
            optionText: { type: String, required: true },
            deductionType: { type: String, enum: ['flat', 'percentage', 'formula'], required: true },
            deductionValue: { type: Number, required: true }
        }],
    categoryIds: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Category' }],
    brandIds: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Brand' }],
    modelIds: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'DeviceModel' }],
    dependencies: [{
            parentQuestionId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'InspectionQuestion' },
            parentAnswerText: { type: String },
            action: { type: String, enum: ['show', 'hide'], default: 'show' }
        }],
    section: { type: String, required: true }, // e.g. "Physical Condition", "Functionality"
    isRequired: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });
exports.default = (0, mongoose_1.model)('InspectionQuestion', InspectionQuestionSchema);
