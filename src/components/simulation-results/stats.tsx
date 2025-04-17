'use client';

import { Card } from "@/components/ui/card";
import { SimulationResult } from "./index";

export function SimulationStats({ results }: { results: SimulationResult }) {
  // Calcular estatísticas básicas
  const totalTeams = results.teamPositions.length;
  const averagePoints = results.teamPositions.reduce(
    (acc, team) => acc + team.pointsRange.avg,
    0
  ) / totalTeams;

  // Calcular estatísticas de posição usando a posição mais provável
  const positionStats = {
    libertadores: results.teamPositions.filter(
      team => team.mostLikelyPosition <= 6
    ).length,
    sulamericana: results.teamPositions.filter(
      team => team.mostLikelyPosition >= 7 && team.mostLikelyPosition <= 12
    ).length,
    meioTabela: results.teamPositions.filter(
      team => team.mostLikelyPosition >= 13 && team.mostLikelyPosition <= 16
    ).length,
    rebaixamento: results.teamPositions.filter(
      team => team.mostLikelyPosition >= 17
    ).length
  };

  // Calcular variabilidade
  const avgPositionRange = results.teamPositions.reduce(
    (acc, team) => acc + (team.worstPosition - team.bestPosition),
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

      <Card className="p-4">
        <h3 className="text-sm font-medium text-muted-foreground">Times com Maior Chance de Libertadores (1-6)</h3>
        <p className="text-2xl font-bold">{positionStats.libertadores}</p>
      </Card>

      <Card className="p-4">
        <h3 className="text-sm font-medium text-muted-foreground">Times com Maior Chance de Sul-Americana (7-12)</h3>
        <p className="text-2xl font-bold">{positionStats.sulamericana}</p>
      </Card>

      <Card className="p-4">
        <h3 className="text-sm font-medium text-muted-foreground">Times com Maior Chance no Meio da Tabela (13-16)</h3>
        <p className="text-2xl font-bold">{positionStats.meioTabela}</p>
      </Card>

      <Card className="p-4">
        <h3 className="text-sm font-medium text-muted-foreground">Times com Maior Chance de Rebaixamento (17-20)</h3>
        <p className="text-2xl font-bold">{positionStats.rebaixamento}</p>
      </Card>

      <Card className="p-4">
        <h3 className="text-sm font-medium text-muted-foreground">Variabilidade Média</h3>
        <p className="text-2xl font-bold">{avgPositionRange.toFixed(1)} posições</p>
      </Card>
    </div>
  );
} 