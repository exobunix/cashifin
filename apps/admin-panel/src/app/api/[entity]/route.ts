import { NextRequest, NextResponse } from 'next/server';
import { readDb, writeDb } from '../../../lib/db';

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
  const db: any = readDb();

  if (db[entity]) {
    return NextResponse.json(db[entity], { headers: corsHeaders() });
  }
  return NextResponse.json({ error: 'Entity not found' }, { status: 404, headers: corsHeaders() });
}

export async function POST(
  req: NextRequest,
  { params }: { params: { entity: string } }
) {
  const entity = params.entity;
  const db: any = readDb();

  if (!db[entity]) {
    return NextResponse.json({ error: 'Entity not found' }, { status: 404, headers: corsHeaders() });
  }

  try {
    const body = await req.json();
    const action = body.action || 'create';

    if (action === 'create') {
      const newItem = body.item;
      db[entity].push(newItem);
    } else if (action === 'update') {
      const updatedItem = body.item;
      db[entity] = db[entity].map((item: any) => {
        const matchesId = updatedItem.id !== undefined && item.id === updatedItem.id;
        const matchesCode = updatedItem.code !== undefined && item.code === updatedItem.code;
        return (matchesId || matchesCode) ? updatedItem : item;
      });
    } else if (action === 'delete') {
      const idToDelete = body.id;
      db[entity] = db[entity].filter((item: any) => {
        const matchesId = item.id !== undefined && item.id === idToDelete;
        const matchesCode = item.code !== undefined && item.code === idToDelete;
        return !(matchesId || matchesCode);
      });
    }

    writeDb(db);
    return NextResponse.json({ success: true, data: db[entity] }, { headers: corsHeaders() });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500, headers: corsHeaders() });
  }
}
