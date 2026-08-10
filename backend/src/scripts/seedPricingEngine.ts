import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from '../models/Category';
import Brand from '../models/Brand';
import DeviceModel from '../models/DeviceModel';
import InspectionQuestion from '../models/InspectionQuestion';
import PricingRule from '../models/PricingRule';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

async function seed() {
  if (!MONGODB_URI) {
    console.error('MONGODB_URI is not set in environment variables');
    process.exit(1);
  }

  console.log('Connecting to database...');
  await mongoose.connect(MONGODB_URI);
  console.log('Connected.');

  // Clear existing data
  console.log('Clearing old data...');
  await Category.deleteMany({});
  await Brand.deleteMany({});
  await DeviceModel.deleteMany({});
  await InspectionQuestion.deleteMany({});
  await PricingRule.deleteMany({});

  // 1. Create Category
  console.log('Seeding Category...');
  const category = await Category.create({
    name: 'Smartphones',
    slug: 'smartphones',
    isActive: true,
  });

  // 2. Create Brand
  console.log('Seeding Brand...');
  const brand = await Brand.create({
    name: 'Apple',
    slug: 'apple',
    categories: [category._id],
    isActive: true,
  });

  // 3. Create Model
  console.log('Seeding Model...');
  const deviceModel = await DeviceModel.create({
    name: 'iPhone 14 Pro',
    categoryId: category._id,
    brandId: brand._id,
    minPrice: 15000,
    maxPrice: 75000,
    expectedPrice: 65000,
    currentMarketValue: 70000,
    demandMultiplier: 1.0,
    supplyMultiplier: 1.0,
    variants: [
      { ram: '6 GB', storage: '128 GB', priceModifier: 0 },
      { ram: '6 GB', storage: '256 GB', priceModifier: 5000 },
      { ram: '6 GB', storage: '512 GB', priceModifier: 12000 }
    ],
    isActive: true
  });

  // 4. Create Questions
  console.log('Seeding Questions...');
  
  const qPower = await InspectionQuestion.create({
    title: 'Is the phone turning ON?',
    description: 'Verify if the device boots up to the lock screen or home screen.',
    questionType: 'radio',
    options: [
      { optionText: 'Yes', deductionType: 'flat', deductionValue: 0 },
      { optionText: 'No', deductionType: 'percentage', deductionValue: 100 }
    ],
    categoryIds: [category._id],
    brandIds: [brand._id],
    modelIds: [deviceModel._id],
    section: 'Functionality',
    isRequired: true,
    displayOrder: 1,
    isActive: true
  });

  const qScreen = await InspectionQuestion.create({
    title: 'Screen Condition',
    description: 'Inspect the front glass screen for scratches, cracks, or lines.',
    questionType: 'radio',
    options: [
      { optionText: 'Perfect', deductionType: 'flat', deductionValue: 0 },
      { optionText: 'Minor Scratch', deductionType: 'flat', deductionValue: 2000 },
      { optionText: 'Deep Scratch', deductionType: 'flat', deductionValue: 4500 },
      { optionText: 'Broken', deductionType: 'flat', deductionValue: 8000 }
    ],
    categoryIds: [category._id],
    brandIds: [brand._id],
    modelIds: [deviceModel._id],
    section: 'Physical Condition',
    isRequired: true,
    displayOrder: 2,
    isActive: true
  });

  const qBattery = await InspectionQuestion.create({
    title: 'Battery Health',
    description: 'Check battery maximum capacity percentage in system settings.',
    questionType: 'radio',
    options: [
      { optionText: 'Above 90%', deductionType: 'flat', deductionValue: 0 },
      { optionText: '80-90%', deductionType: 'flat', deductionValue: 1500 },
      { optionText: 'Below 80%', deductionType: 'flat', deductionValue: 4000 }
    ],
    categoryIds: [category._id],
    brandIds: [brand._id],
    modelIds: [deviceModel._id],
    section: 'Battery',
    isRequired: true,
    displayOrder: 3,
    isActive: true
  });

  // 5. Create Advanced Pricing Rules
  console.log('Seeding Advanced Rules...');
  await PricingRule.create({
    name: 'Screen Broken and Low Battery Health',
    description: 'Apply additional flat penalty if screen is broken and battery health is poor (<80%)',
    conditionType: 'AND',
    conditions: [
      { field: 'screenCondition', operator: 'eq', value: 'Broken' },
      { field: 'batteryHealth', operator: 'eq', value: 'Below 80%' }
    ],
    deductionType: 'flat',
    deductionValue: 3000,
    isActive: true
  });

  console.log('Seeding process completed successfully!');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seeding failed:', err);
  mongoose.disconnect();
});
