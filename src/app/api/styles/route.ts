import { NextResponse } from 'next/server';
import { getAllStyles } from '@/lib/styles';

export async function GET() {
  try {
    const styles = getAllStyles();
    return NextResponse.json({ styles });
  } catch (error) {
    console.error('Failed to get styles:', error);
    return NextResponse.json({ error: 'Failed to get styles' }, { status: 500 });
  }
}
