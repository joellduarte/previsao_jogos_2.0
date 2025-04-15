export interface SeasonStats {
  gamesPlayed: number;
  goalsScored: number;
  goalsConceded: number;
  formScore: number; // 0-1, representa o desempenho recente
  homeAdvantage: number; // 0-1, representa o fator casa
  consistencyScore: number; // 0-1, representa a consistência do time
}

export interface TeamStats {
  id: string;
  name: string;
  seasons: {
    [season: string]: SeasonStats;
  };
} 