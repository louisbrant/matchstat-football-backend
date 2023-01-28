export interface Trophies {
  data: Trophy[]
}

export interface Trophy {
  league_id: number;
  league: string;
  status: string;
  times: number;
}

export enum StatusTrophy {
  Winner = 'Winner',
  RunnerUp = 'Runner-up'
}
