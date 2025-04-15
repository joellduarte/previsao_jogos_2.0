import { calculateAggregatedStats } from '../stats';
import type { ProcessedTeamData } from '../types';

describe('Stats Calculator', () => {
  const mockTeamData: ProcessedTeamData = {
    name: 'Test Team',
    seasons: {
      '2023': {
        position: 1,
        points: 70,
        goalsFor: 50,
        goalsAgainst: 20,
        goalsDiff: 30,
        homeGames: [
          {
            date: new Date('2023-01-01'),
            opponent: 'Team A',
            goalsScored: 2,
            goalsConceded: 1,
            isHome: true,
            points: 3
          }
        ],
        awayGames: [
          {
            date: new Date('2023-01-08'),
            opponent: 'Team B',
            goalsScored: 1,
            goalsConceded: 1,
            isHome: false,
            points: 1
          }
        ],
        homeStats: {
          gamesPlayed: 1,
          wins: 1,
          draws: 0,
          losses: 0,
          goalsScored: 2,
          goalsConceded: 1,
          points: 3,
          averageGoalsScored: 2,
          averageGoalsConceded: 1,
          winRate: 1,
          drawRate: 0,
          lossRate: 0
        },
        awayStats: {
          gamesPlayed: 1,
          wins: 0,
          draws: 1,
          losses: 0,
          goalsScored: 1,
          goalsConceded: 1,
          points: 1,
          averageGoalsScored: 1,
          averageGoalsConceded: 1,
          winRate: 0,
          drawRate: 1,
          lossRate: 0
        }
      },
      '2022': {
        position: 2,
        points: 68,
        goalsFor: 45,
        goalsAgainst: 25,
        goalsDiff: 20,
        homeGames: [],
        awayGames: [],
        homeStats: {
          gamesPlayed: 19,
          wins: 10,
          draws: 5,
          losses: 4,
          goalsScored: 30,
          goalsConceded: 15,
          points: 35,
          averageGoalsScored: 1.58,
          averageGoalsConceded: 0.79,
          winRate: 0.53,
          drawRate: 0.26,
          lossRate: 0.21
        },
        awayStats: {
          gamesPlayed: 19,
          wins: 9,
          draws: 6,
          losses: 4,
          goalsScored: 25,
          goalsConceded: 20,
          points: 33,
          averageGoalsScored: 1.32,
          averageGoalsConceded: 1.05,
          winRate: 0.47,
          drawRate: 0.32,
          lossRate: 0.21
        }
      }
    }
  };

  describe('calculateAggregatedStats', () => {
    it('should calculate aggregated stats correctly', () => {
      const stats = calculateAggregatedStats(mockTeamData, '2023');

      // Verificar estatísticas básicas
      expect(stats.gamesPlayed).toBe(2);
      expect(stats.wins).toBe(1);
      expect(stats.draws).toBe(1);
      expect(stats.losses).toBe(0);
      expect(stats.points).toBe(4);

      // Verificar médias
      expect(stats.averageGoalsScored).toBeCloseTo(1.5, 2);
      expect(stats.averageGoalsConceded).toBeCloseTo(1.0, 2);

      // Verificar taxas
      expect(stats.winRate).toBeCloseTo(0.5, 2);
      expect(stats.drawRate).toBeCloseTo(0.5, 2);
      expect(stats.lossRate).toBeCloseTo(0, 2);

      // Verificar métricas agregadas
      expect(stats.homeAdvantage).toBeDefined();
      expect(stats.consistencyScore).toBeDefined();
      expect(stats.formScore).toBeDefined();
      expect(stats.seasonProgress).toBeDefined();

      // Verificar limites
      expect(stats.consistencyScore).toBeGreaterThanOrEqual(0);
      expect(stats.consistencyScore).toBeLessThanOrEqual(1);
      expect(stats.formScore).toBeGreaterThanOrEqual(0);
      expect(stats.formScore).toBeLessThanOrEqual(1);
      expect(stats.seasonProgress).toBeGreaterThanOrEqual(0);
      expect(stats.seasonProgress).toBeLessThanOrEqual(1);
    });

    it('should throw error for invalid season', () => {
      expect(() => {
        calculateAggregatedStats(mockTeamData, '2024');
      }).toThrow();
    });
  });
}); 