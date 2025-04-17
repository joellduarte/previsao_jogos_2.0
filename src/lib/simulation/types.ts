/** 
 * Representa uma partida entre dois times
 */
export interface Match {
  homeTeam: string;
  awayTeam: string;
  homeGoals: number;
  awayGoals: number;
  date: string;
}

/**
 * Representa um time com suas estatísticas
 */
export interface Team {
  name: string;
  homeGames: Match[];
  awayGames: Match[];
  position: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
}

export interface SeasonData {
  teams: Team[];
  matches: Match[];
}

export interface SimulationParams {
  /** Número de simulações a serem executadas */
  numberOfSimulations: number;
  /** Fator de aleatoriedade (0-1) */
  randomnessFactor: number;
  /** Peso do desempenho recente (0-1) */
  recentFormWeight: number;
  /** Peso do desempenho em casa/fora (0-1) */
  homeAwayWeight: number;
  /** Nível de confiança para intervalos (0-1) */
  confidenceLevel: number;
  /** Dados das temporadas */
  seasonData: {
    [season: string]: SeasonData;
  };
}

export interface PointsRange {
  points: number;
  teams: string[];
}

export interface TeamPosition {
  team: string;
  avgPosition: number;
  bestPosition: number;
  worstPosition: number;
  mostLikelyPosition: number;
  pointsRange: {
    min: number;
    max: number;
    avg: number;
  };
  positionProbabilities: {
    position: number;
    probability: number;
  }[];
}

export interface SimulationResult {
  teamPositions: TeamPosition[];
  simulationCount: number;
}

export interface TeamStats {
  name: string;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  recentForm: number[];
} 