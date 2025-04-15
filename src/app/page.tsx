'use client';

import { useState } from 'react';
import { SimulationForm } from '@/components/simulation-form';
import { SimulationResults } from '@/components/simulation-results';
import type { SimulationConfig } from '@/components/simulation-form/config';
import type { SimulationResult } from '@/components/simulation-results';
import { runSimulation } from '@/lib/simulation/engine';
import { loadHistoricalData, loadCurrentSeasonData } from '@/lib/data/csv-loader';
import { calculateAggregatedStats } from '@/lib/data/stats';
import type { Match, Team } from '@/lib/simulation/types';

export default function Home() {
  const [results, setResults] = useState<SimulationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSimulation, setCurrentSimulation] = useState<SimulationConfig | null>(null);

  const handleSimulation = async (config: SimulationConfig) => {
    setIsLoading(true);
    setError(null);
    setCurrentSimulation(config);
    
    try {
      console.log('Iniciando carregamento dos dados...');
      console.log('Configuração:', config);
      
      // Carrega os dados
      const historicalData = await loadHistoricalData();
      console.log('Dados históricos carregados:', historicalData);
      
      const { standings, fixtures } = await loadCurrentSeasonData();
      console.log('Dados atuais carregados:', { standings, fixtures });

      // Converte os dados para o formato correto
      const teams: Team[] = standings.map(standing => ({
        name: standing.team,
        homeGames: fixtures
          .filter(f => f.home_team === standing.team)
          .map(f => ({
            homeTeam: f.home_team,
            awayTeam: f.away_team,
            homeGoals: f.home_goals,
            awayGoals: f.away_goals,
            date: f.date
          })),
        awayGames: fixtures
          .filter(f => f.away_team === standing.team)
          .map(f => ({
            homeTeam: f.home_team,
            awayTeam: f.away_team,
            homeGoals: f.home_goals,
            awayGoals: f.away_goals,
            date: f.date
          })),
        position: standing.position,
        points: standing.points,
        goalsFor: standing.goals_for,
        goalsAgainst: standing.goals_against
      }));

      const matches: Match[] = fixtures.map(f => ({
        homeTeam: f.home_team,
        awayTeam: f.away_team,
        homeGoals: f.home_goals,
        awayGoals: f.away_goals,
        date: f.date
      }));

      console.log('Dados convertidos:', { teams, matches });

      // Configura os parâmetros da simulação
      const simulationParams = {
        numberOfSimulations: config.numberOfSimulations,
        randomnessFactor: 0.5,
        recentFormWeight: 0.3,
        homeAwayWeight: 0.2,
        confidenceLevel: config.confidenceLevel,
        seasonData: {
          '2024': {
            teams,
            matches
          }
        }
      };

      console.log('Iniciando simulação com parâmetros:', simulationParams);

      // Executa a simulação
      const simulationResults = await runSimulation(matches, simulationParams);
      console.log('Simulação concluída:', simulationResults);
      
      setResults(simulationResults);
    } catch (err) {
      console.error('Erro na simulação:', err);
      setError('Ocorreu um erro ao carregar os dados ou executar a simulação. Por favor, verifique o console para mais detalhes.');
    } finally {
      setIsLoading(false);
      setCurrentSimulation(null);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold text-center">Simulador do Brasileirão 2024</h1>
          <p className="text-center text-muted-foreground mt-2">
            Simule múltiplos cenários do campeonato baseado em dados históricos
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="grid gap-8 md:grid-cols-[400px_1fr] h-full">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Configuração</h2>
            <SimulationForm onSubmit={handleSimulation} />
          </div>

          <div className="flex items-center justify-center">
            {error ? (
              <div className="text-center text-red-500 max-w-md">
                <p>{error}</p>
              </div>
            ) : isLoading ? (
              <div className="text-center">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary border-t-transparent mx-auto"></div>
                <p className="mt-6 text-lg font-medium text-primary">
                  Executando {currentSimulation?.numberOfSimulations || 1000} simulações...
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Nível de confiança: {(currentSimulation?.confidenceLevel || 0.95) * 100}%
                </p>
              </div>
            ) : results ? (
              <SimulationResults results={results} />
            ) : (
              <div className="text-center text-muted-foreground max-w-md">
                <p>Configure os parâmetros e inicie a simulação para ver os resultados</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            Desenvolvido com Next.js, TypeScript e Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
}
