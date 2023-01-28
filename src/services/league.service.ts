import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { GeneralInfoDto } from '../dto/general-info.dto';
import { map, switchMap } from 'rxjs/operators';
import {
    GeneralInfoLeagueData,
    LeagueSearchData, LeagueSeasonsData,
    ReturnGeneralInfoLeague,
    ReturnLeagueSearch,
} from '../interfaces/league.interface';
import { LeagueOverallStatsDto } from '../dto/league-overall-stats.dto';
import {
    OverallStatsData, ReturnDetailStats, ReturnGeneralStats,
    ReturnOverallStatsLeague, ReturnPlayerStats,
    SeasonOverallStats, Squad,
} from '../interfaces/stats.interface';
import { forkJoin, of, EMPTY } from 'rxjs';
import { LeagueFixtureDto } from '../dto/league-fixture.dto';
import { LeagueFixturesData, ReturnFixture } from '../interfaces/fixtures.interface';
import { LeagueDetailStatsDto } from '../dto/league-detail-stats.dto';
import { SeasonData, SeasonOfLeague } from '../interfaces/season.interface';
import { LeagueGeneralStatsDto } from '../dto/league-general-stats.dto';
import { SearchDto } from '../dto/search.dto';
import { TeamData } from '../interfaces/team.interface';
import { SeasonsOfLeagueDto } from '../dto/seasons-of-league.dto';
import { LeagueSeasonDto } from "../dto/leagueSeason.dto";
import { LeagueSeasonDatesDto } from "../dto/league-season-dates.dto";
import { LeagueSeasonsDto } from "../dto/league-seasons.dto";
import { SeasonsDateAndSatesOfLeague, SeasonStatesInfo } from "../interfaces/SeasonsDateAndSatesOfLeague";

enum ResultEnum {
    RESULT = 'RESULT',
    FIXTURE = 'FIXTURE',
}

@Injectable()
export class LeagueService {
    private readonly apiKey = process.env.API_KEY;
    private readonly apiUrl = process.env.API_URL;

    constructor(
        private httpService: HttpService,
    ) {
    }


    generalInfo({ leagueName }: GeneralInfoDto) {
        return this.httpService.get(`${this.apiUrl}/leagues/search/${leagueName}?api_token=${this.apiKey}&include=country,season.stats`)
            .pipe(map(resp => this.convertToGeneralInfoInterface(resp.data)))
    }

    overallStats({ leagueId, seasonId }: LeagueOverallStatsDto) {
        return this.httpService.get(`${this.apiUrl}/leagues/${leagueId}?api_token=${this.apiKey}&include=seasons.stats&seasons=${seasonId}`)
            .pipe(
                map(resp => resp.data),
                switchMap((res) => {
                    const curSeasonStat = this.curSeason(seasonId, res);
                    if (curSeasonStat?.stats) {
                        return forkJoin({
                            data: of(curSeasonStat),
                            teamWithMostGoals: this.getTeamById(curSeasonStat.stats.data.team_with_most_goals_id),
                            teamWithMostCleanSheets: this.getTeamById(curSeasonStat.stats.data.team_most_cleansheets_id),
                            goalkeeperMostCleansheets: this.getPlayerById(curSeasonStat.stats.data.goalkeeper_most_cleansheets_id),
                            teamWithMostGoalsPerMatch: this.getTeamById(curSeasonStat.stats.data.team_with_most_goals_per_match_id),
                            topscorerPlayer: this.getPlayerById(curSeasonStat.stats.data.season_assist_topscorer_id),
                            mostConcededGoalsClub: this.getTeamById(curSeasonStat.stats.data.team_with_most_conceded_goals_id),
                            mostAssistsPlayer: this.getPlayerById(curSeasonStat.stats.data.season_assist_topscorer_id),
                            teamMostCorners: this.getTeamById(curSeasonStat.stats.data.team_most_corners_id)
                        })
                    }
                    return of(null)
                }),
                map(resp => {
                    if (resp) {
                        return this.convertToOverallStatsInterface(
                            resp.data,
                            resp.teamWithMostGoals?.data?.name,
                            resp.teamWithMostCleanSheets?.data?.name,
                            resp.goalkeeperMostCleansheets?.data?.lastname,
                            resp.teamWithMostGoalsPerMatch?.data?.name,
                            resp.topscorerPlayer?.data?.lastname,
                            resp.mostConcededGoalsClub?.data?.name,
                            resp.mostAssistsPlayer?.data?.lastname,
                            resp.teamMostCorners?.data?.name,
                        )
                    }
                    return {}
                }),
            )
    }

