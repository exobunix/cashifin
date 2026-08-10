import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

// Fallback URI if environment variable is not defined
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://adarshsachan7071_db_user:toj0g2ENBYpIwXRG@cashifin.axlotxp.mongodb.net/?appName=cashifin';

async function connectToMongo() {
  if (mongoose.connection.readyState >= 1) return;
  await mongoose.connect(MONGODB_URI);
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
    return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders() });
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
    return NextResponse.json({ error: err.message }, { status: 500, headers: corsHeaders() });
  }
}
