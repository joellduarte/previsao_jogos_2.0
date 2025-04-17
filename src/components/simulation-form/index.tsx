'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/app/_components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { AdvancedControls } from './advanced-controls';
import type { SimulationConfig } from './config';

interface SimulationFormProps {
  onSubmit: (config: SimulationConfig) => void;
  isLoading?: boolean;
  progress?: number;
}

export function SimulationForm({ onSubmit, isLoading = false, progress = 0 }: SimulationFormProps) {
  const [numberOfSimulations, setNumberOfSimulations] = useState(1000);
  const [confidenceLevel, setConfidenceLevel] = useState(0.95);
  const [advancedConfig, setAdvancedConfig] = useState({
    recentFormWeight: 0.3,
    homeAwayWeight: 0.2,
    randomnessFactor: 0.1
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      numberOfSimulations,
      confidenceLevel,
      ...advancedConfig
    });
  };

  return (
    <Card>
      <CardHeader className="pb-3 sm:pb-4">
        <CardTitle className="text-lg sm:text-xl">Configuração da Simulação</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="space-y-3 sm:space-y-4">
            <div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-help">
                      Número de Simulações
                    </label>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs sm:text-sm">Quantidade de cenários que serão simulados.</p>
                    <p className="text-xs sm:text-sm">Mais simulações resultam em previsões mais precisas, mas levam mais tempo.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Slider
                value={[numberOfSimulations]}
                onValueChange={(value) => setNumberOfSimulations(value[0])}
                min={100}
                max={10000}
                step={100}
                disabled={isLoading}
                className="mt-3"
              />
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                {numberOfSimulations.toLocaleString()} simulações
              </p>
            </div>

            <div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-help">
                      Nível de Confiança
                    </label>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs sm:text-sm">Grau de certeza das previsões.</p>
                    <p className="text-xs sm:text-sm">Valores mais altos resultam em intervalos mais amplos de posições possíveis.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Slider
                value={[confidenceLevel * 100]}
                onValueChange={(value) => setConfidenceLevel(value[0] / 100)}
                min={50}
                max={99}
                step={1}
                disabled={isLoading}
                className="mt-3"
              />
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                {(confidenceLevel * 100).toFixed(0)}%
              </p>
            </div>

            <AdvancedControls
              config={advancedConfig}
              onChange={setAdvancedConfig}
              disabled={isLoading}
            />
          </div>

          {isLoading && (
            <div className="space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-xs sm:text-sm text-muted-foreground text-center">
                {progress}% concluído
              </p>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Simulando...' : 'Iniciar Simulação'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 