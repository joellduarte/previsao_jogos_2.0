export interface SimulationConfig {
  numberOfSimulations: number;
  confidenceLevel: number;
}

export const DEFAULT_CONFIG: SimulationConfig = {
  numberOfSimulations: 1000,
  confidenceLevel: 95
};

export const SIMULATION_LIMITS = {
  min: 100,
  max: 10000,
  step: 100
} as const;

export const CONFIDENCE_LEVELS = [90, 95, 99] as const; 