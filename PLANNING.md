# Simulador do Campeonato Brasileiro

## Objetivo
Criar uma aplicação web que simule múltiplos cenários da tabela final do Campeonato Brasileiro de Futebol para qualquer temporada, utilizando dados históricos de temporadas anteriores para alimentar o modelo preditivo. O projeto atualmente utiliza dados de 2021-2023 como base histórica para demonstração.

## Estado Atual do Projeto

### Status das Fases
✅ Fase 1 - Setup Inicial e Estrutura
✅ Fase 2 - Processamento de Dados
✅ Fase 3 - Motor de Simulação
✅ Fase 4 - Interface do Usuário (100% Concluída)
⏳ Fase 5 - Refinamento e Otimização (Iniciando)

### Componentes Implementados
✅ Next.js 14 configurado
✅ TypeScript configurado
✅ Tailwind CSS configurado
✅ Dados históricos importados
✅ Shadcn/ui inicializado com componentes:
   - Button
   - Card
   - Table
   - Input
   - Progress
   - Select
   - Slider
   - Tabs
   - Tooltip
   - ThemeProvider/ThemeToggle

### Visualizações Implementadas
✅ Tabela de Resultados:
   - Posição média
   - Melhor/pior posição
   - Posição mais provável
   - Intervalo de pontos
   - Cores por zona da tabela (otimizadas para temas claro/escuro)

✅ Estatísticas:
   - Total de times
   - Média de pontos
   - Total de simulações
   - Times por zona da tabela
   - Variabilidade média

✅ Probabilidades:
   - Gráfico de barras por posição
   - Cores por zona da tabela
   - Seleção de time
   - Tooltip com valores exatos

### Motor de Simulação
✅ Funcionalidades implementadas:
   - Análise de confrontos diretos (H2H)
   - Cálculo de forma ponderada
   - Distribuição de Poisson para gols
   - Fatores de influência calibrados
   - Documentação completa do código

## Estrutura do Projeto

### Diretórios Principais
```
src/
├── app/                    
│   ├── page.tsx           # Página principal com o simulador
│   └── resultados/        # Visualização detalhada dos resultados
├── components/            
│   ├── ui/                # Componentes base (shadcn)
│   ├── SimulationForm/    # Formulário de configuração
│   └── SimulationResults/ # Componentes de resultado
├── lib/                   
│   ├── simulation/        # Lógica de simulação
│   └── analysis/          # Análise estatística
├── data/                  # Dados históricos em CSV
│   ├── raw/
│   │   └── api_football/
│   └── processed/
└── types/                 # Definições de tipos
```

### Arquivos de Dados
Localização: `/data/raw/api_football/`
- `historical/historical_standings_[DATA].csv` — Classificação histórica
- `historical/historical_fixtures_[DATA].csv` — Jogos históricos
- `current/standings_[DATA].csv` — Classificação da temporada atual
- `current/fixtures_[DATA].csv` — Jogos da temporada atual
- Arquivos auxiliares:
  - `model_features.csv`
  - `all_team_stats.csv`
  - `all_matches.csv`

Nota: [DATA] representa a data de atualização dos dados no formato AAAAMMDD

### Interfaces Principais
```typescript
interface TeamHistoricalData {
  name: string;
  seasons: {
    [year: string]: {
      homeGames: MatchData[];
      awayGames: MatchData[];
      position: number;
      points: number;
      goalsFor: number;
      goalsAgainst: number;
    }
  }
}

interface SimulationConfig {
  numberOfSimulations: number;
  confidenceLevel: number;
  recentFormWeight: number;
  homeAwayWeight: number;
  randomnessFactor: number;
}

interface SimulationResult {
  teamPositions: {
    team: string;
    avgPosition: number;
    stdDeviation: number;
    positionProbabilities: {
      position: number;
      probability: number;
    }[];
  }[];
  simulationCount: number;
}
```

## Motor de Simulação

### Fatores de Simulação
1. **Estatísticas Básicas**:
   - Média de gols marcados/sofridos
   - Pontos acumulados
   - Posição na tabela

