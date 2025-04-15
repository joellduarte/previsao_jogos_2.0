'use client';

import { Card } from "@/components/ui/card";
import { SimulationTable } from "./table";
import { SimulationStats } from "./stats";

export interface SimulationResult {
  teamPositions: {
    team: string;
    avgPosition: number;
    bestPosition: number;
    worstPosition: number;
    mostLikelyPosition: number;
    pointsRange: {min: number; max: number; avg: number};
  }[];
  simulationCount: number;
}

export function SimulationResults({ results }: { results: SimulationResult }) {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Resultados da Simulação</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Baseado em {results.simulationCount} simulações
        </p>
        <SimulationTable results={results} />
      </Card>
      
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Estatísticas</h2>
        <SimulationStats results={results} />
      </Card>
    </div>
  );
} 