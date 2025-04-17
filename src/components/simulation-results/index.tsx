'use client';

import { Card } from "@/components/ui/card";
import { SimulationTable } from "./table";
import { SimulationStats } from "./stats";
import { ProbabilityChart } from "./probability-chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface SimulationResult {
  teamPositions: {
    team: string;
    avgPosition: number;
    bestPosition: number;
    worstPosition: number;
    mostLikelyPosition: number;
    pointsRange: {min: number; max: number; avg: number};
    positionProbabilities: {position: number; probability: number}[];
  }[];
  simulationCount: number;
}

export function SimulationResults({ results }: { results: SimulationResult }) {
  return (
    <div className="space-y-4 sm:space-y-6 w-full">
      <Card className="p-3 sm:p-4 md:p-6 overflow-x-auto">
        <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">Resultados da Simulação</h2>
        <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
          Baseado em {results.simulationCount} simulações
        </p>
        <div className="min-w-[640px] lg:min-w-0">
          <SimulationTable results={results} />
        </div>
      </Card>
      
      <Tabs defaultValue="stats" className="space-y-3 sm:space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="stats">Estatísticas</TabsTrigger>
          <TabsTrigger value="probabilities">Probabilidades</TabsTrigger>
        </TabsList>
        
        <TabsContent value="stats">
          <Card className="p-3 sm:p-4 md:p-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">Estatísticas</h2>
            <SimulationStats results={results} />
          </Card>
        </TabsContent>
        
        <TabsContent value="probabilities">
          <Card className="p-3 sm:p-4 md:p-6 overflow-x-auto">
            <div className="min-w-[640px] lg:min-w-0">
              <ProbabilityChart results={results} />
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 