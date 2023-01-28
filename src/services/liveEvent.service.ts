import {Injectable} from '@nestjs/common';
import {HttpService} from '@nestjs/axios';
import {map} from "rxjs/operators";
import {LiveEventInterface, League, EventInterface, MatchInterface} from "../interfaces/live-event.interface";


@Injectable()
export class LiveEventService {
    private readonly apiKey = process.env.API_KEY;
    private readonly apiUrl = process.env.API_URL;

    constructor(
        private httpService: HttpService
    ) {
    }

    getLiveEvents() {
        return this.httpService.get(`${this.apiUrl}/livescores/now?api_token=${this.apiKey}&include=league.country, stats, events.player, localTeam,visitorTeam`)
            .pipe(map(resp => this.convertToH2hFixturesInterface(resp.data)))
    }

    getLineUps(fixtureIds) {
        let lineUps = [];
        for (let i = 0; i < fixtureIds?.length; i++) {
            lineUps.push(new Promise((resolve) => {
                this.httpService.get(`${this.apiUrl}/fixtures/${fixtureIds[i]}?api_token=${this.apiKey}&include=lineup.team,bench,sidelined`).subscribe(res => {
                    resolve({lineup: res.data.data.lineup.data, bench: res.data.data.bench.data, formations: res.data.data.formations });
                })
            }))
        }
        return Promise.all(lineUps);
    }
    getMatch(fixtureId: number) {
        return this.httpService.get(`${this.apiUrl}/fixtures/${fixtureId}?api_token=${this.apiKey}&include=stats,referee,league,venue,lineup,bench,events,localTeam.country,visitorTeam.country`)
            .pipe(map(resp => this.convertToMatchFixturesInterface(resp?.data?.data)))
    }

    getFixtures(teamId: number) {
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const today = [year, month, day].join('-');
        return this.httpService.get(`${this.apiUrl}/fixtures/between/${today}/${today}/${teamId}?api_token=${this.apiKey}&include=stats, referee, league, venue, localTeam, visitorTeam, goals, events, corners, lineup, bench`)
            .pipe(map(resp => this.convertToMatchLiveFixturesInterface(resp?.data?.data)))
    }

    private convertToMatchLiveFixturesInterface(data: MatchInterface[]) {
        return data?.map(item => {
            return {
                stats: item?.stats?.data,
                events: item?.events?.data,
                lineup: item?.lineup?.data,
                bench: item?.bench?.data,
                localTeam: item?.localTeam?.data,
                visitorTeam: item?.visitorTeam?.data,
                formations: item?.formations,
                matchEnd: item?.scores?.ft_score,
                referee: item?.referee?.data,
                league: item?.league?.data,
                venue: item?.venue?.data,
                time: item?.time,
                weather: item?.weather_report,

            }
        })
    }

    private convertToMatchFixturesInterface(data: MatchInterface) {
            return {
                stats: data?.stats?.data,
                events: data?.events?.data,
                lineup: data?.lineup?.data,
                bench: data?.bench?.data,
                localTeam: data?.localTeam?.data,
                visitorTeam: data?.visitorTeam?.data,
                formations: data?.formations,
                matchEnd: data?.scores.ft_score,
                referee: data?.referee?.data,
                league: data?.league?.data,
                venue: data?.venue?.data,
                time: data?.time,
                weather: data?.weather_report,

            }
    }
    private convertToH2hFixturesInterface(data: LiveEventInterface): { league: League[] }[]{
        return data?.data?.map(item => {
            return {
                item: item,
                league: item.league.data,
                stats: item.stats.data,
                events: item.events.data,
                localTeam: item.localTeam.data,
                visitorTeam: item.visitorTeam.data,
            }
        })
    }


}
