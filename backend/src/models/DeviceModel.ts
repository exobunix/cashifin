import { Schema, model, Document } from 'mongoose';

export interface IVariant {
  ram?: string;
  storage?: string;
  color?: string;
  priceModifier?: number; // Flat adjustment (+/-) for this variant
}

export interface IDeviceModel extends Document {
  name: string;
  categoryId: Schema.Types.ObjectId;
  brandId: Schema.Types.ObjectId;
  image?: string;
  minPrice: number;
  maxPrice: number;
  expectedPrice: number;
  currentMarketValue: number;
  depreciationFormula?: string;
  demandMultiplier: number;
  supplyMultiplier: number;
  variants: IVariant[];
  isActive: boolean;
}

const DeviceModelSchema = new Schema<IDeviceModel>({
  name: { type: String, required: true },
  categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  brandId: { type: Schema.Types.ObjectId, ref: 'Brand', required: true },
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

export default model<IDeviceModel>('DeviceModel', DeviceModelSchema);
