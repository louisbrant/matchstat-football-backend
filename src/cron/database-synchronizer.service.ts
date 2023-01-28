import { Connection } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { map } from 'rxjs/operators';

@Injectable()
export class DatabaseSynchronizerService {
  private readonly apiKey = process.env.API_KEY;
  private readonly apiUrl =  process.env.API_URL;

  constructor(
    private httpService: HttpService,
    private connection: Connection,
  ) {

  }
  // @Cron('0 */20 * * * *')
  public async parse() {
    console.log('--- Synchronize Start ', new Date(), ' ---');

    await this.synchronizeLeague().then(() => {
      console.log(new Date(), 'rating synchronize complete');
    });

    console.log('--- Synchronize Complete ', new Date(), ' ---');
  }

  private async synchronizeLeague() {
    this.httpService.get(`${this.apiUrl}/leagues?api_token=${this.apiKey}`)
      .pipe(map(resp => resp.data));


    await this.connection.manager.query(`
        insert into public.player_atp (id, name, "countryAcronym")
        select distinct on (id_p_r) id_p_r, 'Unknown Player', 'N/A'
        from matchstatdb.ratings_atp
        where id_p_r not in (select id from public.player_atp);
        delete from public.rating_atp where extract(year from date) = extract(year from now());
        insert into public.rating_atp ("date", "point", "position", "playerId")
        select date_r, point_r, pos_r, id_p_r
        from matchstatdb.ratings_atp mr
            on conflict ("date", "playerId") do nothing;

        insert into public.player_wta (id, name, "countryAcronym")
        select distinct on (id_p_r) id_p_r, 'Unknown Player', 'N/A'
        from matchstatdb.ratings_wta
        where id_p_r not in (select id from public.player_wta);
        delete from public.rating_wta where extract(year from date) = extract(year from now());
        insert into public.rating_wta ("date", "point", "position", "playerId")
        select date_r, point_r, pos_r, id_p_r
        from matchstatdb.ratings_wta mr
            on conflict ("date", "playerId") do nothing;
    `);
  }

  private async getLeagues(page: number) {
    await this.httpService.get(`${this.apiUrl}/leagues?api_token=${this.apiKey}&page=${page}&per_page=150`)
      .pipe(map(resp => resp.data))
      .toPromise();
  }
}
