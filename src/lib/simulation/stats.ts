import { Match, Team } from './types';

/**
 * Calcula o desempenho em casa de um time
 */
export function calculateHomePerformance(team: Team): number {
  const homeGames = team.homeGames;
  if (homeGames.length === 0) return 0.5;

  const wins = homeGames.filter(m => m.homeGoals > m.awayGoals).length;
  const draws = homeGames.filter(m => m.homeGoals === m.awayGoals).length;
  
  return (wins * 3 + draws) / (homeGames.length * 3);
}

/**
 * Calcula o desempenho fora de casa de um time
 */
export function calculateAwayPerformance(team: Team): number {
  const awayGames = team.awayGames;
  if (awayGames.length === 0) return 0.5;

  const wins = awayGames.filter(m => m.awayGoals > m.homeGoals).length;
  const draws = awayGames.filter(m => m.homeGoals === m.awayGoals).length;
  
  return (wins * 3 + draws) / (awayGames.length * 3);
}

/**
 * Calcula a média de gols marcados em casa
 */
export function calculateHomeGoalsScored(team: Team): number {
  const homeGames = team.homeGames;
  if (homeGames.length === 0) return team.goalsFor / (team.homeGames.length + team.awayGames.length);
  
  return homeGames.reduce((sum, match) => sum + match.homeGoals, 0) / homeGames.length;
}

/**
 * Calcula a média de gols sofridos em casa
 */
export function calculateHomeGoalsConceded(team: Team): number {
  const homeGames = team.homeGames;
  if (homeGames.length === 0) return team.goalsAgainst / (team.homeGames.length + team.awayGames.length);
  
  return homeGames.reduce((sum, match) => sum + match.awayGoals, 0) / homeGames.length;
}

/**
 * Calcula a média de gols marcados fora
 */
export function calculateAwayGoalsScored(team: Team): number {
  const awayGames = team.awayGames;
  if (awayGames.length === 0) return team.goalsFor / (team.homeGames.length + team.awayGames.length);
  
  return awayGames.reduce((sum, match) => sum + match.awayGoals, 0) / awayGames.length;
}

/**
 * Calcula a média de gols sofridos fora
 */
export function calculateAwayGoalsConceded(team: Team): number {
  const awayGames = team.awayGames;
  if (awayGames.length === 0) return team.goalsAgainst / (team.homeGames.length + team.awayGames.length);
  
  return awayGames.reduce((sum, match) => sum + match.homeGoals, 0) / awayGames.length;
}

/**
 * Calcula a forma recente do time (últimos 5 jogos)
 */
export function calculateRecentForm(team: Team): number {
  const allGames = [...team.homeGames, ...team.awayGames]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  if (allGames.length === 0) return 0.5;

  let points = 0;
  allGames.forEach(match => {
    if (match.homeTeam === team.name) {
      if (match.homeGoals > match.awayGoals) points += 3;
      else if (match.homeGoals === match.awayGoals) points += 1;
    } else {
      if (match.awayGoals > match.homeGoals) points += 3;
      else if (match.homeGoals === match.awayGoals) points += 1;
    }
  });

  return points / (allGames.length * 3);
}

/**
 * Calcula o fator de consistência do time
 * (variação nos resultados recentes)
 */
export function calculateConsistency(team: Team): number {
  const allGames = [...team.homeGames, ...team.awayGames]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  if (allGames.length < 5) return 0.5;

  const results = allGames.map(match => {
    if (match.homeTeam === team.name) {
      return match.homeGoals - match.awayGoals;
    } else {
      return match.awayGoals - match.homeGoals;
    }
  });

  // Calcula o desvio padrão dos resultados
  const mean = results.reduce((a, b) => a + b, 0) / results.length;
  const variance = results.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / results.length;
  const stdDev = Math.sqrt(variance);

  // Normaliza para um valor entre 0 e 1 (quanto menor o desvio, mais consistente)
  return Math.max(0, Math.min(1, 1 - (stdDev / 3)));
} 