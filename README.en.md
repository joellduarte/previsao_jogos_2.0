# Brazilian Championship Simulator

Simulator of multiple scenarios for the final table of the Brazilian Football Championship, capable of generating predictions for any season as long as there is sufficient historical data to feed the model. The project currently uses historical data from 2021-2023 for demonstration.

## Minimum Requirements

- Node.js 18.x or higher
- npm 9.x or higher
- 4GB of RAM
- 1GB of disk space

## Technologies Used

- Next.js 14
- TypeScript
- Tailwind CSS
- Shadcn/ui
- React
- Vercel (deployment)

## Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/previsao_jogos_2.0_new.git
cd previsao_jogos_2.0_new
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your configurations
```

4. Start the development server:
```bash
npm run dev
```

The project will be available at `http://localhost:3000`

## Project Structure

```
src/
├── app/                    # Application pages
├── components/             # React components
│   ├── ui/                 # Base components (shadcn)
│   ├── SimulationForm/     # Configuration form
│   └── SimulationResults/  # Results components
├── lib/                    # Business logic
│   ├── simulation/         # Simulation engine
│   └── analysis/           # Statistical analysis
├── data/                   # Historical data
└── types/                  # Type definitions
```

## Implemented Features

### Views
- ✅ Results Table:
  - Average position
  - Best/worst position
  - Most likely position
  - Points range
  - Colors by table zone (optimized for light/dark themes)

- ✅ Statistics:
  - Total teams
  - Average points
  - Total simulations
  - Teams by table zone
  - Average variability

- ✅ Probabilities:
  - Bar chart by position
  - Colors by table zone
  - Team selection
  - Tooltip with exact values

### Simulation Engine
- ✅ Head-to-head analysis (H2H)
- ✅ Weighted form calculation
- ✅ Poisson distribution for goals
- ✅ Calibrated influence factors
- ✅ Complete code documentation

## Available Scripts

- `npm run dev`: Starts development server
- `npm run build`: Generates production build
- `npm run start`: Starts production server
- `npm run lint`: Runs linter
- `npm run test`: Runs tests

## Main Dependencies

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "tailwindcss": "^3.3.0",
    "@radix-ui/react-slot": "^1.0.2",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "tailwind-merge": "^2.0.0",
    "@radix-ui/react-tooltip": "^1.0.7",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-theme": "^1.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "typescript": "^5.0.0",
    "eslint": "^8.0.0",
    "prettier": "^3.0.0"
  }
}
```

## Performance

The simulator has been optimized for:
- Processing 1000 simulations in less than 5 seconds
- Using cache for intermediate results
- Parallelizing processing when possible
- Responsive and fluid interface
- Light/dark themes with smooth transitions

## Contribution

1. Fork the project
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details. 