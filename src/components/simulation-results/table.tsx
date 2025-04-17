'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SimulationResult } from "./index";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

export function SimulationTable({ results }: { results: SimulationResult }) {
  const getRowColor = (position: number) => {
    if (position <= 6) return "bg-green-100 dark:bg-green-950/50 hover:bg-green-200 dark:hover:bg-green-900/50";
    if (position <= 12) return "bg-blue-100 dark:bg-blue-950/50 hover:bg-blue-200 dark:hover:bg-blue-900/50";
    if (position >= 17) return "bg-red-100 dark:bg-red-950/50 hover:bg-red-200 dark:hover:bg-red-900/50";
    return "bg-slate-200/90 dark:bg-slate-800/70 hover:bg-slate-300/90 dark:hover:bg-slate-700/70";
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-100 dark:bg-green-950 border border-green-200 dark:border-green-900"></div>
          <span>Libertadores (1-6)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-100 dark:bg-blue-950 border border-blue-200 dark:border-blue-900"></div>
          <span>Sul-Americana (7-12)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"></div>
          <span>Meio da tabela (13-16)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-100 dark:bg-red-950 border border-red-200 dark:border-red-900"></div>
          <span>Rebaixamento (17-20)</span>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <span>Posição Média</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Média das posições em todas as simulações</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <span>Melhor Posição</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Melhor posição alcançada nas simulações</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <span>Pior Posição</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Pior posição alcançada nas simulações</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <span>Posição Mais Provável</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Posição que apareceu mais vezes nas simulações</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <span>Pontos (Min-Máx)</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Intervalo de pontos alcançado nas simulações</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {results.teamPositions.map((team, index) => (
              <TableRow 
                key={team.team}
                className={cn(getRowColor(index + 1))}
              >
                <TableCell className="font-medium">
                  <span className="inline-block w-6 text-muted-foreground">{index + 1}.</span>
                  {team.team}
                </TableCell>
                <TableCell>{team.avgPosition.toFixed(1)}</TableCell>
                <TableCell>{team.bestPosition}</TableCell>
                <TableCell>{team.worstPosition}</TableCell>
                <TableCell>{team.mostLikelyPosition}</TableCell>
                <TableCell>
                  {team.pointsRange.min}-{team.pointsRange.max} ({team.pointsRange.avg.toFixed(1)})
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 