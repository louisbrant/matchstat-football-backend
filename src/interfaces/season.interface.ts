import { CompetitionStanding } from './competition-standing.interface';

export interface SeasonData {
  data: Season[];
}


export interface Season extends CompetitionStanding {
  id: number;
  league_id: number;
  name: string;
}

export interface SeasonOfLeague {
  seasonId: number;
  seasonName: string;
}
