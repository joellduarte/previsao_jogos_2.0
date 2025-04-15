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

export function SimulationTable({ results }: { results: SimulationResult }) {
  const getRowColor = (position: number) => {
    if (position <= 6) return "bg-green-50/50 dark:bg-green-950/50 hover:bg-green-100/50 dark:hover:bg-green-900/50";
    if (position <= 12) return "bg-blue-50/50 dark:bg-blue-950/50 hover:bg-blue-100/50 dark:hover:bg-blue-900/50";
    if (position >= 17) return "bg-red-50/50 dark:bg-red-950/50 hover:bg-red-100/50 dark:hover:bg-red-900/50";
    return "bg-slate-100/70 dark:bg-slate-800/70 hover:bg-slate-200/70 dark:hover:bg-slate-700/70";
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-50 dark:bg-green-950 border border-green-100 dark:border-green-900"></div>
          <span>Libertadores (1-6)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-50 dark:bg-blue-950 border border-blue-100 dark:border-blue-900"></div>
          <span>Sul-Americana (7-12)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"></div>
          <span>Meio da tabela (13-16)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-50 dark:bg-red-950 border border-red-100 dark:border-red-900"></div>
          <span>Rebaixamento (17-20)</span>
        </div>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Time</TableHead>
            <TableHead>Posição Média</TableHead>
            <TableHead>Melhor Posição</TableHead>
            <TableHead>Pior Posição</TableHead>
            <TableHead>Posição Mais Provável</TableHead>
            <TableHead>Pontos (Min-Máx)</TableHead>
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
  );
} 