export interface FileConfig {
  historical: {
    standings: string;
    fixtures: string;
  };
  current: {
    standings: string;
    fixtures: string;
  };
  other: {
    modelFeatures: string;
    teamStats: string;
    allMatches: string;
  };
}

export const defaultFileConfig: FileConfig = {
  historical: {
    standings: 'historical/historical_standings_20250412.csv',
    fixtures: 'historical/historical_fixtures_20250412.csv'
  },
  current: {
    standings: 'current/standings_20250412.csv',
    fixtures: 'current/fixtures_20250412.csv'
  },
  other: {
    modelFeatures: 'model_features.csv',
    teamStats: 'all_team_stats.csv',
    allMatches: 'all_matches.csv'
  }
};

export function getAllValidFiles(): string[] {
  const config = defaultFileConfig;
  return [
    config.historical.standings,
    config.historical.fixtures,
    config.current.standings,
    config.current.fixtures,
    config.other.modelFeatures,
    config.other.teamStats,
    config.other.allMatches
  ];
}

export function updateFileConfig(newConfig: Partial<FileConfig>): FileConfig {
  return {
    ...defaultFileConfig,
    ...newConfig
  };
} 