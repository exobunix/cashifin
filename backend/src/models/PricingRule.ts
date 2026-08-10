import { Schema, model, Document } from 'mongoose';

export interface IRuleCondition {
  field: 'batteryHealth' | 'screenCondition' | 'displayChanged' | 'faceIdWorking' | 'originalBox' | 'originalInvoice' | 'ageMonths';
  operator: 'eq' | 'ne' | 'lt' | 'gt' | 'lte' | 'gte' | 'in';
  value: any;
}

export interface IPricingRule extends Document {
  name: string;
  description?: string;
  conditionType: 'AND' | 'OR';
  conditions: IRuleCondition[];
  deductionType: 'flat' | 'percentage';
  deductionValue: number;
  isActive: boolean;
}

const PricingRuleSchema = new Schema<IPricingRule>({
  name: { type: String, required: true },
  description: { type: String },
  conditionType: { type: String, enum: ['AND', 'OR'], default: 'AND' },
  conditions: [{
    field: { type: String, required: true },
    operator: { type: String, enum: ['eq', 'ne', 'lt', 'gt', 'lte', 'gte', 'in'], required: true },
    value: Schema.Types.Mixed
  }],
  deductionType: { type: String, enum: ['flat', 'percentage'], required: true },
  deductionValue: { type: Number, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default model<IPricingRule>('PricingRule', PricingRuleSchema);