    async fixtures(
        {
            count,
            page,
            leagueId,
            seasonId,
            leagueResult
        }: LeagueFixtureDto) {
        return await new Promise(resolve => {
            const interval = setInterval(() => {
                this.httpService.get(`${this.apiUrl}/leagues/${leagueId}?api_token=${this.apiKey}&include=seasons.fixtures:limit(${count}|${page}),seasons.fixtures.localTeam,seasons.fixtures.visitorTeam&seasons=${seasonId}`).subscribe(res => {
                    const curSeason = res.data.data?.seasons.data.find(s => s.id === seasonId);
                    let fixtures;
                    if (curSeason.fixtures.data.length) {
                        if (leagueResult === ResultEnum.FIXTURE) {
                            fixtures = curSeason.fixtures.data.filter(fixture => new Date(`${fixture?.time?.starting_at?.date_time} UTC`) >= new Date && fixture.scores?.localteam_score <= 0 && fixture.scores?.visitorteam_score <= 0);
                        } else {
                            fixtures = curSeason.fixtures.data.filter(fixture => new Date(`${fixture?.time?.starting_at?.date_time} UTC`) < new Date);
                        }
                        if (fixtures?.length) {
                            const data = this.convertToFixturesInterface(page, fixtures);
                            resolve(data);
                            clearInterval(interval);
                            return data;
                        } else {
                            page++;
                        }
                    }
                })
            }, 500);
        });
    }

    detailStats(
        {
            leagueId,
            seasonId
        }: LeagueDetailStatsDto) {
        return this.httpService.get(`${this.apiUrl}/standings/season/${seasonId}?api_token=${this.apiKey}&include=standings.team.stats&seasons=${seasonId}`)
            .pipe(map(resp => this.convertToDetailStatsInterface(resp.data)))
    }

    generalStats(
        {
            leagueId,
            seasonId
        }: LeagueGeneralStatsDto) {
        return this.httpService.get(`${this.apiUrl}/standings/season/${seasonId}?api_token=${this.apiKey}&include=standings.team`)
            .pipe(map(resp => this.convertToGeneralStatsInterface(resp.data)))
    }

    // playerStats(
    //   {
    //     leagueId,
    //     seasonId
    //   }: PlayersLeagueDto) {
    //   return this.httpService.get(`${this.apiUrl}/squad/season/${seasonId}/team/${teamId}?api_token=${this.apiKey}&include=player`)
    //     .pipe(
    //       map(resp => this.convertToPlayerStatsInterface(resp.data, players))
    //     )
    // }

    search({ name }: SearchDto) {
        return this.httpService.get(`${this.apiUrl}/leagues/search/${name}?api_token=${this.apiKey}&include=season`)
            .pipe(map(resp => this.convertToSearchLeagueInterface(resp.data)))
    }

    private getTeamById(teamId: number) {
        if (teamId) {
            return this.httpService.get(`${this.apiUrl}/teams/${teamId}?api_token=${this.apiKey}`)
                .pipe(map(resp => resp.data))
        }
        return of({})
    }

    private getPlayerById(playerId: number) {
        if (playerId) {
            return this.httpService.get(`${this.apiUrl}/players/${playerId}?api_token=${this.apiKey}`)
                .pipe(map(resp => resp.data))
        }
        return of({})
    }

