import { readFile } from 'fs/promises';
import { join } from 'path';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const filename = url.searchParams.get('file');

    if (!filename) {
      return NextResponse.json({ error: 'Arquivo não especificado' }, { status: 400 });
    }

    // Validar o nome do arquivo para evitar directory traversal
    const validFiles = [
      'historical/historical_standings_20250412.csv',
      'historical/historical_fixtures_20250412.csv',
      'current/standings_20250412.csv',
      'current/fixtures_20250412.csv',
      'model_features.csv',
      'all_team_stats.csv',
      'all_matches.csv'
    ];

    if (!validFiles.includes(filename)) {
      return NextResponse.json({ error: 'Arquivo inválido' }, { status: 400 });
    }

    const filePath = join(process.cwd(), 'data', 'raw', 'api_football', filename);
    const fileContent = await readFile(filePath, 'utf-8');

    return new NextResponse(fileContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (error) {
    console.error('Erro ao ler arquivo CSV:', error);
    return NextResponse.json({ error: 'Erro ao ler arquivo' }, { status: 500 });
  }
} 