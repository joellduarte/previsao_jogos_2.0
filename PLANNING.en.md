# Brazilian Championship Simulator

## Objective
Create a web application that simulates multiple scenarios of the final standings of the Brazilian Football Championship for any season, using historical data from previous seasons to feed the predictive model. The project currently uses data from 2021-2023 as historical basis for demonstration.

## Current Project Status

### Phase Status
✅ Phase 1 - Initial Setup and Structure
✅ Phase 2 - Data Processing
✅ Phase 3 - Simulation Engine
✅ Phase 4 - User Interface (100% Complete)
⏳ Phase 5 - Refinement and Optimization (Starting)

### Implemented Components
✅ Next.js 14 configured
✅ TypeScript configured
✅ Tailwind CSS configured
✅ Historical data imported
✅ Shadcn/ui initialized with components:
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

### Implemented Views
✅ Results Table:
   - Average position
   - Best/worst position
   - Most likely position
   - Points range
   - Colors by table zone (optimized for light/dark themes)

✅ Statistics:
   - Total teams
   - Average points
   - Total simulations
   - Teams by table zone
   - Average variability

✅ Probabilities:
   - Position bar chart
   - Colors by table zone
   - Team selection
   - Tooltip with exact values

### Simulation Engine
✅ Implemented features:
   - Head-to-head analysis (H2H)
   - Weighted form calculation
   - Poisson distribution for goals
   - Calibrated influence factors
   - Complete code documentation

## Project Structure

### Main Directories
```
src/
├── app/                    
│   ├── page.tsx           # Main simulator page
│   └── resultados/        # Detailed results visualization
├── components/            
│   ├── ui/                # Base components (shadcn)
│   ├── SimulationForm/    # Configuration form
│   └── SimulationResults/ # Result components
├── lib/                   
│   ├── simulation/        # Simulation logic
│   └── analysis/          # Statistical analysis
├── data/                  # Historical CSV data
│   ├── raw/
│   │   └── api_football/
│   └── processed/
└── types/                 # Type definitions
```

### Data Files
Location: `/data/raw/api_football/`
- `historical/historical_standings_[DATE].csv` — Historical standings
- `historical/historical_fixtures_[DATE].csv` — Historical matches
- `current/standings_[DATE].csv` — Current standings
- `current/fixtures_[DATE].csv` — Current season matches
- Auxiliary files:
  - `model_features.csv`
  - `all_team_stats.csv`
  - `all_matches.csv`

Note: [DATE] represents the data update date in YYYYMMDD format

### Main Interfaces
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

## Simulation Engine

### Simulation Factors
1. **Basic Statistics**:
   - Average goals scored/conceded
   - Accumulated points
   - Table position

2. **Performance Factors**:
   - Home/away performance (weight: 20%)
   - Recent form (weight: 30%)
   - Team consistency (weight: 20%)
   - Overall history (weight: 30%)

3. **Probability Adjustments**:
   - Head-to-head (weight: 15%)
   - Form trend (weight: 15%)
   - Home advantage (10% bonus on expected goals)

4. **Advanced Calculations**:
   - Poisson distribution for goals
   - Recent matches weighting
   - Confidence intervals for positions
   - Moving average for form

### Probability Calculations
1. **Attack/Defense Strength**:
   - Attack: team's average goals scored ÷ league average
   - Defense: team's average goals conceded ÷ league average

2. **Expected Goals**:
   - For home team:
     ```
     homeExpectedGoals = LEAGUE_AVG_HOME_GOALS * homeAttackStrength * awayDefenseStrength * HOME_ADVANTAGE
     ```
   - For away team:
     ```
     awayExpectedGoals = LEAGUE_AVG_AWAY_GOALS * awayAttackStrength * homeDefenseStrength
     ```
   - Constants:
     - `LEAGUE_AVG_HOME_GOALS = 1.5`
     - `LEAGUE_AVG_AWAY_GOALS = 1.0`
     - `HOME_ADVANTAGE = 1.1`

3. **Poisson Distribution**:
   - Formula: `P(k; λ) = (λ^k * e^(-λ)) / k!`
   - Calculated for 0 to 4 goals per team
   - Pre-calculated probabilities for optimization

### Simulation Process
1. Load CSV data
2. Calculate attack/defense strength for each team
3. For each match:
   - Calculate probabilities
   - Draw result
   - Apply adjustments based on form and history
4. Repeat for all rounds
5. Aggregate final statistics

## Usage Flow
1. User accesses the home page
2. Sets desired number of simulations
3. Starts simulation
4. Views real-time progress
5. Receives detailed results:
   - Most likely table
   - Possible variations
   - Position probabilities

## Next Steps

### 1. Testing and Validation
- [ ] Implement unit tests for simulation engine:
  - Tests for each calculation function
  - Integration tests
  - Regression tests with historical data
  - Probability validation
  - Performance tests

### 2. Performance Optimizations
- [ ] Intermediate results cache:
  - Head-to-head stats
  - Initial team form
  - Base Poisson probabilities
- [ ] Algorithm optimization:
  - Factorial lookup table
  - Limit MAX_GOALS in Poisson distribution
  - Quick lookup indices for matches
- [ ] Parallelization:
  - Simulation chunks
  - Web Workers
  - Data structure optimization

### 3. User Interface
- [x] Improve home page design
- [x] Implement configuration form
- [x] Create graphical visualizations
- [x] Add more statistical metrics
- [x] Implement visual progress feedback
- [x] Add explanatory tooltips
- [x] Implement light/dark themes
- [x] Improve responsiveness

### 4. Refinements
- [ ] Implement real historical data usage
- [ ] Incorporate goal difference as factor
- [ ] Improve expected goals calculation
- [ ] Implement results cache
- [ ] Prepare for deployment

## Progress Log (Jun/2024)
- Simulation engine refactoring:
  - Poisson calculation optimization
  - Team strength factors adjustment
  - Expected goals limitation
  - Simulation performance improvement
- Probabilistic model variability adjustments
- Implementation of explanatory tooltips
- Correction of position probability calculation
- Improvement in probability chart visualization 