    seasonsOfLeague({ leagueId }: SeasonsOfLeagueDto) {
        return this.httpService.get(`${this.apiUrl}/leagues/${leagueId}?api_token=${this.apiKey}&include=seasons`)
            .pipe(map(resp => this.convertToSeasonsOfLeagueInterface(resp.data)))
    }

    pastChampions(seasonsIds: LeagueSeasonsDto[]) {
        let seasonChampions = [];
        for (let i = 0; i < seasonsIds?.length; i++) {
            seasonChampions.push(new Promise((resolve) => {
                this.httpService.get(`${this.apiUrl}/standings/season/${seasonsIds[i]}?api_token=${this.apiKey}&include=standings.season`).subscribe(res => {
                    const champion = res?.data?.data[0]?.standings?.data.find(d => d.position === 1);
                    resolve(champion);
                })
            }))
        }
        return Promise.all(seasonChampions);
    }


    leagueSeasonDates({ seasonId }: LeagueSeasonDatesDto) {
        return this.httpService.get(`${this.apiUrl}/seasons/${seasonId}?api_token=${this.apiKey}&include=rounds, stats`)
            .pipe(map(resp => this.convertToSeasonsDateOfLeagueInterface(resp.data)))
    }


    private convertToSeasonsDateOfLeagueInterface(data: SeasonStatesInfo): SeasonsDateAndSatesOfLeague | null {
        const seasonDate = data.data;
        const stats = seasonDate.stats?.data;
        const numberOfMatchesPlayed = stats?.number_of_matches_played;
        const numberOfMatches = stats?.number_of_matches;
        const progress = numberOfMatchesPlayed && numberOfMatches && (Math.round(numberOfMatchesPlayed / numberOfMatches * 100 * 100) / 100 + '%');
        if (seasonDate) {
            return {
                numberOfMatchesPlayed,
                numberOfMatches,
                progress,
                startDate: data?.data?.rounds?.data[0]?.start,
                endDate: (data?.data?.rounds?.data[data?.data?.rounds?.data.length - 1])?.end
            }
        }
        return null
    }

    private convertToGeneralInfoInterface(data: any): any | null {
        const curLeague = data.data && data.data[0];
        if (curLeague) {
            const stats = curLeague.season.data?.stats?.data;
            const numberOfMatchesPlayed = stats?.number_of_matches_played;
            const numberOfMatches = stats?.number_of_matches;
            const progress = numberOfMatchesPlayed && numberOfMatches && (Math.round(numberOfMatchesPlayed / numberOfMatches * 100 * 100) / 100 + '%');
            return {
                id: curLeague.id,
                name: curLeague.name,
                logo_path: curLeague.logo_path,
                country: curLeague.country?.data?.name,
                country_flag: curLeague.country?.data?.image_path,
                numberOfMatchesPlayed,
                numberOfMatches,
                progress: progress,
                type: curLeague.type,
                predictability: curLeague.coverage?.predictions
            }
        }
        return null
    }

    private curSeason(seasonId: number, data: OverallStatsData): SeasonOverallStats {
        return data.data.seasons.data.find(d => d.id === seasonId)
    }

