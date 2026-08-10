import { Schema, model, Document } from 'mongoose';

export interface IBrand extends Document {
  name: string;
  slug: string;
  image?: string;
  categories: Schema.Types.ObjectId[];
  isActive: boolean;
}

const BrandSchema = new Schema<IBrand>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  image: { type: String },
  categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default model<IBrand>('Brand', BrandSchema);
