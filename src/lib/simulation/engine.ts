import { calculateConfidenceInterval, mean, mode } from "../utils";
import type { Match, SeasonData, SimulationParams, Team, TeamPosition, SimulationResult } from "./types";
import { TeamStats } from '../../types/team';
import {
  calculateHomePerformance,
  calculateAwayPerformance,
  calculateHomeGoalsScored,
  calculateHomeGoalsConceded,
  calculateAwayGoalsScored,
  calculateAwayGoalsConceded,
  calculateRecentForm,
  calculateConsistency
} from './stats';

/**
 * Calculates head-to-head statistics between two teams
 * @param homeTeam Home team data
 * @param awayTeam Away team data
 * @returns Head-to-head performance metrics
 */
function calculateH2HStats(homeTeam: Team, awayTeam: Team): {
  homeWinRate: number;
  awayWinRate: number;
  avgHomeGoals: number;
  avgAwayGoals: number;
} {
  const h2hHomeMatches = homeTeam.homeGames.filter(m => m.awayTeam === awayTeam.name);
  const h2hAwayMatches = homeTeam.awayGames.filter(m => m.homeTeam === awayTeam.name);
  
  const totalMatches = h2hHomeMatches.length + h2hAwayMatches.length;
  if (totalMatches === 0) return { homeWinRate: 0.5, awayWinRate: 0.5, avgHomeGoals: 0, avgAwayGoals: 0 };

  const homeWins = h2hHomeMatches.filter(m => m.homeGoals > m.awayGoals).length +
                  h2hAwayMatches.filter(m => m.awayGoals > m.homeGoals).length;
  
  const awayWins = h2hHomeMatches.filter(m => m.homeGoals < m.awayGoals).length +
                  h2hAwayMatches.filter(m => m.awayGoals < m.homeGoals).length;

  const homeGoals = h2hHomeMatches.reduce((acc, m) => acc + m.homeGoals, 0) +
                   h2hAwayMatches.reduce((acc, m) => acc + m.awayGoals, 0);
  
  const awayGoals = h2hHomeMatches.reduce((acc, m) => acc + m.awayGoals, 0) +
                   h2hAwayMatches.reduce((acc, m) => acc + m.homeGoals, 0);

  return {
    homeWinRate: homeWins / totalMatches,
    awayWinRate: awayWins / totalMatches,
    avgHomeGoals: homeGoals / totalMatches,
    avgAwayGoals: awayGoals / totalMatches
  };
}

/**
 * Calculates team's form trend over the last N matches
 * @param team Team data
 * @param lastN Number of matches to consider
 * @returns Form trend score between 0 and 1
 */
function calculateFormTrend(team: Team, lastN: number = 5): number {
  const recentMatches = [...team.homeGames, ...team.awayGames]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, lastN);

  if (recentMatches.length === 0) return 0.5;

  const formPoints = recentMatches.map((match, index) => {
    const isHome = match.homeTeam === team.name;
    const won = isHome ? match.homeGoals > match.awayGoals : match.awayGoals > match.homeGoals;
    const drew = match.homeGoals === match.awayGoals;
    const weight = (lastN - index) / lastN; // More recent matches have higher weight
    
    if (won) return 3 * weight;
    if (drew) return 1 * weight;
    return 0;
  });

  const maxPossiblePoints = formPoints.reduce((acc, _, i) => acc + (3 * ((lastN - i) / lastN)), 0);
  const actualPoints = formPoints.reduce((acc, points) => acc + points, 0);

  return actualPoints / maxPossiblePoints;
}

// Cache para fatoriais
const factorialCache: { [key: number]: number } = { 0: 1, 1: 1 };

function factorial(n: number): number {
  if (factorialCache[n] !== undefined) return factorialCache[n];
  factorialCache[n] = n * factorial(n - 1);
  return factorialCache[n];
}

function calculatePoissonProbability(lambda: number, k: number): number {
  return (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);
}

/**
 * Calcula as probabilidades de um confronto entre dois times
 * baseado em suas estatísticas agregadas
 */
