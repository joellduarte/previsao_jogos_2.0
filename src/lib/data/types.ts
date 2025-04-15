export interface RawStandingsData {
  position: number;
  team: string;
  points: number;
  played: number;
  won: number;
  draw: number;
  lost: number;
  goals_for: number;
  goals_against: number;
  goals_diff: number;
  season: number;
}

export interface RawFixtureData {
  date: string;
  home_team: string;
  away_team: string;
  home_goals: number;
  away_goals: number;
  status: string;
  season: number;
}

export interface ProcessedTeamData {
  name: string;
  seasons: {
    [year: string]: {
      position: number;
      points: number;
      goalsFor: number;
      goalsAgainst: number;
      goalsDiff: number;
      homeGames: ProcessedMatchData[];
      awayGames: ProcessedMatchData[];
      homeStats: TeamStats;
      awayStats: TeamStats;
    }
  }
}

export interface ProcessedMatchData {
  date: Date;
  opponent: string;
  goalsScored: number;
  goalsConceded: number;
  isHome: boolean;
  points: number;
}

export interface TeamStats {
  gamesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  goalsScored: number;
  goalsConceded: number;
  points: number;
  averageGoalsScored: number;
  averageGoalsConceded: number;
  winRate: number;
  drawRate: number;
  lossRate: number;
} 