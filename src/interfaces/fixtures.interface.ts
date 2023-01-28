import { Scores, Team, TeamData, Time } from './team.interface';
import { League, LeagueData } from './league.interface';

export interface ReturnFixture {
  id: number;
  dateStart: string;
  homeTeam: Team;
  awayTeam: Team;
  league: League;

}

export interface Fixtures {
  id: number;
  league: LeagueData;
  localTeam: TeamData;
  scores: Scores;
  localteam_id: number;
  visitorteam_id: number;
  winner_team_id: number;
  time: Time;
  visitorTeam: TeamData;
  stats?: { data: [] },

}

export interface FixturesData {
  data: Fixtures[];
}

export interface LeagueFixturesData {
  data: LeagueSeasonFixturesData;
}


export interface LeagueSeasonFixturesData extends League {
  seasons: {
    data: LeagueSeasonFixtures[]
  }
}

export interface LeagueSeasonFixtures {
  fixtures: {
    data: LeagueFixture[]
  }
  id: number;
}

export interface LeagueFixture {
  id: number;
  localTeam: TeamData;
  scores: Scores;
  time: Time;
  visitorTeam: TeamData;
}
export interface TeamRecentlyInterface {
  id: number,
  legacy_id: number,
  name: string,
  short_code: string,
  twitter: string,
  country_id: number,
  national_team: boolean,
  founded: number,
  logo_path: string,
  venue_id: number,
  current_season_id: number,
  is_placeholder: boolean,
  latest: {
    data: {}[]
  }
}