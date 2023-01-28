import { Connection, Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { map } from 'rxjs/operators';
import { InjectRepository } from '@nestjs/typeorm';
import { H2h_current_page_count } from '../entities/h2h_current_page_count.entity';
import { Observable } from 'rxjs';

@Injectable()
export class H2hSynchronizerService {
    private readonly apiKey = process.env.API_KEY;
    private readonly apiUrl = process.env.API_URL;
    public data: Observable<any>;

    constructor(
        private httpService: HttpService,
        private readonly connection: Connection,
        @InjectRepository(H2h_current_page_count) private h2hPageRepository: Repository<H2h_current_page_count>,
    ) {
    }

    //@Cron('0 * * * *')
    public async parse() {
        console.log('--- Synchronize H2H Start ', new Date(), ' ---');
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        let perPage = 150;
        let page = 1;
        const today = [year, month, day].join('-');
        const currentPageCount = await this.h2hPageRepository.findOne();
        if (currentPageCount) {
            page = currentPageCount?.currentPageCount;
        }
        const interval = setInterval(() => {
            this.httpService.get(`${this.apiUrl}/fixtures/between/2006-07-07/${today}?api_token=${this.apiKey}&include=localTeam,visitorTeam,league&per_page=${perPage}&page=${page}`).subscribe(async resp => {
                if (resp.data.data.length) {
                    for (let i = 0; i < resp.data.data.length; i++) {
                        this.connection.query('INSERT INTO h2h (h2h_id, league_id,  season_id, stage_id, round_id, group_id, aggregate_id,' +
                            ' venue_id, referee_id, localteam_id, visitorteam_id, winner_team_id, weather_report, commentaries, attendance,\n' +
                            ' pitch, details, neutral_venue, winning_odds_calculated,  localteam_score, visitorteam_score, ft_score,' +
                            ' local_team, visitor_team, league)' +
                            ' VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, ' +
                            '$18, $19, $20, $21, $22, $23, $24, $25) on conflict (h2h_id) do nothing  RETURNING *',
                            [resp.data.data[i].id,
                            resp.data.data[i].league_id, resp.data.data[i].season_id, resp.data.data[i].stage_id, resp.data.data[i].round_id,
                            resp.data.data[i].group_id, resp.data.data[i].aggregate_id,
                            resp.data.data[i].venue_id, resp.data.data[i].referee_id, resp.data.data[i].localteam_id, resp.data.data[i].visitorteam_id,
                            resp.data.data[i].winner_team_id,
                            resp.data.data[i].weather_report, resp.data.data[i].commentaries, resp.data.data[i].attendance,
                            resp.data.data[i].pitch, resp.data.data[i].details, resp.data.data[i].neutral_venue, resp.data.data[i].winning_odds_calculated,
                            resp.data.data[i].scores?.localteam_score, resp.data.data[i].scores.visitorteam_score, resp.data.data[i].scores.ft_score,
                            resp.data.data[i].localTeam.data, resp.data.data[i].visitorTeam.data, resp.data.data[i].league.data],
                        );
                    }
                    page++;
                } else {
                    if (currentPageCount?.currentPageCount) {
                        currentPageCount.currentPageCount = page;
                        await this.h2hPageRepository.update(currentPageCount.id, currentPageCount);
                    } else {
                        const newCount = await this.h2hPageRepository.create({ currentPageCount: page });
                        await this.h2hPageRepository.save(newCount);
                    }
                    clearInterval(interval);
                }

            }, async error => {
                if (currentPageCount?.currentPageCount) {
                    currentPageCount.currentPageCount = page;
                    await this.h2hPageRepository.update(currentPageCount.id, currentPageCount);
                } else {
                    const newCount = await this.h2hPageRepository.create({ currentPageCount: page });
                    await this.h2hPageRepository.save(newCount);
                }
                clearInterval(interval);
            });
        }, 1000);
        console.log('--- Synchronize H2H Complete ', new Date(), ' ---');
    }
}