    private convertToOverallStatsInterface(
        curSeasonStat: SeasonOverallStats,
        teamWithMostGoals,
        teamWithMostCleanSheets,
        goalkeeperMostCleansheets,
        teamWithMostGoalsPerMatch,
        topscorerPlayer,
        mostConcededGoalsClub,
        mostAssistsPlayer,
        teamMostCorners
    ): ReturnOverallStatsLeague | null {
        return {
            leagueId: curSeasonStat.league_id,
            seasonId: curSeasonStat.id,
            stats: {
                numberOfClubs: curSeasonStat.stats.data.number_of_clubs,
                numberOfMatches: curSeasonStat.stats.data.number_of_matches,
                matchesAlreadyPlayed: curSeasonStat.stats.data.number_of_matches_played,
                numberOfGoals: curSeasonStat.stats.data.number_of_goals,
                avgGoalsPerMatch: curSeasonStat.stats.data.avg_goals_per_match,
                goalScoredEveryMins: curSeasonStat.stats.data.goal_scored_every_minutes,
                mostGoalsByTeam: curSeasonStat.stats.data.team_with_most_goals_number,
                teamWithMostGoals,
                avgHomegoalsPerMatch: curSeasonStat.stats.data.avg_homegoals_per_match,
                avgAwaygoalsPerMatch: curSeasonStat.stats.data.avg_awaygoals_per_match,
                bttsPercentage: curSeasonStat.stats.data.btts,
                mostCleanSheets: curSeasonStat.stats.data.team_most_cleansheets_number,
                teamWithMostCleanSheets,
                goalkeeperMostCleansheetsNumber: curSeasonStat.stats.data.goalkeeper_most_cleansheets_number,
                goalkeeperMostCleansheets,
                avgLeaguePlayerRating: curSeasonStat.stats.data.avg_player_rating,
                teamWithMostGoalsPerMatchNumber: curSeasonStat.stats.data.team_with_most_goals_per_match_number,
                teamWithMostGoalsPerMatch,
                seasonTopscorerNumber: curSeasonStat.stats.data.season_topscorer_number,
                topscorerPlayer,
                teamWithMostConcededGoalsNumber: curSeasonStat.stats.data.team_with_most_conceded_goals_number,
                mostConcededGoalsClub,
                seasonAssistTopscorerNumber: curSeasonStat.stats.data.season_assist_topscorer_number,
                mostAssistsPlayer,
                yellowCards: curSeasonStat.stats.data.number_of_yellowcards,
                avgYellowcardsPerMatch: curSeasonStat.stats.data.avg_yellowcards_per_match,
                yellowReds: curSeasonStat.stats.data.number_of_yellowredcards,
                avgYellowredcardsPerMatch: curSeasonStat.stats.data.avg_yellowredcards_per_match,
                directReds: curSeasonStat.stats.data.number_of_redcards,
                avgRedcardsPerMatch: curSeasonStat.stats.data.avg_redcards_per_match,
                avgCornersPerMatch: curSeasonStat.stats.data.avg_corners_per_match,
                teamMostCornersCount: curSeasonStat.stats.data.team_most_corners_count,
                teamMostCorners,
            }
        }
    }

    private convertToFixturesInterface(page: number, fixtures) {
        if (fixtures.length) {
            const data = fixtures?.map(item => {
                return {
                    id: item.id,
                    dateStart: item.time?.starting_at?.date_time,
                    league: {
                        id: fixtures?.id,
                        logo_path: fixtures?.logo_path
                    },
                    homeTeam: {
                        id: item.localTeam?.data?.id,
                        name: item.localTeam?.data?.name,
                        logo_path: item.localTeam?.data?.logo_path,
                        score: item.scores?.localteam_score
                    },
                    awayTeam: {
                        id: item.visitorTeam?.data?.id,
                        name: item.visitorTeam?.data?.name,
                        logo_path: item.visitorTeam?.data?.logo_path,
                        score: item.scores?.visitorteam_score
                    }
                }
            });
            return { data: data, page }
        }
        return null
    }

