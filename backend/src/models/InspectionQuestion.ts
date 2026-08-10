import { Schema, model, Document } from 'mongoose';

export interface IAnswerOption {
  optionText: string;
  deductionType: 'flat' | 'percentage' | 'formula';
  deductionValue: number; // e.g. 1500 for flat, 12 for 12%
}

export interface IQuestionDependency {
  parentQuestionId: Schema.Types.ObjectId;
  parentAnswerText: string;
  action: 'show' | 'hide';
}

export interface IInspectionQuestion extends Document {
  title: string;
  description?: string;
  questionType: 'radio' | 'checkbox' | 'dropdown' | 'yes_no' | 'slider' | 'number' | 'image' | 'video' | 'diagnostic';
  options: IAnswerOption[];
  categoryIds: Schema.Types.ObjectId[];
  brandIds: Schema.Types.ObjectId[];
  modelIds: Schema.Types.ObjectId[];
  dependencies: IQuestionDependency[];
  section: string;
  isRequired: boolean;
  displayOrder: number;
  isActive: boolean;
}

const InspectionQuestionSchema = new Schema<IInspectionQuestion>({
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
  categoryIds: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  brandIds: [{ type: Schema.Types.ObjectId, ref: 'Brand' }],
  modelIds: [{ type: Schema.Types.ObjectId, ref: 'DeviceModel' }],
  dependencies: [{
    parentQuestionId: { type: Schema.Types.ObjectId, ref: 'InspectionQuestion' },
    parentAnswerText: { type: String },
    action: { type: String, enum: ['show', 'hide'], default: 'show' }
  }],
  section: { type: String, required: true }, // e.g. "Physical Condition", "Functionality"
  isRequired: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default model<IInspectionQuestion>('InspectionQuestion', InspectionQuestionSchema);
