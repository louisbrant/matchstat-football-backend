import { TeamData } from './team.interface';

export interface CompetitionStandingData {
  data: CompetitionStanding[]
}

export interface CompetitionStanding {
  standings: {
    data: Standings[]
  }
}

export interface Standings {
  away: StandingTeamInfo;
  group_id: number;
  group_name: string;
  home: StandingTeamInfo;
  overall: StandingTeamInfo;
  points: number;
  position: number;
  recent_form: string;
  result: string;
  round_id: number;
  round_name: number
  status: null
  team: TeamData;
  team_id: number;
  team_name: string;
  total: {
    goal_difference: string;
    points: number;
  }
}

interface StandingTeamInfo {
  draw: number;
  games_played: number;
  goals_against: number;
  goals_scored: number;
  lost: number;
  points: number;
  won: number;
}

export interface ReturnCompetitionStanding {
  id: number;
  name: string;
  logo_path: string;
  rank: number;
  gamesPlayed: number;
  points: number;
  wins: number;
  draws: number;
  losses: number;
  goalsDifference: string;
  goalsTotal: number;
  result: string;
}