    private convertToDetailStatsInterface(data: SeasonData): ReturnDetailStats[] {
        const curSeason = data.data?.length && data.data[0];
        if (curSeason) {
            return curSeason.standings.data
                .filter(item => item.team.data.stats.data.length)
                .map(item => {
                    const teamStat = item.team.data;
                    const stats = teamStat.stats.data;
                    return {
                        id: teamStat.id,
                        name: teamStat.name,
                        logo_path: teamStat.logo_path,
                        position: item?.position,
                        result: item?.result,
                        stats: {
                            btts: stats[0]?.btts,
                            over_2_5: {
                                home: stats[0]?.goal_line?.over['2_5']?.home,
                                away: stats[0]?.goal_line?.over['2_5']?.away,
                            },
                            under_2_5: {
                                home: stats[0]?.goal_line?.under['2_5']?.home,
                                away: stats[0]?.goal_line?.under['2_5']?.away,
                            },
                            failedToScore: {
                                total: stats[0]?.failed_to_score.total,
                                home: stats[0]?.failed_to_score.home,
                                away: stats[0]?.failed_to_score.away,
                            },
                            cleanSheet: {
                                total: stats[0]?.clean_sheet.total,
                                home: stats[0]?.clean_sheet.home,
                                away: stats[0]?.clean_sheet.away,
                            },
                            corners: {
                                total: stats[0]?.total_corners,
                                avPerGame: stats[0]?.avg_corners,
                            },
                            cards: {
                                red: stats[0]?.redcards,
                                yellow: stats[0]?.yellowcards
                            }
                        }
                    }
                })
        }
        return null
    }

    private convertToGeneralStatsInterface(data: SeasonData): ReturnGeneralStats[] {
        const curSeason = data.data?.length && data.data[0];
        if (curSeason) {
            return curSeason.standings.data.map(item => {
                return {
                    id: item.team.data.id,
                    name: item.team.data.name,
                    logo_path: item.team.data.logo_path,
                    position: item.position,
                    result: item.result,
                    recent_form: item.recent_form,
                    stats: {
                        gamesPlayed: item.overall.games_played,
                        wins: item.overall.won,
                        draws: item.overall.draw,
                        losses: item.overall.lost,
                        goalsScored: item.overall.goals_scored,
                        goalsAgainst: item.overall.goals_against,
                        points: item.overall.points,
                    }
                }
            })
        }
        return null
    }

    private convertToSearchLeagueInterface(data: LeagueSearchData): ReturnLeagueSearch {
        const curLeague = data.data?.length && data.data[0];
        if (curLeague) {
            return {
                id: curLeague.id,
                name: curLeague.name,
                currentSeasonId: curLeague.current_season_id,
            }
        }
        return null
    }

    getLeagueSeasons({ leagueId }: LeagueSeasonDto) {
        return this.httpService.get(`${this.apiUrl}/leagues/${leagueId}?api_token=${this.apiKey}&include=seasons`)
            .pipe(map(resp => this.convertToLeagueSeasonInterface(resp.data)))
    }

    private convertToLeagueSeasonInterface(data: any): any {
        const curLeagueSeasons = data?.data?.seasons;
        return curLeagueSeasons?.data.map(item => {
            return {
                seasonId: item.id,
                seasonName: item.name
            }
        })
    }

    private convertToPlayerStatsInterface(team: TeamData, players: { data: Squad[] }): ReturnPlayerStats {
        return {
            team: {
                id: team.data.id,
                logo_path: team.data.logo_path,
                name: team.data.name,
            },
            coach: {
                id: team.data.coach.data.id,
                fullname: team.data.coach.data.fullname,
                image_path: team.data.coach.data.image_path
            },
            players: players.data.map(s => {
                return {
                    id: s?.player_id,
                    number: s?.number,
                    fullName: s?.player?.data?.fullname,
                    image_path: s?.player?.data?.image_path,
                    position: s?.position?.data?.name,
                    gamesPlayed: s?.appearences,
                    goals: s?.goals,
                    assists: s?.assists,
                    cards: (s?.yellowcards || 0) + (s?.redcards || 0),
                    timePlayed: s?.minutes,
                    rating: s?.rating
                }
            })
        }
    }

    private convertToSeasonsOfLeagueInterface(data: LeagueSeasonsData): SeasonOfLeague[] {
        return data.data.seasons.data.map(item => {
            return {
                seasonId: item.id,
                seasonName: item.name
            }
        })
    }
}
