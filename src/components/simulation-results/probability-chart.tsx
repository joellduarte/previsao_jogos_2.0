'use client';

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { SimulationResult } from "./index";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PositionProbability {
  position: number;
  probability: number;
}

export function ProbabilityChart({ results }: { results: SimulationResult }) {
  // Ordena os times alfabeticamente
  const sortedTeams = [...results.teamPositions].sort((a, b) => a.team.localeCompare(b.team));
  const [selectedTeam, setSelectedTeam] = useState(sortedTeams[0]?.team || '');

  // Função para determinar a cor da barra baseada na posição
  const getBarColor = (position: number): string => {
    if (position <= 6) return '#22c55e'; // Verde para Libertadores
    if (position <= 12) return '#3b82f6'; // Azul para Sul-Americana
    if (position >= 17) return '#ef4444'; // Vermelho para Rebaixamento
    return '#94a3b8'; // Cinza para Meio da tabela
  };

  // Calcula as probabilidades de posição para o time selecionado
  const calculateProbabilities = (teamName: string): PositionProbability[] => {
    const team = results.teamPositions.find(t => t.team === teamName);
    if (!team) return [];

    // Inicializa o contador de posições
    const positionCounts = new Map<number, number>();
    for (let i = 1; i <= 20; i++) {
      positionCounts.set(i, 0);
    }

    // Calcula a probabilidade de cada posição
    const probabilities: PositionProbability[] = [];
    for (let i = 1; i <= 20; i++) {
      // Usa a posição média como base para a distribuição normal
      const mean = team.avgPosition;
      const stdDev = (team.worstPosition - team.bestPosition) / 4; // Aproximação do desvio padrão
      
      // Calcula a probabilidade usando a distribuição normal
      const probability = calculateNormalProbability(i, mean, stdDev);
      
      probabilities.push({
        position: i,
        probability: probability * 100 // Converte para porcentagem
      });
    }

    return probabilities;
  };

  // Função para calcular a probabilidade usando a distribuição normal
  const calculateNormalProbability = (x: number, mean: number, stdDev: number): number => {
    const exponent = -Math.pow(x - mean, 2) / (2 * Math.pow(stdDev, 2));
    return (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
  };

  const selectedTeamData = calculateProbabilities(selectedTeam);

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Probabilidades de Posição</h3>
        <Select value={selectedTeam} onValueChange={setSelectedTeam}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Selecione um time" />
          </SelectTrigger>
          <SelectContent>
            {sortedTeams.map(team => (
              <SelectItem key={team.team} value={team.team}>
                {team.team}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={selectedTeamData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="position" 
              label={{ value: 'Posição', position: 'insideBottom', offset: -5 }} 
            />
            <YAxis 
              label={{ value: 'Probabilidade (%)', angle: -90, position: 'insideLeft' }} 
            />
            <Tooltip 
              formatter={(value: number) => [`${value.toFixed(2)}%`, 'Probabilidade']}
              labelFormatter={(label) => `Posição ${label}`}
            />
            <Bar dataKey="probability" name="Probabilidade">
              {selectedTeamData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.position)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap gap-4 text-sm mt-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500"></div>
          <span>Libertadores (1-6)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500"></div>
          <span>Sul-Americana (7-12)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-slate-500"></div>
          <span>Meio da tabela (13-16)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500"></div>
          <span>Rebaixamento (17-20)</span>
        </div>
      </div>
    </Card>
  );
} 