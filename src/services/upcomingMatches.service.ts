import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { UpcomingMatchesDto } from "../dto/upcoming-matches.dto";
import { map } from "rxjs/operators";

@Injectable()
export class UpcomingMatchesService {
    private readonly apiKey = process.env.API_KEY;
    private readonly apiUrl = process.env.API_URL;

    constructor(
        private httpService: HttpService,
    ) {
    }

    upcomingMatches({ page, perPage, dateFrom, dateTo }: UpcomingMatchesDto) {
        return this.httpService.get(`${this.apiUrl}/fixtures/between/${dateFrom}/${dateTo}?api_token=${this.apiKey}&include=odds, localTeam, venue, visitorTeam, league&per_page=${perPage}&page=${page}&status=NS`).pipe(
            map(res => this.upcomingMatchesInterface(res.data.data, perPage)));

    }

    upcomingMatchesInterface(matches, perPage: number) {
        const upcomings = perPage === 50 ? matches?.filter(match => new Date(`${match.time?.starting_at?.date_time} UTC`) > new Date) : matches;
        return upcomings?.map(m => {
            return {
                id: m.id,
                firstTeam: {
                    id: m.localTeam.data.id,
                    name: m.localTeam.data.name,
                    logo_path: m.localTeam.data.logo_path,
                },
                secondTeam: {
                    id: m.visitorTeam.data.id,
                    name: m.visitorTeam.data.name,
                    logo_path: m.visitorTeam.data.logo_path,
                },
                league: {
                    id: m.league.data.id,
                    name: m.league.data.name,
                    logo_path: m.league.data.logo_path
                },
                odds: {
                    oddFirstTeam: m.odds?.data[0]?.bookmaker?.data[0]?.odds?.data[0]?.value,
                    oddSecondTeam: m.odds?.data[0]?.bookmaker?.data[0]?.odds?.data[2]?.value,
                },
                date: m.time.starting_at.date,
                time: m.time.starting_at.time,
                city: m?.venue?.data?.city,


            }
        })

    }

}