export function calculateMatchProbabilities(
  homeTeam: Team,
  awayTeam: Team,
  seasonData: SeasonData
): { homeWin: number; draw: number; awayWin: number; expectedHomeGoals: number; expectedAwayGoals: number } {
  // Médias do campeonato (aproximadas do Brasileirão)
  const LEAGUE_AVG_HOME_GOALS = 1.5;
  const LEAGUE_AVG_AWAY_GOALS = 1.0;
  const HOME_ADVANTAGE = 1.1;

  // Calcula médias de gols baseadas em dados históricos
  const homeTeamMatches = homeTeam.homeGames.length + homeTeam.awayGames.length;
  const awayTeamMatches = awayTeam.homeGames.length + awayTeam.awayGames.length;
  
  const homeTeamAvgGoals = homeTeam.goalsFor / homeTeamMatches;
  const homeTeamAvgConceded = homeTeam.goalsAgainst / homeTeamMatches;
  const awayTeamAvgGoals = awayTeam.goalsFor / awayTeamMatches;
  const awayTeamAvgConceded = awayTeam.goalsAgainst / awayTeamMatches;

  // Ajusta médias considerando a média da liga
  const homeAttackStrength = homeTeamAvgGoals / LEAGUE_AVG_HOME_GOALS;
  const homeDefenseStrength = homeTeamAvgConceded / LEAGUE_AVG_AWAY_GOALS;
  const awayAttackStrength = awayTeamAvgGoals / LEAGUE_AVG_AWAY_GOALS;
  const awayDefenseStrength = awayTeamAvgConceded / LEAGUE_AVG_HOME_GOALS;

  // Calcula gols esperados
  const homeExpectedGoals = LEAGUE_AVG_HOME_GOALS * homeAttackStrength * awayDefenseStrength * HOME_ADVANTAGE;
  const awayExpectedGoals = LEAGUE_AVG_AWAY_GOALS * awayAttackStrength * homeDefenseStrength;

  // Limita o número máximo de gols para otimização
  const MAX_GOALS = 4;
  let homeWinProb = 0;
  let drawProb = 0;
  let awayWinProb = 0;

  // Pré-calcula probabilidades de Poisson
  const homePoissonProbs: number[] = [];
  const awayPoissonProbs: number[] = [];
  
  for (let i = 0; i <= MAX_GOALS; i++) {
    homePoissonProbs[i] = calculatePoissonProbability(homeExpectedGoals, i);
    awayPoissonProbs[i] = calculatePoissonProbability(awayExpectedGoals, i);
  }

  // Calcula probabilidades
  for (let homeGoals = 0; homeGoals <= MAX_GOALS; homeGoals++) {
    for (let awayGoals = 0; awayGoals <= MAX_GOALS; awayGoals++) {
      const prob = homePoissonProbs[homeGoals] * awayPoissonProbs[awayGoals];
      
      if (homeGoals > awayGoals) homeWinProb += prob;
      else if (homeGoals === awayGoals) drawProb += prob;
      else awayWinProb += prob;
    }
  }

  // Normaliza probabilidades
  const totalProb = homeWinProb + drawProb + awayWinProb;
  homeWinProb /= totalProb;
  drawProb /= totalProb;
  awayWinProb /= totalProb;

  return {
    homeWin: homeWinProb,
    draw: drawProb,
    awayWin: awayWinProb,
    expectedHomeGoals: Math.min(homeExpectedGoals, 3.5), // Limita gols esperados
    expectedAwayGoals: Math.min(awayExpectedGoals, 3.0)  // Limita gols esperados
  };
}

/**
 * Simula o resultado de uma partida entre dois times usando estatísticas avançadas
 * @param match Partida a ser simulada
 * @param teams Lista de times
 * @returns Partida com o resultado simulado
 */
export function simulateMatch(
  match: Match,
  params: SimulationParams,
  allMatches: Match[],
  seasonData: SeasonData
): Match {
  const homeTeamStats = seasonData.teams.find(t => t.name === match.homeTeam);
  const awayTeamStats = seasonData.teams.find(t => t.name === match.awayTeam);

  if (!homeTeamStats || !awayTeamStats) {
    throw new Error('Dados históricos dos times não encontrados');
  }

  const probabilities = calculateMatchProbabilities(homeTeamStats, awayTeamStats, seasonData);
  const random = Math.random();

  let homeGoals = 0;
  let awayGoals = 0;

  if (random < probabilities.homeWin) {
    // Vitória do mandante
    homeGoals = Math.max(1, Math.round(probabilities.expectedHomeGoals * (0.8 + Math.random() * 0.4)));
    awayGoals = Math.round(probabilities.expectedAwayGoals * 0.7 * Math.random());
  } else if (random < probabilities.homeWin + probabilities.draw) {
    // Empate
    const avgGoals = (probabilities.expectedHomeGoals + probabilities.expectedAwayGoals) / 2.5;
    homeGoals = Math.round(avgGoals);
    awayGoals = homeGoals;
  } else {
    // Vitória do visitante
    awayGoals = Math.max(1, Math.round(probabilities.expectedAwayGoals * (0.8 + Math.random() * 0.4)));
    homeGoals = Math.round(probabilities.expectedHomeGoals * 0.7 * Math.random());
  }

  // Ajuste mais suave baseado na diferença de pontos
  const strengthDiff = Math.min(0.3, Math.abs(homeTeamStats.points - awayTeamStats.points) / 30);
  if (homeTeamStats.points > awayTeamStats.points) {
    homeGoals = Math.max(0, Math.round(homeGoals * (1 + strengthDiff * 0.2)));
  } else {
    awayGoals = Math.max(0, Math.round(awayGoals * (1 + strengthDiff * 0.2)));
  }

  // Limita o número máximo de gols
  homeGoals = Math.min(homeGoals, 5);
  awayGoals = Math.min(awayGoals, 5);

  return {
    homeTeam: match.homeTeam,
    awayTeam: match.awayTeam,
    homeGoals,
    awayGoals,
    date: match.date
  };
}

