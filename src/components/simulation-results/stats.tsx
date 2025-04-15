'use client';

import { Card } from "@/components/ui/card";
import { SimulationResult } from "./index";

export function SimulationStats({ results }: { results: SimulationResult }) {
  // Calcular algumas estatísticas básicas
  const totalTeams = results.teamPositions.length;
  const averagePoints = results.teamPositions.reduce(
    (acc, team) => acc + team.pointsRange.avg,
    0
  ) / totalTeams;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card className="p-4">
        <h3 className="text-sm font-medium text-muted-foreground">Total de Times</h3>
        <p className="text-2xl font-bold">{totalTeams}</p>
      </Card>
      
      <Card className="p-4">
        <h3 className="text-sm font-medium text-muted-foreground">Média de Pontos</h3>
        <p className="text-2xl font-bold">{averagePoints.toFixed(1)}</p>
      </Card>
      
      <Card className="p-4">
        <h3 className="text-sm font-medium text-muted-foreground">Total de Simulações</h3>
        <p className="text-2xl font-bold">{results.simulationCount}</p>
      </Card>
    </div>
  );
} 