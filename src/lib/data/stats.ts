import type { ProcessedTeamData, TeamStats, ProcessedMatchData } from './types';

export interface AggregatedTeamStats extends TeamStats {
  homeAdvantage: number; // Diferença entre desempenho em casa e fora
  consistencyScore: number; // 0-1, quanto maior, mais consistente
  formScore: number; // 0-1, baseado nos últimos jogos
  seasonProgress: number; // 0-1, progresso na temporada
}

export function calculateAggregatedStats(
  teamData: ProcessedTeamData,
  currentSeason: string,
  lastNGames = 5
): AggregatedTeamStats {
  const seasons = Object.keys(teamData.seasons).sort();
  const currentSeasonData = teamData.seasons[currentSeason];
  
  if (!currentSeasonData) {
    throw new Error(`Dados da temporada ${currentSeason} não encontrados para ${teamData.name}`);
  }

  // Calcular média histórica
  const historicalSeasons = seasons.filter(s => s !== currentSeason);
  const historicalStats = historicalSeasons.map(season => {
    const { homeStats, awayStats } = teamData.seasons[season];
    return {
      homeStats,
      awayStats,
      totalPoints: homeStats.points + awayStats.points,
      totalGames: homeStats.gamesPlayed + awayStats.gamesPlayed
    };
  });

  // Média de pontos por jogo histórica
  const avgPointsPerGame = historicalStats.reduce(
    (sum, stats) => sum + (stats.totalPoints / stats.totalGames), 
    0
  ) / historicalStats.length;

  // Vantagem de jogar em casa
  const homeAdvantage = historicalStats.reduce((sum, stats) => {
    const homePointsPerGame = stats.homeStats.points / stats.homeStats.gamesPlayed;
    const awayPointsPerGame = stats.awayStats.points / stats.awayStats.gamesPlayed;
    return sum + (homePointsPerGame - awayPointsPerGame);
  }, 0) / historicalStats.length;

  // Consistência (desvio padrão dos pontos por jogo)
  const pointsPerGame = historicalStats.map(stats => 
    stats.totalPoints / stats.totalGames
  );
  const meanPointsPerGame = pointsPerGame.reduce((a, b) => a + b) / pointsPerGame.length;
  const variance = pointsPerGame.reduce(
    (sum, ppg) => sum + Math.pow(ppg - meanPointsPerGame, 2), 
    0
  ) / pointsPerGame.length;
  const consistencyScore = 1 / (1 + Math.sqrt(variance));

  // Forma atual (últimos N jogos)
  const allGames = [
    ...currentSeasonData.homeGames.map(g => ({ ...g, weight: 1.1 })), // Peso maior para jogos em casa
    ...currentSeasonData.awayGames.map(g => ({ ...g, weight: 0.9 }))
  ].sort((a, b) => b.date.getTime() - a.date.getTime());

  const recentGames = allGames.slice(0, lastNGames);
  const formScore = recentGames.reduce(
    (sum, game) => sum + (game.points / 3) * game.weight, 
    0
  ) / (recentGames.length * 1.1); // Normalizado pelo peso máximo

  // Progresso na temporada
  const totalGamesExpected = 38; // Brasileirão tem 38 rodadas
  const gamesPlayed = currentSeasonData.homeStats.gamesPlayed + 
                     currentSeasonData.awayStats.gamesPlayed;
  const seasonProgress = gamesPlayed / totalGamesExpected;

  // Combinar estatísticas atuais
  const { homeStats, awayStats } = currentSeasonData;
  const totalGamesPlayed = homeStats.gamesPlayed + awayStats.gamesPlayed;

  return {
    gamesPlayed: totalGamesPlayed,
    wins: homeStats.wins + awayStats.wins,
    draws: homeStats.draws + awayStats.draws,
    losses: homeStats.losses + awayStats.losses,
    goalsScored: homeStats.goalsScored + awayStats.goalsScored,
    goalsConceded: homeStats.goalsConceded + awayStats.goalsConceded,
    points: homeStats.points + awayStats.points,
    averageGoalsScored: (homeStats.goalsScored + awayStats.goalsScored) / totalGamesPlayed,
    averageGoalsConceded: (homeStats.goalsConceded + awayStats.goalsConceded) / totalGamesPlayed,
    winRate: (homeStats.wins + awayStats.wins) / totalGamesPlayed,
    drawRate: (homeStats.draws + awayStats.draws) / totalGamesPlayed,
    lossRate: (homeStats.losses + awayStats.losses) / totalGamesPlayed,
    homeAdvantage,
    consistencyScore,
    formScore,
    seasonProgress
  };
} 