function calculateTeamStats(matches: Match[], teamName: string): Team {
  const homeMatches = matches.filter(m => m.homeTeam === teamName);
  const awayMatches = matches.filter(m => m.awayTeam === teamName);
  
  const points = homeMatches.reduce((acc, m) => {
    if (m.homeGoals > m.awayGoals) return acc + 3;
    if (m.homeGoals === m.awayGoals) return acc + 1;
    return acc;
  }, 0) + awayMatches.reduce((acc, m) => {
    if (m.awayGoals > m.homeGoals) return acc + 3;
    if (m.homeGoals === m.awayGoals) return acc + 1;
    return acc;
  }, 0);

  const goalsFor = homeMatches.reduce((acc, m) => acc + m.homeGoals, 0) +
    awayMatches.reduce((acc, m) => acc + m.awayGoals, 0);
  
  const goalsAgainst = homeMatches.reduce((acc, m) => acc + m.awayGoals, 0) +
    awayMatches.reduce((acc, m) => acc + m.homeGoals, 0);

  return {
    name: teamName,
    homeGames: homeMatches,
    awayGames: awayMatches,
    position: 0, // Será calculado depois
    points,
    goalsFor,
    goalsAgainst
  };
}

function sortTeams(teams: Team[]): Team[] {
  return [...teams].sort((a, b) => {
    if (a.points !== b.points) return b.points - a.points;
    const aGD = a.goalsFor - a.goalsAgainst;
    const bGD = b.goalsFor - b.goalsAgainst;
    if (aGD !== bGD) return bGD - aGD;
    return b.goalsFor - a.goalsFor;
  });
}

interface PointsRange {
  points: number;
  teams: string[];
}

export function runSimulation(
  matches: Match[],
  params: SimulationParams
): SimulationResult {
  const teamPositions: TeamPosition[] = [];
  const teamPoints: Record<string, number[]> = {};
  const teamPositionsHistory: Record<string, number[]> = {};

  // Extrai os dados da temporada atual
  const currentSeasonData = params.seasonData['2024'];
  if (!currentSeasonData) {
    throw new Error('Dados da temporada atual não encontrados');
  }

  // Inicializa os pontos e posições para cada time
  currentSeasonData.teams.forEach(team => {
    teamPoints[team.name] = [];
    teamPositionsHistory[team.name] = [];
  });

  // Executa as simulações
  for (let i = 0; i < params.numberOfSimulations; i++) {
    const simulatedMatches = matches.map(match => 
      simulateMatch(match, params, matches, currentSeasonData)
    );

    // Calcula pontos para cada time nesta simulação
    const simulationTeams = currentSeasonData.teams.map(team => {
      const teamMatches = simulatedMatches.filter(
        m => m.homeTeam === team.name || m.awayTeam === team.name
      );

      let points = 0;
      let goalsFor = 0;
      let goalsAgainst = 0;

      teamMatches.forEach(match => {
        if (match.homeTeam === team.name) {
          if (match.homeGoals > match.awayGoals) points += 3;
          else if (match.homeGoals === match.awayGoals) points += 1;
          goalsFor += match.homeGoals;
          goalsAgainst += match.awayGoals;
        } else {
          if (match.awayGoals > match.homeGoals) points += 3;
          else if (match.homeGoals === match.awayGoals) points += 1;
          goalsFor += match.awayGoals;
          goalsAgainst += match.homeGoals;
        }
      });

      return {
        ...team,
        points,
        goalsFor,
        goalsAgainst
      };
    });

    // Ordena times por pontos e critérios de desempate
    const sortedTeams = sortTeams(simulationTeams);

    // Atualiza posições e pontos
    sortedTeams.forEach((team, index) => {
      teamPoints[team.name].push(team.points);
      teamPositionsHistory[team.name].push(index + 1);
    });
  }

  // Calcula estatísticas finais para cada time
  currentSeasonData.teams.forEach(team => {
    const positions = teamPositionsHistory[team.name];
    const points = teamPoints[team.name];

    teamPositions.push({
      team: team.name,
      avgPosition: mean(positions),
      bestPosition: Math.min(...positions),
      worstPosition: Math.max(...positions),
      mostLikelyPosition: mode(positions),
      pointsRange: {
        min: Math.min(...points),
        max: Math.max(...points),
        avg: mean(points)
      }
    });
  });

  return {
    teamPositions: teamPositions.sort((a, b) => a.avgPosition - b.avgPosition),
    simulationCount: params.numberOfSimulations
  };
} 