2. **Fatores de Performance**:
   - Desempenho em casa/fora (peso: 20%)
   - Forma recente (peso: 30%)
   - Consistência do time (peso: 20%)
   - Histórico geral (peso: 30%)

3. **Ajustes de Probabilidade**:
   - Confrontos diretos (peso: 15%)
   - Tendência de forma (peso: 15%)
   - Vantagem em casa (bônus de 10% nos gols esperados)

4. **Cálculos Avançados**:
   - Distribuição de Poisson para gols
   - Ponderação de jogos recentes
   - Intervalos de confiança para posições
   - Média móvel para forma

### Cálculo das Probabilidades
1. **Força de ataque/defesa**:
   - Ataque: média de gols marcados pelo time ÷ média da liga
   - Defesa: média de gols sofridos pelo time ÷ média da liga

2. **Gols esperados**:
   - Para o mandante:
     ```
     homeExpectedGoals = LEAGUE_AVG_HOME_GOALS * homeAttackStrength * awayDefenseStrength * HOME_ADVANTAGE
     ```
   - Para o visitante:
     ```
     awayExpectedGoals = LEAGUE_AVG_AWAY_GOALS * awayAttackStrength * homeDefenseStrength
     ```
   - Constantes:
     - `LEAGUE_AVG_HOME_GOALS = 1.5`
     - `LEAGUE_AVG_AWAY_GOALS = 1.0`
     - `HOME_ADVANTAGE = 1.1`

3. **Distribuição de Poisson**:
   - Fórmula: `P(k; λ) = (λ^k * e^(-λ)) / k!`
   - Calculada para 0 a 4 gols por time
   - Probabilidades pré-calculadas para otimização

### Processo de Simulação
1. Carrega dados dos arquivos CSV
2. Calcula força de ataque/defesa de cada time
3. Para cada partida:
   - Calcula probabilidades
   - Sorteia resultado
   - Aplica ajustes baseados em forma e histórico
4. Repete para todas as rodadas
5. Agrega estatísticas finais

## Fluxo de Uso
1. Usuário acessa a página inicial
2. Define número de simulações desejado
3. Inicia a simulação
4. Visualiza progresso em tempo real
5. Recebe resultados detalhados:
   - Tabela mais provável
   - Variações possíveis
   - Probabilidades por posição

## Próximos Passos

### 1. Testes e Validação
- [ ] Implementar testes unitários para o motor de simulação:
  - Testes para cada função de cálculo
  - Testes de integração
  - Testes de regressão com dados históricos
  - Validação de probabilidades
  - Testes de performance

### 2. Otimizações de Performance
- [ ] Cache de resultados intermediários:
  - Head-to-head stats
  - Forma inicial dos times
  - Probabilidades base de Poisson
- [ ] Otimização de algoritmos:
  - Lookup table para fatoriais
  - Limitar MAX_GOALS na distribuição de Poisson
  - Índices para busca rápida de confrontos
- [ ] Paralelização:
  - Chunks de simulações
  - Web Workers
  - Otimização de estruturas de dados

### 3. Interface do Usuário
- [x] Melhorar design da página inicial
- [x] Implementar formulário de configuração
- [x] Criar visualizações gráficas dos resultados
- [x] Adicionar mais métricas estatísticas
- [x] Implementar feedback visual do progresso
- [x] Adicionar tooltips explicativos
- [x] Implementar temas claro/escuro
- [x] Melhorar responsividade

### 4. Refinamentos
- [ ] Implementar uso de dados históricos reais
- [ ] Incorporar diferença de gols como fator
- [ ] Melhorar cálculo de gols esperados
- [ ] Implementar cache de resultados
- [ ] Preparar para deploy

## Registro de Progresso (jan/2024)
- Refatoração do motor de simulação:
  - Otimização do cálculo de Poisson
  - Ajuste dos fatores de força dos times
  - Limitação dos gols esperados
  - Melhoria na performance das simulações
- Ajustes na variabilidade do modelo probabilístico
- Implementação de tooltips explicativos
- Correção do cálculo de probabilidades de posição
- Melhoria na visualização do gráfico de probabilidades 