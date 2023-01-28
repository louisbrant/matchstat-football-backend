import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map, switchMap } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';
import { SearchDto } from '../dto/search.dto';
import {
  PlayerByIdData,
  PlayerStatsData,
  PlayerTeam, PlayerTeamData, ReturnGeneralInfo,
  ReturnPlayerStats,
} from '../interfaces/player.interface';
import { PlayerStatsDto } from '../dto/player-stats.dto';
import { EMPTY } from 'rxjs';

@Injectable()
export class PlayerService {
  private readonly apiKey = process.env.API_KEY;
  private readonly apiUrl =  process.env.API_URL;

  constructor(
    private httpService: HttpService,
  ) {}

  generalInfo({name}: SearchDto) {
    let curPlayer!: PlayerTeam;
    return this.httpService.get(`${this.apiUrl}/players/search/${name}?api_token=${this.apiKey}`)
      .pipe(
        map(resp => resp.data),
        switchMap((res: PlayerTeamData) => {
          curPlayer = res.data?.length && res.data[0];
          if (curPlayer) {
            return this.getPlayerById(curPlayer.player_id)
          }
          return EMPTY
        }),
        map(resp => this.returnGeneralInfo(resp.data))
      )
  }

  stats(
    {
      playerId,
      leagueId,
      seasonId
    }: PlayerStatsDto) {
    return this.httpService.get(`${this.apiUrl}/players/${playerId}?api_token=${this.apiKey}&include=team.squad,stats,position&seasons=${seasonId}`)
      .pipe(map(resp => this.returnPlayerStats(resp.data)))
  }

  private getPlayerById(id: number) {
    return this.httpService.get(`${this.apiUrl}/players/${id}?api_token=${this.apiKey}&include=country,position,team,stats,team.league,team.squad`)
      .pipe(map(resp => resp.data))
  }

  private returnGeneralInfo(curPlayer: PlayerTeam): ReturnGeneralInfo {
    const rating =  Math.max(...curPlayer?.stats?.data?.map(o => Number(o?.rating)));
    const squad = curPlayer?.team?.data?.squad?.data?.find(s => s.player_id === curPlayer.player_id);
    return {
      id: curPlayer.player_id,
      fullName: curPlayer.fullname,
      image_path: curPlayer.image_path,
      birthdate: this.dateFormat(curPlayer.birthdate),
      age: this.calculateAge(curPlayer.birthdate),
      birthplace: {
        country: curPlayer?.birthcountry,
        flag_image_path: curPlayer?.country?.data?.image_path,
        city: curPlayer?.birthplace,
      },
      position: curPlayer.position.data.name,
      team: {
        id: curPlayer?.team?.data?.id,
        name: curPlayer?.team?.data?.name,
        logo_path: curPlayer?.team?.data?.logo_path,
      },
      leagueName: curPlayer?.team?.data?.league?.data?.name,
      rating: rating?.toString(),
      weight: curPlayer?.weight,
      height: curPlayer?.height,
      number: squad?.number,
      leagueId: curPlayer?.team?.data?.league?.data?.id,
      seasonId: curPlayer?.team?.data?.current_season_id,
    }
  }

  private returnPlayerStats(data: PlayerStatsData): ReturnPlayerStats | {} {
    const stats = data.data.stats.data[0];
    const squad = data?.data?.team?.data?.squad?.data?.find(it => it.player_id === data.data.player_id);
    if (squad) {
      return {
        id: data.data.player_id,
        position: data.data.position.data.id,
        shirtNumber: squad?.number,
        statistics: {
          captain: !!stats?.captain,
          injured: squad?.injured,
          minutesPlayed: stats?.minutes,
          appearences: stats?.appearences,
          lineups: stats?.lineups,
          subbedIn: stats?.substitute_in,
          subbedOut: stats?.substitute_out,
          goals: stats?.goals,
          ownGoals: stats?.owngoals,
          assists: stats?.assists,
          saves: stats?.saves,
          insideBoxSaves: stats?.inside_box_saves,
          dispossessed: stats?.dispossesed,
          interceptions: stats?.interceptions,
          yellowCards: stats?.yellowcards,
          yellowRed: stats?.yellowred,
          directRedCards: stats?.redcards,
          tackles: stats?.tackles,
          blocks: stats?.blocks,
          hitPost: stats?.hit_post,
          cleanSheets: stats?.cleansheets,
          rating: stats?.rating,
          fouls: {
            committed: stats?.fouls.committed,
            drawn: stats?.fouls.drawn,
          },
          crosses: {
            total: stats?.crosses.total,
            accurate: stats?.crosses.accurate,
          },
          dribble: {
            attempts: stats?.dribbles.attempts,
            success: stats?.dribbles.success,
            past: stats?.dribbles.dribbled_past,
          },
          duels: {
            total: stats?.duels.total,
            won: stats?.duels.won,
          },
          passes: {
            total: stats?.passes.total,
            accuracy: stats?.passes.accuracy,
            key: stats?.passes.key_passes,
          },
          penalties: {
            won: stats?.penalties.won,
            scored: stats?.penalties.scores,
            missed: stats?.penalties.missed,
            committed: stats?.penalties.committed,
            saves: stats?.penalties.saves
          },
          shots: {
            total: stats?.shots.shots_total,
            onTarget: stats?.shots.shots_on_target,
            offTarget: stats?.shots.shots_off_target,
          }
        }
      }
    }
    return {}
  }

  private calculateAge(date: string) { // birthday is a date
    const ageDifMs = Date.now() - new Date(this.dateFormat(date)).getTime();
    const ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  private dateFormat(date: string) {
    if (date) {
      const arr = date.split('/');
      return `${arr[2]}-${arr[1]}-${arr[0]}`;
    }
    return date
  }
}
