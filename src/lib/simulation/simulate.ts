import { SimulationConfig } from "@/components/simulation-form/config";
import { SimulationResult, TeamPosition, TeamStats } from "./types";

interface PositionStats {
  avgPosition: number;
  stdDeviation: number;
  positionCounts: { [position: number]: number };
}

function calculatePositionProbabilities(
  positionStats: PositionStats,
  simulationCount: number
): { position: number; probability: number }[] {
  const probabilities: { position: number; probability: number }[] = [];
  
  for (let position = 1; position <= 20; position++) {
    const count = positionStats.positionCounts[position] || 0;
    const probability = (count / simulationCount) * 100;
    probabilities.push({ position, probability });
  }
  
  return probabilities;
}

export function simulateMatches(
  teams: TeamStats[],
  config: SimulationConfig
): SimulationResult {
  const positionStats: { [teamName: string]: PositionStats } = {};
  const simulationResults: TeamPosition[] = [];

  // Initialize position stats for each team
  teams.forEach((team) => {
    positionStats[team.name] = {
      avgPosition: 0,
      stdDeviation: 0,
      positionCounts: {}
    };
  });

  // Run simulations
  for (let i = 0; i < config.numberOfSimulations; i++) {
    const simulatedPositions = simulateOneMatch(teams, config);
    
    // Update position counts for each team
    simulatedPositions.forEach((position, index) => {
      const teamName = teams[index].name;
      const stats = positionStats[teamName];
      const currentPosition = position + 1;
      
      stats.positionCounts[currentPosition] = (stats.positionCounts[currentPosition] || 0) + 1;
    });
  }

  // Calculate final statistics for each team
  teams.forEach((team) => {
    const stats = positionStats[team.name];
    
    // Calculate average position
    const totalPositions = Object.entries(stats.positionCounts).reduce<number>(
      (sum, [position, count]) => sum + (parseInt(position) * count),
      0
    );
    stats.avgPosition = totalPositions / config.numberOfSimulations;

    // Calculate standard deviation
    const squaredDiffs = Object.entries(stats.positionCounts).reduce<number>(
      (sum, [position, count]) => {
        const diff = parseInt(position) - stats.avgPosition;
        return sum + (diff * diff * count);
      },
      0
    );
    stats.stdDeviation = Math.sqrt(squaredDiffs / config.numberOfSimulations);

    // Add to final results
    simulationResults.push({
      team: team.name,
      avgPosition: stats.avgPosition,
      stdDeviation: stats.stdDeviation,
      positionProbabilities: calculatePositionProbabilities(stats, config.numberOfSimulations)
    });
  });

  return {
    teamPositions: simulationResults,
    simulationCount: config.numberOfSimulations
  };
}

function simulateOneMatch(
  teams: TeamStats[],
  config: SimulationConfig
): number[] {
  const positions = teams.map((team, index) => {
    const homeFormFactor = team.recentForm.reduce<number>(
      (sum, form) => sum + form,
      0
    ) * config.recentFormWeight;

    const awayFormFactor = team.recentForm.reduce<number>(
      (sum, form) => sum + form,
      0
    ) * config.homeAwayWeight;

    const randomFactor = Math.random() * config.randomnessFactor;

    return {
      index,
      score: team.points + homeFormFactor + awayFormFactor + randomFactor
    };
  });

  // Sort by score descending
  positions.sort((a, b) => b.score - a.score);
  
  // Return array of indices representing final positions
  const finalPositions = new Array(teams.length).fill(0);
  positions.forEach((pos, index) => {
    finalPositions[pos.index] = index;
  });

  return finalPositions;
}