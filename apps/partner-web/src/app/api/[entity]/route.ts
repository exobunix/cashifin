import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://adarshsachan7071_db_user:toj0g2ENBYpIwXRG@cashifin.axlotxp.mongodb.net/?appName=cashifin';

async function connectToMongo() {
  if (mongoose.connection.readyState >= 1) return true;
  // Set a 3-second timeout for mongoose connection to fail fast and fall back
  await mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 3000,
    connectTimeoutMS: 3000,
  } as any);
  return true;
}

function getDbJsonPath() {
  const cwd = process.cwd();
  let p = path.join(cwd, '../../db.json');
  if (fs.existsSync(p)) return p;
  p = path.join(cwd, '../db.json');
  if (fs.existsSync(p)) return p;
  p = path.join(cwd, 'db.json');
  if (fs.existsSync(p)) return p;
  return 'd:\\all apps\\Cashify\\db.json';
}

function readFromDbJson(entity: string) {
  const filePath = getDbJsonPath();
  if (!fs.existsSync(filePath)) return [];
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(fileContent);
  return data[entity] || [];
}

function writeToDbJson(entity: string, action: string, payload: any) {
  const filePath = getDbJsonPath();
  if (!fs.existsSync(filePath)) return [];
  const fileContent = fs.readFileSync(filePath, 'utf8');
  const data = JSON.parse(fileContent);
  if (!data[entity]) data[entity] = [];

  if (action === 'create') {
    data[entity].push(payload);
  } else if (action === 'update') {
    const filterKey = payload.id !== undefined ? 'id' : payload.code !== undefined ? 'code' : null;
    if (filterKey) {
      const idx = data[entity].findIndex((item: any) => item[filterKey] === payload[filterKey]);
      if (idx !== -1) {
        data[entity][idx] = { ...data[entity][idx], ...payload };
      }
    }
  } else if (action === 'delete') {
    const idToDelete = payload.id || payload.code;
    if (idToDelete) {
      data[entity] = data[entity].filter((item: any) => item.id !== idToDelete && item.code !== idToDelete);
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  return data[entity];
}

function corsHeaders() {
  const headers = new Headers();
  headers.set('Access-Control-Allow-Origin', '*');
  headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PATCH, DELETE');
  headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return headers;
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function GET(
  req: NextRequest,
  { params }: { params: { entity: string } }
) {
  const entity = params.entity;
  try {
    await connectToMongo();
    const collection = mongoose.connection.db.collection(entity);
    const data = await collection.find({}).toArray();
    return NextResponse.json(data, { headers: corsHeaders() });
  } catch (err: any) {
    // Fail-safe fallback to db.json
    try {
      const data = readFromDbJson(entity);
      return NextResponse.json(data, { headers: corsHeaders() });
    } catch (fallbackErr: any) {
      return NextResponse.json({ error: err.message, fallbackError: fallbackErr.message }, { status: 500, headers: corsHeaders() });
    }
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { entity: string } }
) {
  const entity = params.entity;
  try {
    await connectToMongo();
    const collection = mongoose.connection.db.collection(entity);
    const body = await req.json();
    const action = body.action || 'create';

    if (action === 'create') {
      const newItem = body.item;
      await collection.insertOne(newItem);
    } else if (action === 'update') {
      const updatedItem = body.item;
      const filter: any = {};
      if (updatedItem.id !== undefined) filter.id = updatedItem.id;
      else if (updatedItem.code !== undefined) filter.code = updatedItem.code;
      
      const { _id, ...updateFields } = updatedItem;
      await collection.updateOne(filter, { $set: updateFields });
    } else if (action === 'delete') {
      const idToDelete = body.id;
      const filter: any = {
        $or: [
          { id: idToDelete },
          { code: idToDelete }
        ]
      };
      await collection.deleteOne(filter);
    }

    const data = await collection.find({}).toArray();
    return NextResponse.json({ success: true, data }, { headers: corsHeaders() });
  } catch (err: any) {
    // Fail-safe fallback to db.json
    try {
      const body = await req.json().catch(() => ({}));
      const action = body.action || 'create';
      const payload = action === 'delete' ? { id: body.id } : body.item;
      const data = writeToDbJson(entity, action, payload);
      return NextResponse.json({ success: true, data }, { headers: corsHeaders() });
    } catch (fallbackErr: any) {
      return NextResponse.json({ error: err.message, fallbackError: fallbackErr.message }, { status: 500, headers: corsHeaders() });
    }
  }
}
export const dynamic = 'force-dynamic';
