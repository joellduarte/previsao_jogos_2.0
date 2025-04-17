'use client';

import { useState } from 'react';
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface AdvancedControlsProps {
  config: {
    recentFormWeight: number;
    homeAwayWeight: number;
    randomnessFactor: number;
  };
  onChange: (config: {
    recentFormWeight: number;
    homeAwayWeight: number;
    randomnessFactor: number;
  }) => void;
  disabled?: boolean;
}

export function AdvancedControls({ config, onChange, disabled = false }: AdvancedControlsProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleConfigChange = (key: keyof typeof config, value: number) => {
    const newConfig = { ...config, [key]: value };
    onChange(newConfig);
  };

  if (!isExpanded) {
    return (
      <Button 
        variant="outline" 
        className="w-full text-sm" 
        onClick={() => setIsExpanded(true)}
        disabled={disabled}
      >
        Configurações Avançadas
      </Button>
    );
  }

  return (
    <Card className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-base sm:text-lg font-medium">Configurações Avançadas</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsExpanded(false)}
          disabled={disabled}
          className="text-xs sm:text-sm"
        >
          Fechar
        </Button>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-help">
                  Peso da Forma Recente
                </label>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs sm:text-sm">Influência do desempenho recente dos times nas previsões.</p>
                <p className="text-xs sm:text-sm">Valores mais altos dão mais importância aos últimos jogos.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Slider
            value={[config.recentFormWeight * 100]}
            onValueChange={(value) => handleConfigChange('recentFormWeight', value[0] / 100)}
            min={0}
            max={100}
            step={5}
            className="w-full mt-3"
            disabled={disabled}
          />
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {(config.recentFormWeight * 100).toFixed(0)}%
          </p>
        </div>

        <div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-help">
                  Peso Casa/Fora
                </label>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs sm:text-sm">Influência do fator casa/fora nas previsões.</p>
                <p className="text-xs sm:text-sm">Valores mais altos aumentam a vantagem de jogar em casa.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Slider
            value={[config.homeAwayWeight * 100]}
            onValueChange={(value) => handleConfigChange('homeAwayWeight', value[0] / 100)}
            min={0}
            max={100}
            step={5}
            className="w-full mt-3"
            disabled={disabled}
          />
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {(config.homeAwayWeight * 100).toFixed(0)}%
          </p>
        </div>

        <div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-help">
                  Fator de Aleatoriedade
                </label>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs sm:text-sm">Grau de imprevisibilidade nas simulações.</p>
                <p className="text-xs sm:text-sm">Valores mais altos aumentam a chance de resultados surpreendentes.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Slider
            value={[config.randomnessFactor * 100]}
            onValueChange={(value) => handleConfigChange('randomnessFactor', value[0] / 100)}
            min={0}
            max={100}
            step={5}
            className="w-full mt-3"
            disabled={disabled}
          />
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {(config.randomnessFactor * 100).toFixed(0)}%
          </p>
        </div>
      </div>
    </Card>
  );
} 