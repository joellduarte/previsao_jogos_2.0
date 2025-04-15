'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import type { SimulationConfig } from './config';

interface SimulationFormProps {
  onSubmit: (config: SimulationConfig) => void;
}

export function SimulationForm({ onSubmit }: SimulationFormProps) {
  const [numberOfSimulations, setNumberOfSimulations] = useState(1000);
  const [confidenceLevel, setConfidenceLevel] = useState(0.95);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      numberOfSimulations,
      confidenceLevel
    });
  };

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Número de Simulações: {numberOfSimulations}
            </label>
            <Slider
              value={[numberOfSimulations]}
              onValueChange={(values) => setNumberOfSimulations(values[0])}
              min={100}
              max={10000}
              step={100}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Mais simulações = resultados mais precisos, mas leva mais tempo
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">
              Nível de Confiança: {(confidenceLevel * 100).toFixed(0)}%
            </label>
            <Slider
              value={[confidenceLevel * 100]}
              onValueChange={(values) => setConfidenceLevel(values[0] / 100)}
              min={80}
              max={99}
              step={1}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              Intervalo de confiança para as previsões
            </p>
          </div>
        </div>

        <Button type="submit" className="w-full">
          Iniciar Simulação
        </Button>
      </form>
    </Card>
  );
} 