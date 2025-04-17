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
  const [progress, setProgress] = useState(0);

  const handleSimulation = async (config: SimulationConfig) => {
    setIsLoading(true);
    setError(null);
    setCurrentSimulation(config);
    setProgress(0);
    
    try {
      console.log('Iniciando carregamento dos dados...');
      console.log('Configuração:', config);
      
      // Carrega os dados
      setProgress(5);
      const historicalData = await loadHistoricalData();
      console.log('Dados históricos carregados:', historicalData);
      setProgress(15);
      
      const { standings, fixtures } = await loadCurrentSeasonData();
      console.log('Dados atuais carregados:', { standings, fixtures });
      setProgress(25);

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
      setProgress(35);

      // Configura os parâmetros da simulação
      const simulationParams = {
        numberOfSimulations: config.numberOfSimulations,
        randomnessFactor: config.randomnessFactor,
        recentFormWeight: config.recentFormWeight,
        homeAwayWeight: config.homeAwayWeight,
        confidenceLevel: config.confidenceLevel,
        seasonData: {
          '2024': {
            teams,
            matches
          }
        },
        onProgress: (simulationProgress: number) => {
          // Mapeia o progresso da simulação (0-100) para o intervalo de 35-95
          const mappedProgress = 35 + (simulationProgress * 0.6);
          setProgress(Math.round(mappedProgress));
        }
      };

      console.log('Iniciando simulação com parâmetros:', simulationParams);

      // Executa a simulação
      const simulationResults = await runSimulation(matches, simulationParams);
      console.log('Simulação concluída:', simulationResults);
      setProgress(100);
      
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
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center">Simulador do Brasileirão 2024</h1>
          <p className="text-center text-muted-foreground mt-2 text-sm sm:text-base">
            Simule múltiplos cenários do campeonato baseado em dados históricos
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-4 sm:py-6 md:py-8 flex-1">
        <div className="grid gap-4 sm:gap-6 md:gap-8 lg:grid-cols-[350px_1fr] xl:grid-cols-[400px_1fr]">
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold">Configuração</h2>
            <SimulationForm 
              onSubmit={handleSimulation} 
              isLoading={isLoading}
              progress={progress}
            />
          </div>

          <div className="flex items-start lg:items-center justify-center min-h-[400px] lg:min-h-0">
            {error ? (
              <div className="text-center text-red-500 max-w-md p-4">
                <p className="text-sm sm:text-base">{error}</p>
              </div>
            ) : isLoading ? (
              <div className="text-center p-4">
                <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-primary border-t-transparent mx-auto"></div>
                <p className="mt-4 sm:mt-6 text-base sm:text-lg font-medium text-primary">
                  Executando {currentSimulation?.numberOfSimulations || 1000} simulações...
                </p>
                <p className="mt-2 text-xs sm:text-sm text-muted-foreground">
                  Nível de confiança: {(currentSimulation?.confidenceLevel || 0.95) * 100}%
                </p>
              </div>
            ) : results ? (
              <div className="w-full overflow-x-auto">
                <SimulationResults results={results} />
              </div>
            ) : (
              <div className="text-center text-muted-foreground max-w-md p-4">
                <p className="text-sm sm:text-base">Configure os parâmetros e inicie a simulação para ver os resultados</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <p className="text-center text-xs sm:text-sm text-muted-foreground">
            Desenvolvido com Next.js, TypeScript e Tailwind CSS
          </p>
        </div>
      </footer>
    </div>
  );
}
