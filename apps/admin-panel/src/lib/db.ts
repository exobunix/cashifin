import fs from 'fs';
import path from 'path';

// Shared database path in root workspace
const dbPath = 'd:/all apps/Cashify/db.json';

const defaultDb = {
  categories: [
    { id: 'CAT-001', name: 'Smartphones', slug: 'smartphones', count: '14,245 Devices' },
    { id: 'CAT-002', name: 'Laptops', slug: 'laptops', count: '3,842 Devices' },
    { id: 'CAT-003', name: 'Tablets', slug: 'tablets', count: '1,950 Devices' },
    { id: 'CAT-004', name: 'Smart Watches', slug: 'watches', count: '1,245 Devices' }
  ],
  brands: [
    { id: 'BRD-001', name: 'Apple', slug: 'apple', models: 45, category: 'Smartphones / Laptops' },
    { id: 'BRD-002', name: 'Samsung', slug: 'samsung', models: 82, category: 'Smartphones / Tablets' }
  ],
  models: [
    { id: "MDL-201", name: "iPhone 11", brand: "Apple", basePrice: "₹13,450", range: "₹3,363 - ₹15,467", status: "Published", rawBase: 13450, rawMin: 3363, rawMax: 15467, demandMult: '1.00x', supplyMult: '1.00x' },
    { id: "MDL-202", name: "iPhone 12", brand: "Apple", basePrice: "₹14,900", range: "₹3,725 - ₹17,135", status: "Published", rawBase: 14900, rawMin: 3725, rawMax: 17135, demandMult: '1.00x', supplyMult: '1.00x' }
  ],
  questions: [
    { id: 1, order: 1, text: 'Is the device turning on properly?', type: 'Single Select', impact: 'High', required: true, status: 'Active', categories: ['Smartphones', 'Laptops', 'Tablets'], brands: ['Apple', 'Samsung', 'OnePlus', 'Google'], models: ['iPhone 11', 'iPhone 12', 'iPhone 13'] },
    { id: 2, order: 2, text: 'Screen Condition', type: 'Single Select', impact: 'High', required: true, status: 'Active', categories: ['Smartphones', 'Tablets'], brands: ['Apple', 'Samsung', 'OnePlus'], models: ['iPhone 11', 'iPhone 12', 'iPhone 13'] },
    { id: 3, order: 3, text: 'Body Condition', type: 'Single Select', impact: 'Medium', required: true, status: 'Active', categories: ['Smartphones', 'Laptops', 'Tablets'], brands: ['Apple', 'Samsung'], models: ['iPhone 11', 'iPhone 12'] },
    { id: 4, order: 4, text: 'Battery Health', type: 'Single Select', impact: 'High', required: true, status: 'Active', categories: ['Smartphones', 'Tablets'], brands: ['Apple', 'Samsung', 'Google'], models: ['iPhone 11', 'iPhone 12'] }
  ],
  users: [
    { id: 'USR-101', name: 'Rahul Sharma', email: 'rahul.s@gmail.com', phone: '+91 98765 43210', date: '12 May 2024', wallet: '₹1,500', status: 'Active' }
  ],
  partners: [
    { id: 'PTN-101', name: 'Rohit Sharma', location: 'New Delhi (South)', rating: '4.9', orders: 256, status: 'Online', wallet: '₹8,450', score: '98%' }
  ],
  orders: [
    { id: 'ORD-2024-12546', customer: 'Jane Doe', device: 'iPhone 14 Pro Max (128GB)', price: '₹67,500', status: 'Pending', partner: 'Rohit Sharma', date: '20 Jun 2024' }
  ],
  pickups: [
    { orderId: 'ORD-2024-12546', slot: '21 Jun 2024, 10:00 AM - 01:00 PM', address: 'B-45, Connaught Place, New Delhi', distance: '4.2 KM', partner: 'Rohit Sharma', status: 'Scheduled' }
  ],
  pricingRules: [
    { id: 'RULE-001', condition: 'Battery Health < 80%', deduction: 'Reduce ₹1,800', category: 'Smartphones', status: 'Active' }
  ],
  bonusRules: [
    { id: 'BONUS-001', condition: 'Original Box Available', bonus: 'Add ₹300', category: 'All Devices', status: 'Active' }
  ],
  formulas: [
    { id: 'FORM-01', name: 'Standard Depreciation', formula: 'expectedPrice * Math.pow(0.97, ageMonths)', type: 'Depreciation' }
  ]
};

export function readDb() {
  if (!fs.existsSync(dbPath)) {
    writeDb(defaultDb);
    return defaultDb;
  }
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (e) {
    return defaultDb;
  }
}

export function writeDb(data: any) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
}
