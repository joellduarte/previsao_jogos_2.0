import { loadHistoricalData, loadCurrentSeasonData } from '../csv-loader';

describe('CSV Loader', () => {
  describe('loadHistoricalData', () => {
    it('should load and process historical data correctly', async () => {
      const data = await loadHistoricalData();
      
      // Verificar se retornou um array
      expect(Array.isArray(data)).toBe(true);
      
      // Verificar se tem dados
      expect(data.length).toBeGreaterThan(0);
      
      // Verificar estrutura dos dados
      const firstTeam = data[0];
      expect(firstTeam).toHaveProperty('name');
      expect(firstTeam).toHaveProperty('seasons');
      
      // Verificar dados de uma temporada
      const firstSeason = Object.values(firstTeam.seasons)[0];
      expect(firstSeason).toHaveProperty('position');
      expect(firstSeason).toHaveProperty('points');
      expect(firstSeason).toHaveProperty('homeGames');
      expect(firstSeason).toHaveProperty('awayGames');
      expect(firstSeason).toHaveProperty('homeStats');
      expect(firstSeason).toHaveProperty('awayStats');
      
      // Verificar estatísticas
      const { homeStats, awayStats } = firstSeason;
      expect(homeStats.gamesPlayed).toBeGreaterThanOrEqual(0);
      expect(homeStats.points).toBeGreaterThanOrEqual(0);
      expect(awayStats.gamesPlayed).toBeGreaterThanOrEqual(0);
      expect(awayStats.points).toBeGreaterThanOrEqual(0);
    });
  });
  
  describe('loadCurrentSeasonData', () => {
    it('should load current season data correctly', async () => {
      const { standings, fixtures } = await loadCurrentSeasonData();
      
      // Verificar classificação
      expect(Array.isArray(standings)).toBe(true);
      expect(standings.length).toBeGreaterThan(0);
      
      const firstStanding = standings[0];
      expect(firstStanding).toHaveProperty('position');
      expect(firstStanding).toHaveProperty('team');
      expect(firstStanding).toHaveProperty('points');
      expect(firstStanding.position).toBe(1); // Primeiro colocado
      
      // Verificar jogos
      expect(Array.isArray(fixtures)).toBe(true);
      expect(fixtures.length).toBeGreaterThan(0);
      
      const firstFixture = fixtures[0];
      expect(firstFixture).toHaveProperty('home_team');
      expect(firstFixture).toHaveProperty('away_team');
      expect(firstFixture).toHaveProperty('home_goals');
      expect(firstFixture).toHaveProperty('away_goals');
      expect(firstFixture).toHaveProperty('date');
      expect(firstFixture).toHaveProperty('season');
    });
  });
}); 