export interface SimulationConfig {
  numberOfSimulations: number;
  confidenceLevel: number;
  recentFormWeight: number;
  homeAwayWeight: number;
  randomnessFactor: number;
}

export const DEFAULT_CONFIG: SimulationConfig = {
  numberOfSimulations: 1000,
  confidenceLevel: 0.95,
  recentFormWeight: 0.3,
  homeAwayWeight: 0.2,
  randomnessFactor: 0.5
};

export const SIMULATION_LIMITS = {
  min: 100,
  max: 10000,
  step: 100
} as const;

export const CONFIDENCE_LEVELS = [90, 95, 99] as const; 