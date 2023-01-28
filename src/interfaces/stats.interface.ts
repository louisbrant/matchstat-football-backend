import { LeagueData, Penalties, SeasonStat, StatsAboutMatch } from './league.interface';
import { Team } from './team.interface';
import { Coach, CoachData } from './coach.interface';
import { Player, ReturnPlayer } from './player.interface';

export interface OverallStatsData {
  data: OverallStats;
}

export interface OverallStats {
  seasons: {
    data: SeasonOverallStats[];
  }
}

export interface SeasonOverallStats {
  id: number;
  league_id: number;
  stats: {
    data: SeasonStat;
  }
}

export interface ReturnOverallStatsLeague {
  leagueId: number;
  seasonId: number;
  stats: {
    numberOfClubs: number;
    numberOfMatches: number;
    matchesAlreadyPlayed: number;
    numberOfGoals: number;
    avgGoalsPerMatch: number;
    goalScoredEveryMins: number;
    mostGoalsByTeam: number;
    teamWithMostGoals?: string;
    avgHomegoalsPerMatch: number;
    avgAwaygoalsPerMatch: number;
    bttsPercentage: number;
    mostCleanSheets: number;
    teamWithMostCleanSheets?: string;
    goalkeeperMostCleansheetsNumber: number;
    goalkeeperMostCleansheets?: string;
    avgLeaguePlayerRating: number;
    teamWithMostGoalsPerMatchNumber: number;
    teamWithMostGoalsPerMatch?: string;
    seasonTopscorerNumber: number;
    topscorerPlayer: string;
    teamWithMostConcededGoalsNumber: number;
    mostConcededGoalsClub?: string;
    seasonAssistTopscorerNumber: number;
    mostAssistsPlayer?: string;
    yellowCards: number;
    avgYellowcardsPerMatch: number;
    yellowReds: number;
    avgYellowredcardsPerMatch: number;
    directReds: number;
    avgRedcardsPerMatch: number;
    avgCornersPerMatch: number;
    teamMostCornersCount: number;
    teamMostCorners?: string;
  }
}

export interface PerformanceData extends MatchStatisticsData {}

export interface GoalByMinutesData extends MatchStatisticsData {}

export interface GoalProbabilitiesData extends MatchStatisticsData {}

export interface MatchStatisticsData {
  data: MatchStatistics;
}
export interface MatchStatistics {
  current_season_id: number;
  id: number;
  league: LeagueData;
  stats: TeamStatData;
  name: string;
}

export interface TeamStatData {
  data: TeamStat[];
}

export interface TeamStat {
  attacks: number;
  avg_ball_possession_percentage: string;
  avg_corners: string;
  avg_first_goal_conceded: StatsAboutMatch;
  avg_first_goal_scored: StatsAboutMatch;
  avg_fouls_per_game: string;
  avg_goals_per_game_conceded: StatsAboutMatch;
  avg_goals_per_game_scored: StatsAboutMatch;
  avg_player_rating: number;
  avg_player_rating_per_match: number;
  avg_shots_off_target_per_game: string;
  avg_shots_on_target_per_game: string;
  btts: number;
  clean_sheet: StatsAboutMatch;
  dangerous_attacks: number;
  draw: StatsAboutMatch;
  failed_to_score: StatsAboutMatch;
  fouls: number;
  goal_line: {
    over: GoalLine,
    under: GoalLine
  };
  goals_against: StatsAboutMatch;
  goals_conceded_minutes: PeriodList[];
  goals_for: StatsAboutMatch;
  lost: StatsAboutMatch;
  offsides: number
  penalties: Penalties;
  redcards: number;
  scoring_minutes: PeriodList[];
  season_id: number;
  shots_blocked: number;
  shots_off_target: number;
  shots_on_target: number;
  stage_id: number;
  tackles: number;
  team_id: number;
  total_corners: number;
  win: StatsAboutMatch;
  yellowcards: number;
}

export interface ReturnMatchStatistics {
  teamId: number;
  leagueId: number;
  seasonId: number;
  stats: {
    attacks: number;
    dangerousAttacks: number;
    avPossessionPercent: string;
    fouls: number;
    avFoulsPerGame: string;
    offside: number;
    redCards: number;
    yellowCards: number;
    shotsBlocked: number;
    shotsOffTarget: number;
    avShotsOffTarget: string;
    shotsOnTarget: number;
    avShotsOnTarget: string;
    totalCorners: number;
    avCorners: string;
    btts: number;
    avPlayerRatingPerMatch: number;
    tackles: number;
  }
}
interface PeriodList {
  period: Period[];
}

