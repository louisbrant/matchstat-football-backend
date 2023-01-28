import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';
import { LeagueAndSeasonByTeamDto } from '../dto/leagueAndSeasonByTeam.dto';
import { LeagueAndSeasonsData, ReturnLeagueAndSeasons } from '../interfaces/team.interface';


@Injectable()
export class LeagueAndSeasonsService {
  private readonly apiKey = process.env.API_KEY;
  private readonly apiUrl =  process.env.API_URL;

  constructor(
    private httpService: HttpService
  ) {}

  getLeagueAndSeasons({teamId}: LeagueAndSeasonByTeamDto) {
    return this.httpService.get(`${this.apiUrl}/teams/${teamId}/history?api_token=${this.apiKey}`)
      .pipe(map(resp => this.returnLeagueAndSeason(resp.data)))
  }

  private returnLeagueAndSeason(
    data: LeagueAndSeasonsData
  ): ReturnLeagueAndSeasons[] {
    const arr: ReturnLeagueAndSeasons[] = [];
    data.data.forEach(item => {
      const curIndex = arr.findIndex(ar => ar.leagueId === item.league_id);
      if (curIndex < 0) {
        arr.push({
          leagueId: item.league_id,
          leagueName: item.league.data.name,
          type: item.league.data.type,
          seasons: [
            {
              seasonId: item.id,
              seasonName: item.name
            }
          ]
        })
      } else {
        arr[curIndex].seasons.push(
          {
            seasonId: item.id,
            seasonName: item.name
          }
        )
      }
    });
    return arr;
  }
}
