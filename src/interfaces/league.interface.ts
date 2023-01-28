import { Country } from './country.interface';
import { SeasonData } from './season.interface';

export interface League {
  id: number;
  logo_path: string;
  name?: string;
  type?: string;
}

export interface LeagueData {
  data: League;
}

export interface LeagueSeasons extends League {
  seasons: SeasonData;
}

export interface LeagueSeasonsData {
  data: LeagueSeasons;
}

export interface ReturnLeague extends League {
}

export interface GeneralInfoLeagueData {
  data: GeneralInfoLeague[]
}

export interface GeneralInfoLeague extends League {
  country: Country
  season: {
    data: {
      stats: StatSeasonData
    }
  }
  type: string;
  coverage: {
    predictions: boolean;
    topscorer_assists: boolean;
    topscorer_cards: boolean;
    topscorer_goals: boolean;
  }
}


export interface ReturnGeneralInfoLeague extends ReturnLeague {
  country: string
  country_flag: string;
  numberOfMatchesPlayed: number;
  numberOfMatches: number;
  progress: string;
  type: string;
  predictability: boolean;
}

export interface StatSeasonData {
  data: SeasonStat;
}

export interface SeasonStat {
  avg_awaygoals_per_match: number;
  avg_corners_per_match: number;
  avg_goals_per_match: number;
  avg_homegoals_per_match: number;
  avg_player_rating: number;
  avg_redcards_per_match: number;
  avg_yellowcards_per_match: number;
  avg_yellowredcards_per_match: number;
  btts: number;
  defeat_percentage: StatsAboutTeams;
  draw_percentage: number;
  goal_line: {
    over: GoalLine;
    under: GoalLine;
  }
  goal_scored_every_minutes: number;
  goalkeeper_most_cleansheets_id: number;
  goalkeeper_most_cleansheets_number: number;
  goals_conceded: StatsAboutTeams;
  goals_scored: StatsAboutTeams;
  goals_scored_minutes: number;
  id: number;
  league_id: number;
  matches_both_teams_scored: number;
  number_of_clubs: number;
  number_of_goals: number;
  number_of_matches: number;
  number_of_matches_played: number;
  number_of_redcards: number;
  number_of_yellowcards: number;
  number_of_yellowredcards: number;
  season_assist_topscorer_id: number;
  season_assist_topscorer_number: number;
  season_id: number;
  season_topscorer_id: number;
  season_topscorer_number: number;
  team_most_cleansheets_id: number;
  team_most_cleansheets_number: number;
  team_most_corners_count: number;
  team_most_corners_id: number;
  team_with_most_conceded_goals_id: number;
  team_with_most_conceded_goals_number: number;
  team_with_most_goals_id: number;
  team_with_most_goals_number: number;
  team_with_most_goals_per_match_id: number;
  team_with_most_goals_per_match_number: number;
  updated_at: string;
  win_percentage: StatsAboutTeams;
}

export interface StatsAboutTeams {
  all: number;
  home: number;
  away: number;
}

export interface StatsAboutMatch {
  total: number | string;
  home: number | string;
  away: number | string;
}

interface GoalLine {
  0_5: number;
  1_5: number;
  2_5: number;
  3_5: number;
  4_5: number;
  5_5: number;
}

export interface Penalties {
  awarded: number;
  scored: number;
  conceded: number;
}

export interface ReturnLeagueSearch {
  id: number;
  name: string;
  currentSeasonId: number;
}

export interface LeagueSearchData {
  data: LeagueSearch[];
}

export interface LeagueSearch {
  current_season_id: number;
  id: number;
  name: string;
}
