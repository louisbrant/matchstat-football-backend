import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map } from 'rxjs/operators';
import { H2hFixtureDto } from '../dto/h2h-fixture.dto';
import { Fixtures, FixturesData, ReturnFixture, TeamRecentlyInterface } from '../interfaces/fixtures.interface';
import { H2h } from "../entities/h2h.entity";
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Not, Repository } from "typeorm";
import { is } from "@babel/types";


@Injectable()
export class H2hService {
    private readonly apiKey = process.env.API_KEY;
    private readonly apiUrl = process.env.API_URL;

    constructor(
        private httpService: HttpService,
        @InjectRepository(H2h) private h2hRepository: Repository<H2h>
    ) {
    }

    fixtures(
        {
            count,
            page,
            firstTeamId,
            secondTeamId
        }: H2hFixtureDto) {
        return this.httpService.get(`${this.apiUrl}/head2head/${firstTeamId}/${secondTeamId}?api_token=${this.apiKey}&include=league,localTeam,visitorTeam`)
            .pipe(map(resp => this.convertToH2hFixturesInterface(resp.data)))
    }

    private convertToH2hFixturesInterface(data: FixturesData): ReturnFixture[] {
        return data.data.map(item => {
            return {
                id: item.id,
                dateStart: item.time.starting_at.date_time,
                homeTeam: {
                    id: item.localTeam.data.id,
                    logo_path: item.localTeam.data.logo_path,
                    name: item.localTeam.data.name,
                    score: item.scores.localteam_score
                },
                awayTeam: {
                    id: item.visitorTeam.data.id,
                    logo_path: item.visitorTeam.data.logo_path,
                    name: item.visitorTeam.data.name,
                    score: item.scores.visitorteam_score
                },
                league: {
                    id: item.league.data.id,
                    logo_path: item.league.data.logo_path
                }
            }
        })
    }

    async getFixturesH2hInteresting(): Promise<H2h[]> {
        return await this.h2hRepository.find({
            where: {
                ft_score: Not(IsNull()),
            },
            order: {
                ft_score: "DESC",
            },
            take: 10,
        })
    }

    async getH2hInterestingLeague(leagueId): Promise<H2h[]> {
        return await this.h2hRepository.find({
            where: {
                league_id: leagueId,
            },
            order: {
                ft_score: "DESC",
            },
            take: 10,
        })
    }


    async getH2hInterestingTeams(teamId): Promise<H2h[]> {
        return await this.h2hRepository.find({
            where: [
                { localteam_id: teamId },
                { visitorteam_id: teamId },
            ],
            order: {
                ft_score: "DESC",
            },
            take: 20,
        })
    }

    h2hTeams(firstTeamId: number, secondTeamId: number) {
        return this.httpService.get(`${this.apiUrl}/head2head/${firstTeamId}/${secondTeamId}?api_token=${this.apiKey}&include=league,localTeam,visitorTeam,stats.fixture.probability`)
            .pipe(map(resp => this.convertToH2hTeamsInterface(resp.data)))
    }

    teamDataForComparision(teamId: number, seasonId: number) {
        return this.httpService.get(`${this.apiUrl}/squad/season/${seasonId}/team/${teamId}?api_token=${this.apiKey}&include=player.team,`)
            .pipe(map(resp => this.convertToTeamData(resp.data.data)));
    }
    convertToTeamData(data: any) {
        return data;
    }

    teamRecentlyPlayed(teamId: number, isHomeAwayForm: string) {
        const isTrueSet = (isHomeAwayForm === 'true');
        const urlIncludes = isTrueSet ? 'latest.league:limit(50|1)' : 'latest.league';
        return this.httpService.get(`${this.apiUrl}/teams/${teamId}?api_token=${this.apiKey}&include=${urlIncludes}`)
            .pipe(map(resp => this.convertToTeamRecently(resp.data.data, isTrueSet)));
    }

    convertToTeamRecently(data: TeamRecentlyInterface, isHomeAwayForm: boolean) {
        if (data?.latest?.data?.length) {
            if (isHomeAwayForm) {
                return {
                    homeForm: this.lastTeamForm(data.latest.data, data.id),
                    awayForm: this.lastTeamForm(data.latest.data, data.id, 'visitorteam_id'),
                };
            } else {
                return {
                    id: data.id,
                    latest: data.latest.data,
                    logo_path: data.logo_path,
                    name: data.name,
                    short_code: data.short_code,
                }
            }
        } else {
            return {};
        }
    }

    private lastTeamForm(data, teamId: number, column = 'localteam_id') {
        let count = 1;
        return data.filter(d => {
            if (d[column] === teamId && count < 6) {
                count++;
                return true;
            }
            return false;
        })
            .map(d => {
                if (!d.winner_team_id) {
                    return 'D';
                } else if (d.winner_team_id === teamId) {
                    return 'W';
                } else {
                    return 'L';
                }
            })
            .reverse()
            .join('');
    }

    convertToH2hTeamsInterface(data: FixturesData) {
        return data.data.map(item => {
            return {
                id: item.id,
                dateStart: item.time.starting_at.date_time,
                stats: item.stats.data,
                homeTeam: {
                    id: item.localTeam.data.id,
                    logo_path: item.localTeam.data.logo_path,
                    name: item.localTeam.data.name,
                    score: item.scores.localteam_score
                },
                awayTeam: {
                    id: item.visitorTeam.data.id,
                    logo_path: item.visitorTeam.data.logo_path,
                    name: item.visitorTeam.data.name,
                    score: item.scores.visitorteam_score
                },
                league: {
                    id: item.league?.data?.id,
                    logo_path: item.league?.data?.logo_path
                }
            }
        })
    }
}