export interface ReturnPerformance {
  teamId: number;
  leagueId: number;
  wins: OverallTeam;
  draw: OverallTeam;
  lost: OverallTeam;
  goalsFor: OverallTeam;
  goalsAgainst: OverallTeam;
  cleanSheet: OverallTeam;
  failedToScore: OverallTeam;
  avGoalsScored: OverallTeam;
  avGoalsConceded: OverallTeam;
  avFirstGoalsScored: OverallTeam;
  avFirstGoalsConceded: OverallTeam;
}

export interface ReturnGoalByMinutes {
  teamId: number;
  leagueId: number;
  seasonId: number;
  name: string;
  period: GoalByMinutesPeriod[];
}

interface GoalByMinutesPeriod {
  minute: string;
  scoringCount: number;
  scoringPercent: number;
  concededCount: number;
  concededPercent: number;
}

export interface ReturnGoalProbabilities {
  teamId: number;
  leagueId: number;
  seasonId: number;
  stats: {
    home: Overs;
    away: Overs;
  }
}

export interface PlayerStatsData {
  data: PlayerStats[];
}

export interface PlayerStats {
  coach: CoachData;
  country_id: number;
  current_season_id: number;
  id: number;
  logo_path: string;
  name: string;
  squad: {
    data: Squad[]
  }
}

export interface Squad {
  appearences: number;
  assists: number;
  blocks: number;
  captain: number;
  cleansheets: number;
  crosses: {
    total: number;
    accurate: number;
  }
  dispossesed: number;
  dribbles: {
    attempts: number;
    success: number;
    dribbled_past: number;
  }
  duels: {
    total: number;
    won: number;
  }
  fouls: {
    committed: number;
    drawn: number;
  }
  goals: number;
  hit_post: number;
  injured: boolean;
  inside_box_saves: number;
  interceptions: number;
  lineups: number;
  minutes: number;
  number: number;
  owngoals: number;
  passes: {
    total: number;
    accuracy: number;
    key_passes: number;
  }
  penalties: {
    won: number;
    scores: number;
    missed: number;
    committed: number;
    saves: number;
  }
  player: {
    data: Player
  }
  player_id: number;
  position: {
    data: {
      id: number;
      name: string;
    }
  }
  position_id: number;
  rating: string;
  redcards: number;
  saves: number;
  shots: {
    shots_total: number;
    shots_on_target: number;
    shots_off_target: number;
  }
  substitute_in: number;
  substitute_out: number;
  substitutes_on_bench: number;
  tackles: number;
  yellowcards: number;
  yellowred: number;
}

export interface ReturnPlayerStats {
  team: Team;
  coach?: Coach;
  players: ReturnPlayer[];
}

interface Overs {
  over_0_5: string;
  over_1_5: string;
  over_2_5: string;
  over_3_5: string;
  over_4_5: string;
  over_5_5: string;
  under_0_5: string;
  under_1_5: string;
  under_2_5: string;
  under_3_5: string;
  under_4_5: string;
  under_5_5: string;
}

interface Period {
  count: number;
  minute: string;
  percentage: number;
}

interface OverallTeam {
  overall: number | string;
  home: number | string;
  away: number | string;
}

interface GoalLine {
  0_5: OverTeams;
  1_5: OverTeams;
  2_5: OverTeams;
  3_5: OverTeams;
  4_5: OverTeams;
  5_5: OverTeams;
}

interface OverTeams {
  home: number;
  away: number;

}

export interface ReturnDetailStats {
  id: number;
  name: string;
  logo_path: string;
  position: number;
  result: string;
  stats: {
    btts: number;
    over_2_5: PropsDetailStats;
    under_2_5: PropsDetailStats;
    failedToScore: PropsDetailStats;
    cleanSheet: PropsDetailStats;
    corners: {
      total: number;
      avPerGame: string;
    };
    cards: {
      red: number;
      yellow: number;
    }
  }
}

interface PropsDetailStats {
  home: number | string;
  away: number | string;
  total?: number | string;
}

export interface ReturnGeneralStats {
  id: number;
  name: string;
  logo_path: string;
  position: number;
  result: string;
  recent_form: string;
  stats: {
    gamesPlayed: number;
    wins: number;
    draws: number;
    losses: number;
    goalsScored: number;
    goalsAgainst: number;
    points: number;
  }
}
