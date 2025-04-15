import { parse } from 'csv-parse/sync';
import type { RawFixtureData, RawStandingsData, ProcessedTeamData, TeamStats } from './types';
import { FileConfig, defaultFileConfig } from '../config/files';

let currentFileConfig: FileConfig = defaultFileConfig;

export function updateLoaderConfig(newConfig: Partial<FileConfig>) {
  currentFileConfig = {
    ...currentFileConfig,
    ...newConfig
  };
}

// Base function to load any CSV file
async function fetchCSV(filename: string): Promise<string> {
  try {
    const response = await fetch(`/api/csv?file=${filename}`);
    if (!response.ok) {
      throw new Error(`Error loading CSV file: ${filename} (${response.status})`);
    }
    return response.text();
  } catch (error) {
    console.error('Error loading CSV:', error);
    throw error;
  }
}

// Generic function to parse CSV content
function parseCSV<T>(content: string): T[] {
  return parse(content, {
    columns: true,
    skip_empty_lines: true,
    cast: true
  }) as T[];
}

// Specific functions for each file type
async function loadStandingsFile(filename: string): Promise<RawStandingsData[]> {
  const content = await fetchCSV(filename);
  return parseCSV<RawStandingsData>(content);
}

async function loadFixturesFile(filename: string): Promise<RawFixtureData[]> {
  const content = await fetchCSV(filename);
  return parseCSV<RawFixtureData>(content);
}

async function loadTeamStatsFile(filename: string): Promise<TeamStats[]> {
  const content = await fetchCSV(filename);
  return parseCSV<TeamStats>(content);
}

// Function to load historical data
export async function loadHistoricalData(): Promise<{ standings: RawStandingsData[], fixtures: RawFixtureData[] }> {
  const standingsData = await loadStandingsFile(currentFileConfig.historical.standings);
  const fixturesData = await loadFixturesFile(currentFileConfig.historical.fixtures);
  
  return {
    standings: standingsData,
    fixtures: fixturesData
  };
}

// Function to load current season data
export async function loadCurrentSeasonData(): Promise<{ standings: RawStandingsData[], fixtures: RawFixtureData[] }> {
  const standingsData = await loadStandingsFile(currentFileConfig.current.standings);
  const fixturesData = await loadFixturesFile(currentFileConfig.current.fixtures);
  
  return {
    standings: standingsData,
    fixtures: fixturesData
  };
}

export async function loadModelFeatures(): Promise<any[]> {
  const content = await fetchCSV(currentFileConfig.other.modelFeatures);
  return parseCSV<any>(content);
}

export async function loadTeamStats(): Promise<TeamStats[]> {
  return loadTeamStatsFile(currentFileConfig.other.teamStats);
}

export async function loadAllMatches(): Promise<RawFixtureData[]> {
  return loadFixturesFile(currentFileConfig.other.allMatches);
}

// Função auxiliar para calcular estatísticas do time
function calculateTeamStats(matches: RawFixtureData[], isHome: boolean, teamName: string): TeamStats {
  const relevantMatches = matches.filter(m => 
    isHome ? m.home_team === teamName : m.away_team === teamName
  );

  const wins = relevantMatches.filter(m => {
    const teamGoals = isHome ? m.home_goals : m.away_goals;
    const opponentGoals = isHome ? m.away_goals : m.home_goals;
    return teamGoals > opponentGoals;
  }).length;

  const draws = relevantMatches.filter(m => m.home_goals === m.away_goals).length;
  const losses = relevantMatches.length - wins - draws;

  const goalsScored = relevantMatches.reduce((sum, m) => 
    sum + (isHome ? m.home_goals : m.away_goals), 0
  );

  const goalsConceded = relevantMatches.reduce((sum, m) => 
    sum + (isHome ? m.away_goals : m.home_goals), 0
  );

  return {
    gamesPlayed: relevantMatches.length,
    wins,
    draws,
    losses,
    goalsScored,
    goalsConceded,
    points: wins * 3 + draws,
    averageGoalsScored: goalsScored / relevantMatches.length,
    averageGoalsConceded: goalsConceded / relevantMatches.length,
    winRate: wins / relevantMatches.length,
    drawRate: draws / relevantMatches.length,
    lossRate: losses / relevantMatches.length
  };
} 