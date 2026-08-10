import { Schema, model, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  image?: string;
  isActive: boolean;
}

const CategorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  image: { type: String },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default model<ICategory>('Category', CategorySchema);
