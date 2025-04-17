# Simulador do Campeonato Brasileiro

Simulador de múltiplos cenários para a tabela final do Campeonato Brasileiro de Futebol, capaz de gerar previsões para qualquer temporada desde que haja dados históricos suficientes para alimentar o modelo. O projeto utiliza atualmente dados históricos de 2021-2023 para demonstração.

## Requisitos Mínimos

- Node.js 18.x ou superior
- npm 9.x ou superior
- 4GB de RAM
- 1GB de espaço em disco

## Tecnologias Utilizadas

- Next.js 14
- TypeScript
- Tailwind CSS
- Shadcn/ui
- React
- Vercel (deploy)

## Instalação

1. Clone o repositório:
```bash
git clone https://github.com/joellduarte/previsao_jogos_2.0.git
cd previsao_jogos_2.0
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env.local
# Edite o .env.local com suas configurações
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

O projeto estará disponível em `http://localhost:3000`

## Estrutura do Projeto

```
src/
├── app/                    # Páginas da aplicação
├── components/             # Componentes React
│   ├── ui/                 # Componentes base (shadcn)
│   ├── SimulationForm/     # Formulário de configuração
│   └── SimulationResults/  # Componentes de resultados
├── lib/                    # Lógica de negócios
│   ├── simulation/         # Motor de simulação
│   └── analysis/           # Análise estatística
├── data/                   # Dados históricos
└── types/                  # Definições de tipos
```

## Funcionalidades Implementadas

### Visualizações
- ✅ Tabela de Resultados:
  - Posição média
  - Melhor/pior posição
  - Posição mais provável
  - Faixa de pontos
  - Cores por zona da tabela (otimizado para temas claro/escuro)

- ✅ Estatísticas:
  - Total de times
  - Pontos médios
  - Total de simulações
  - Times por zona da tabela
  - Variabilidade média

- ✅ Probabilidades:
  - Gráfico de barras por posição
  - Cores por zona da tabela
  - Seleção de time
  - Tooltip com valores exatos

### Motor de Simulação
- ✅ Análise de confrontos diretos (H2H)
- ✅ Cálculo de forma ponderada
- ✅ Distribuição de Poisson para gols
- ✅ Fatores de influência calibrados
- ✅ Documentação completa do código

## Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento
- `npm run build`: Gera a build de produção
- `npm run start`: Inicia o servidor de produção
- `npm run lint`: Executa o linter
- `npm run test`: Executa os testes

## Dependências Principais

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

O simulador foi otimizado para:
- Processar 1000 simulações em menos de 5 segundos
- Utilizar cache para resultados intermediários
- Paralelizar o processamento quando possível
- Interface responsiva e fluida
- Temas claro/escuro com transições suaves

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
