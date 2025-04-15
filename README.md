# Simulador do Brasileirão

Simulador de múltiplos cenários da tabela final do Campeonato Brasileiro de Futebol, capaz de gerar previsões para qualquer temporada desde que existam dados históricos suficientes para alimentar o modelo. O projeto atualmente utiliza dados históricos de 2021-2023 para demonstração.

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
git clone https://github.com/seu-usuario/previsao_jogos_2.0_new.git
cd previsao_jogos_2.0_new
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
├── lib/                    # Lógica de negócio
│   ├── simulation/         # Motor de simulação
│   └── analysis/           # Análise estatística
├── data/                   # Dados históricos
└── types/                  # Definições de tipos
```

## Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento
- `npm run build`: Gera a versão de produção
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

O simulador foi otimizado para:
- Processar 1000 simulações em menos de 5 segundos
- Usar cache para resultados intermediários
- Paralelizar processamento quando possível

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
