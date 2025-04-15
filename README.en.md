# Brazilian Championship 2024 Simulator

A simulator for multiple scenarios of the final standings for the 2024 Brazilian Championship, based on historical data from 2021-2023.

## Minimum Requirements

- Node.js 18.x or higher
- npm 9.x or higher
- 4GB RAM
- 1GB disk space

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
# Edit .env.local with your settings
```

4. Start development server:
```bash
npm run dev
```

The project will be available at `http://localhost:3000`

## Project Structure

```
src/
├── app/                    # Application pages
├── components/            # React components
├── lib/                   # Business logic
│   ├── simulation/        # Simulation engine
│   └── analysis/          # Statistical analysis
├── data/                  # Historical data
└── types/                 # Type definitions
```

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Generate production build
- `npm run start`: Start production server
- `npm run lint`: Run linter
- `npm run test`: Run tests

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
    "tailwind-merge": "^2.0.0"
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

The simulator has been optimized to:
- Process 1000 simulations in less than 5 seconds
- Use cache for intermediate results
- Parallelize processing when possible

## Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## License

This project is under the MIT license. See the [LICENSE](LICENSE) file for details. 