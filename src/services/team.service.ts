import {Injectable} from '@nestjs/common';
import {HttpService} from '@nestjs/axios';
import {map, Observable} from 'rxjs';
import {ReturnUpcoming, TeamUpcomingMatchData} from '../interfaces/upcoming-match.interface';
import {Fixtures, FixturesData, ReturnFixture} from '../interfaces/fixtures.interface';
import {MatchStatisticsDto} from '../dto/match-statistics.dto';
import {UpcomingMatchDto} from '../dto/upcoming-match.dto';
import {
    GoalByMinutesData, GoalProbabilitiesData,
    MatchStatisticsData, PerformanceData, ReturnGoalByMinutes, ReturnGoalProbabilities,
    ReturnMatchStatistics,
    ReturnPerformance, ReturnPlayerStats, Squad,
} from '../interfaces/stats.interface';
import {FixturesDto} from '../dto/fixtures.dto';
import {PerdormanceDto} from '../dto/perdormance.dto';
import {GoalsProbabilitiesDto} from '../dto/goals-probabilities.dto';
import {PlayersDto} from '../dto/players.dto';
import {
    GeneralInfo,
    ReturnGeneralInfo, ReturnLastFixtures,
    ReturnSearchTeam, ReturnSecondaryInfo,
    SearchTeamData, SecondaryInfo, TeamData,
} from '../interfaces/team.interface';
import {CompitationStandingDto} from '../dto/compitation-standing.dto';
import {CompetitionStandingData, ReturnCompetitionStanding} from '../interfaces/competition-standing.interface';
import {SearchDto} from '../dto/search.dto';
import {mergeMap, switchMap} from 'rxjs/operators';
import {GeneralInfoTeamDto} from '../dto/general-info-team.dto';
import {StatusTrophy} from '../interfaces/trophy.interface';
import {SecondaryInfoTeamDto} from '../dto/secondary-info-team.dto';
import {LastFixturesDto} from '../dto/last-fixtures.dto';
import {LeaguePlayersDto} from "../dto/league-players.dto";
enum ResultEnum {
    RESULT = 'RESULT',
    FIXTURE = 'FIXTURE',
}

function replaceCharacters(name: string): string {
    return name.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
}

@Injectable()
export class TeamService {
    private readonly apiKey = process.env.API_KEY;
    private readonly apiUrl = process.env.API_URL;

    constructor(
        private httpService: HttpService,
    ) {
    }

    generalInfo({teamName}: GeneralInfoTeamDto) {
        const name = replaceCharacters(teamName);
        return this.httpService.get(`${this.apiUrl}/teams/search/${name}?api_token=${this.apiKey}&include=coach,venue,country,trophies,rivals,latest:limit(5|1)`)
            .pipe(map((resp) => this.convertToGeneralInfoInterface(resp.data, teamName)));
    }

    secondaryInfo({teamId}: SecondaryInfoTeamDto) {
        return this.httpService.get(`${this.apiUrl}/teams/${teamId}?api_token=${this.apiKey}&include=goalscorers.player,league,stats`)
            .pipe(map((resp) => this.convertToSecondaryInfoInterface(resp.data)));
    }

    lastFixtures({teamName}: LastFixturesDto) {
        const name = replaceCharacters(teamName);
        return this.httpService.get(`${this.apiUrl}/teams/search/${name}?api_token=${this.apiKey}&include=latest:limit(20|1)`)
            .pipe(map((resp) => this.convertToLastFixturesInterface(resp.data)));
    }

    upcomingMatch({teamName}: UpcomingMatchDto): Observable<ReturnUpcoming | null> {
        const includes = [
            'upcoming',
            'upcoming.league',
            'upcoming.venue',
            'upcoming.visitorTeam',
            'upcoming.localTeam',
            'upcoming.odds'
        ];
        const name = replaceCharacters(teamName);
        return this.httpService.get(`${this.apiUrl}/teams/search/${name}?api_token=${this.apiKey}&include=${includes.join(',')}`)
            .pipe(map((resp) => this.convertToUpcomingMatchInterface(resp.data)));
    }

    async fixtures(
        {
            teamId,
            count,
            page,
            leagueId,
            seasonId,
            leagueResult
        }: FixturesDto,
    ){
        const include = [
            'localTeam',
            'visitorTeam',
            'league',
        ];        
        return await new Promise(resolve => {
            const date = new Date();
            let month = date.getMonth()+1;
            const day = date.getDate();
            let firstDay;
            let lastDay;
            if(leagueResult === ResultEnum.RESULT){
                firstDay = `${seasonId}-01-01`;
                lastDay = `${seasonId}-12-31`;
            }else{
                 firstDay = `${seasonId}-${month}-${day}`;
                 lastDay = `${seasonId+1}-12-31`;
            }
        this.httpService.get(`${this.apiUrl}/fixtures/between/${firstDay}/${lastDay}/${teamId}?api_token=${this.apiKey}&include=${include.join(',')}&per_page=${count}&page=${page}&leagues=${leagueId}`)
        .subscribe(res=>{
            let fixtures;                    
            if(leagueResult === ResultEnum.RESULT){
                fixtures = res?.data?.data?.filter(fixture => new Date(`${fixture.time.starting_at.date_time} UTC`) < date );
            }else{
                fixtures = res?.data?.data?.filter(fixture => new Date(`${fixture.time.starting_at.date_time} UTC`) >= date && fixture.scores?.localteam_score <= 0 && fixture.scores?.visitorteam_score <= 0);                
            }
            if(fixtures.length){
                const data = this.convertToFixturesInterface(fixtures);
                resolve(data);
                return data;              
            }
        })
    })
    }

    matchStatistics(
        {teamId, leagueId, seasonId}: MatchStatisticsDto,
    ){
        let promises = [];
        if(seasonId?.length) {
            for (let i = 0; i < seasonId?.length; i++) {
                promises.push(new Promise((resolve) => {
                    return this.httpService.get(`${this.apiUrl}/teams/${teamId}?api_token=${this.apiKey}&include=stats,league&seasons=${seasonId[i]}, visitorFixtures localFixtures`).subscribe(res => {
                        resolve(res.data.data.stats.data);
                    })
                }))
            }
            return this.allMatchStatistics(Promise.all(promises));
        } else {
            const urlInclude = seasonId && typeof seasonId == "number" ? `league&seasons=${seasonId}` : '';
            return this.httpService.get(`${this.apiUrl}/teams/${teamId}?api_token=${this.apiKey}&include=stats,${urlInclude}, visitorFixtures localFixtures`)
                .pipe(map(resp => this.convertToMatchStatisticsInterface(resp.data)));
        }

    }

   async performance(
        {
            teamId,
            leagueId,
            seasonId,
        }: PerdormanceDto) {
        if (seasonId?.length) {
            let promises = [];
            for (let i = 0; i < seasonId?.length; i++) {
                promises.push(new Promise((resolve) => {
                    return this.httpService.get(`${this.apiUrl}/teams/${teamId}?api_token=${this.apiKey}&include=stats,league&seasons=${seasonId[i]}`).subscribe(res => {
                        resolve(res.data.data.stats.data);
                    })
                }))
            }
            return this.allPerformances(Promise.all(promises));
        } else {
                const urlInclude = seasonId && typeof seasonId == "number" ? `league&seasons=${seasonId}` : '';
                return this.httpService.get(`${this.apiUrl}/teams/${teamId}?api_token=${this.apiKey}&include=stats,${urlInclude}`)
                    .pipe(map(resp => this.convertToPerformanceInterface(resp.data)));
        }
    }

    async allMatchStatistics(matchStatistics) {
        const result = {
            attacks: 0,
            dangerousAttacks: 0,
            avPossessionPercent: 0,
            fouls: 0,
            avFoulsPerGame: 0,
            offside: 0,
            redCards: 0,
            yellowCards: 0,
            shotsBlocked: 0,
            shotsOffTarget: 0,
            avShotsOffTarget: 0,
            shotsOnTarget: 0,
            avShotsOnTarget: 0,
            totalCorners: 0,
            avCorners: 0,
            btts: 0,
            avPlayerRatingPerMatch:0,
            tackles: 0,
            goal_line: 0,
            win: 0,
            draw: 0,
            lost: 0,
            avg_goals_per_game_scored: 0,
        };

        const promise = await matchStatistics;
        const stats = [].concat.apply([], promise);
        stats?.forEach(stat => {
                result.attacks += stat?.attacks ?  +stat?.attacks : 0,
                result.dangerousAttacks += stat?.dangerous_attacks ?  +stat?.dangerous_attacks: 0,
                result.avPossessionPercent += stat?.avg_ball_possession_percentage ? +stat?.avg_ball_possession_percentage : 0,
                result.fouls += stat?.fouls? +stat?.fouls : 0,
                result.avFoulsPerGame += stat?.avg_fouls_per_game ?  +stat?.avg_fouls_per_game : 0,
                result.offside += stat?.offsides ? +stat?.offsides : 0,
                result.redCards += stat?.redcards ?  +stat?.redcards : 0,
                result.yellowCards += stat?.yellowcards ? +stat?.yellowcards : 0,
                result.shotsBlocked += stat?.shots_blocked ?  +stat?.shots_blocked : 0,
                result.shotsOffTarget += stat?.shots_off_target ?  +stat?.shots_off_target : 0,
                result.avShotsOffTarget += stat?.avg_shots_off_target_per_game ? +stats?.avg_shots_off_target_per_game : 0,
                result.shotsOnTarget += stat?.shots_on_target ? +stat?.shots_on_target : 0,
                result.avShotsOnTarget += stat?.avg_shots_on_target_per_game ?  +stat?.avg_shots_on_target_per_game : 0,
                result.totalCorners += stat?.total_corners ? +stat?.total_corners : 0,
                result.avCorners += stat?.avg_corners ?  +stat?.avg_corners : 0,
                result.btts +=  stat?.btts ? +stat?.btts : 0,
                result.avPlayerRatingPerMatch += stat?.avg_player_rating_per_match ?  +stat?.avg_player_rating_per_match : 0,
                result.tackles += stat?.tackles ? +stat?.tackles : 0

        });

        return {
            stats: {
                attacks: result?.attacks,
                dangerousAttacks: result?.dangerousAttacks,
                avPossessionPercent: (result?.avPossessionPercent / stats.length).toFixed(2),
                fouls: result?.fouls,
                avFoulsPerGame: (result?.avFoulsPerGame / stats.length).toFixed(2),
                offside: result?.offside,
                redCards: result?.redCards,
                yellowCards: result?.yellowCards,
                shotsBlocked: result?.shotsBlocked,
                shotsOffTarget: result?.shotsOffTarget,
                avShotsOffTarget: (stats?.avShotsOffTarget / stats.length).toFixed(2),
                shotsOnTarget: result?.shotsOnTarget,
                avShotsOnTarget: (result?.avShotsOnTarget / stats.length).toFixed(2),
                totalCorners: result?.totalCorners,
                avCorners: (result?.avCorners / stats.length).toFixed(2),
                btts: result?.btts.toFixed(2),
                avPlayerRatingPerMatch: (result?.avPlayerRatingPerMatch / stats.length).toFixed(2),
                tackles: result?.tackles,
            },
        };
    }

   async allPerformances(performances) {
       const result = {
            winOveral: 0,
            winHome: 0,
            winAway: 0,
            drawOveral: 0,
            drawHome: 0,
            drawAway: 0,
            lostOveral: 0,
            lostHome: 0,
            lostAway: 0,
            goalsForOveral: 0,
            goalsForHome: 0,
            goalsForAway: 0,
            goalsAgainstOveral: 0,
            goalsAgainstHome: 0,
            goalsAgainstAway: 0,
            cleanSheetOveral: 0,
            cleanSheetHome: 0,
            cleanSheetAway: 0,
            failedToScoreOveral: 0,
            failedToScoreHome: 0,
            failedToScoreAway: 0,
            avgGoalsPerGameScoredOverall: 0,
            avgGoalsPerGameScoredHome: 0,
            avgGoalsPerGameScoredAway: 0,
            avGoalsConcededOverall: 0,
            avGoalsConcededHome: 0,
            avGoalsConcededAway: 0,
            avFirstGoalsScoredOverall: 0,
            avFirstGoalsScoredHome: 0,
            avFirstGoalsScoredAway: 0,
            avFirstGoalsConcededOverall: 0,
            avFirstGoalsConcededHome: 0,
            avFirstGoalsConcededAway: 0,
       };

       const promise = await performances;
            const stats = [].concat.apply([], promise);
            stats?.forEach(stat => {
                result.winOveral += +stat.win.total;
                result.winHome += +stat.win.home;
                result.winAway += +stat.win.away;
                result.drawOveral += +stat.draw.total;
                result.drawHome += +stat.draw.home;
                result.drawAway += +stat.draw.away;
                result.lostOveral += +stat.lost.total;
                result.lostHome += +stat.lost.home;
                result.lostAway += +stat.lost.away;
                result.goalsForOveral += +stat.goals_for.total;
                result.goalsForHome += +stat.goals_for.home;
                result.goalsForAway += +stat.goals_for.away;
                result.goalsAgainstOveral += +stat.goals_against.total;
                result.goalsAgainstHome += +stat.goals_against.home;
                result.goalsAgainstAway += +stat.goals_against.away;
                result.cleanSheetOveral += stat?.clean_sheet ? +stat?.clean_sheet?.total : 0;
                result.cleanSheetHome += stat?.clean_sheet ? +stat?.clean_sheet?.home : 0;
                result.cleanSheetAway += stat?.clean_sheet ? +stat?.clean_sheet?.away : 0;
                result.failedToScoreOveral += +stat?.failed_to_score?.total;
                result.failedToScoreHome += +stat?.failed_to_score?.home;
                result.failedToScoreAway += +stat?.failed_to_score?.away;
                result.avgGoalsPerGameScoredOverall += stat?.avg_goals_per_game_scored ? +stat?.avg_goals_per_game_scored?.total : 0;
                result.avgGoalsPerGameScoredHome += stat?.avg_goals_per_game_scored ?  +stat?.avg_goals_per_game_scored?.home : 0;
                result.avgGoalsPerGameScoredAway += stat?.avg_goals_per_game_scored ? +stat?.avg_goals_per_game_scored?.away : 0;
                result.avGoalsConcededOverall += stat?.avg_goals_per_game_conceded ? +stat?.avg_goals_per_game_conceded?.total : 0;
                result.avGoalsConcededHome += stat?.avg_goals_per_game_conceded ? +stat?.avg_goals_per_game_conceded?.home : 0;
                result.avGoalsConcededAway += stat?.avg_goals_per_game_conceded ? +stat?.avg_goals_per_game_conceded?.away : 0;
                result.avFirstGoalsScoredOverall += stat?.avg_first_goal_scored ? +stat?.avg_first_goal_scored.total.match(/(\d+)/)?.[0] : 0;
                result.avFirstGoalsScoredHome += stat?.avg_first_goal_scored ? +stat?.avg_first_goal_scored.home.match(/(\d+)/)?.[0] : 0;
                result.avFirstGoalsScoredAway += stat?.avg_first_goal_scored ? +stat?.avg_first_goal_scored.away.match(/(\d+)/)?.[0] : 0;
                result.avFirstGoalsConcededOverall += stat?.avg_first_goal_conceded ? +stat?.avg_first_goal_conceded.total.match(/(\d+)/)?.[0] : 0;
                result.avFirstGoalsConcededHome += stat?.avg_first_goal_conceded ? +stat?.avg_first_goal_conceded.home.match(/(\d+)/)?.[0] : 0;
                result.avFirstGoalsConcededAway += stat?.avg_first_goal_conceded ? +stat?.avg_first_goal_conceded.away.match(/(\d+)/)?.[0] : 0;
            });
             return {
                 teamId: promise[0]?.teamId,
                 leagueId: promise[0]?.league?.data.id,
                 wins: {
                     overall: result.winOveral,
                     home: result.winHome,
                     away: result.winAway,
                 },
                 draw: {
                     overall: result.drawOveral,
                     home: result.drawHome,
                     away: result.drawAway,
                 },
                 lost: {
                     overall: result.lostOveral,
                     home: result.lostHome,
                     away: result.lostAway,
                 },
                 goalsFor: {
                     overall: result.goalsForOveral,
                     home: result.goalsAgainstHome,
                     away: result.goalsForAway
                 },
                 goalsAgainst: {
                     overall: result.goalsAgainstOveral,
                     home: result.goalsAgainstHome,
                     away: result.goalsForAway
                 },
                 cleanSheet: {
                     overall: result.cleanSheetOveral,
                     home: result.cleanSheetHome,
                     away: result.cleanSheetAway
                 },
                 failedToScore: {
                     overall: result.failedToScoreOveral,
                     home: result.failedToScoreHome,
                     away: result.failedToScoreAway,
                 },
                 avGoalsScored: {
                     overall: (result.avgGoalsPerGameScoredOverall / stats?.length).toFixed(2),
                     home: (result.avgGoalsPerGameScoredHome / stats?.length).toFixed(2),
                     away: (result.avgGoalsPerGameScoredAway / stats?.length).toFixed(2),
                 },
                 avGoalsConceded: {
                     overall: (result.avGoalsConcededOverall / stats.length).toFixed(2),
                     home: (result.avGoalsConcededHome / stats.length).toFixed(2),
                     away: (result.avGoalsConcededAway / stats.length).toFixed(2),
                 },
                 avFirstGoalsScored: {
                     overall: (result.avFirstGoalsScoredOverall / stats.length).toFixed(2) + 'm',
                     home: (result.avFirstGoalsScoredHome / stats.length).toFixed(2) + 'm',
                     away: (result.avFirstGoalsScoredAway / stats.length).toFixed(2) + 'm',
                 },
                 avFirstGoalsConceded: {
                     overall: (result.avFirstGoalsConcededOverall / stats.length).toFixed(2) + 'm',
                     home: (result.avFirstGoalsConcededHome / stats.length).toFixed(2) + 'm',
                     away: (result.avFirstGoalsConcededAway / stats.length).toFixed(2) + 'm',
                 },
             }
    }

    goalsByMinutes(
        {
            teamId,
            leagueId,
            seasonId,
        }: PerdormanceDto) {
        let promises = [];
        if(seasonId?.length) {
            for (let i = 0; i < seasonId?.length; i++) {
                promises.push(new Promise((resolve) => {
                    return this.httpService.get(`${this.apiUrl}/teams/${teamId}?api_token=${this.apiKey}&include=stats,league&seasons=${seasonId[i]}`).subscribe(res => {
                        resolve(res.data.data.stats.data);
                    })
                }))
            }
            return this.allGoalMinutes(Promise.all(promises));
        } else {
            const urlInclude = seasonId && typeof seasonId == "number" ? `league&seasons=${seasonId}` : '';
            return this.httpService.get(`${this.apiUrl}/teams/${teamId}?api_token=${this.apiKey}&include=stats,${urlInclude}`)
                .pipe(map(resp => this.convertToGoalByMinutesInterface(resp.data)));
        }
    }

    async allGoalMinutes(data) {
        const promise = await data;
        const stats = [].concat.apply([], promise);
        let arr = [];
        let arr2 = [];
        stats?.forEach(stat => {
            stat?.goals_conceded_minutes?.forEach(p => arr.push(p?.period));
            stat?.scoring_minutes?.forEach(p => arr2.push(p?.period));

        });

        const array = [].concat.apply([], arr);
        const array2 = [].concat.apply([], arr2);
        const resScored = [...array.reduce((map, item) => {
            const key = `${item.minute}`;
            const prev = map.get(key);
            map.set(key, !prev ? item : { ...item,
                count: +prev?.count + +item?.count,
                percentage: +prev?.percentage + +item?.percentage});
            return map;
        }, new Map)
            .values()
        ];

        const resConceded = [...array2.reduce((map, item) => {
            const key = `${item.minute}`;
            const prev = map.get(key);
            map.set(key, !prev ? item : { ...item,
                count: +prev?.count + +item?.count,
                percentage: +prev?.percentage + +item?.percentage});
            return map;
        }, new Map)
            .values()
        ];

        let resData = resScored.map((elem, index) => ({minute: elem.minute, concededCount: (elem.count.toFixed(2) / stats.length).toFixed(2), concededPercent: (elem.percentage.toFixed(2) / stats.length).toFixed(2), scoringCount: (resConceded[index].count.toFixed(2) / stats.length).toFixed(2), scoringPercent: (resConceded[index].percentage.toFixed(2) / stats.length).toFixed(2)}));

        return {
                period : resData
        }
    }


    goalsProbabilities(
        {
            teamId,
            leagueId,
            seasonId,
        }: GoalsProbabilitiesDto) {
        let promises = [];
        if(seasonId?.length) {
            for (let i = 0; i < seasonId?.length; i++) {
                promises.push(new Promise((resolve) => {
                    return this.httpService.get(`${this.apiUrl}/teams/${teamId}?api_token=${this.apiKey}&include=stats,league&seasons=${seasonId[i]}`).subscribe(res => {
                        resolve(res.data.data.stats.data);
                    })
                }))
            }
            return this.allProbabilities(Promise.all(promises));
        } else {
            const urlIncludeSeason = seasonId && typeof seasonId == "number" ? `seasons=${seasonId}` : '';
            const urlIncludeLeague = leagueId  && typeof leagueId == "number" ? `league=${leagueId}` : '';
            return this.httpService.get(`${this.apiUrl}/teams/${teamId}?api_token=${this.apiKey}&include=stats,${urlIncludeLeague}&${urlIncludeSeason}`)
                .pipe(map(resp => this.convertToGoalsProbabilitiesInterface(resp.data)));
        }

    }

    async allProbabilities(performances) {
        const result = {
            home_over_0_5: 0,
            home_over_1_5: 0,
            home_over_2_5: 0,
            home_over_3_5: 0,
            home_over_4_5: 0,
            home_over_5_5: 0,
            home_under_0_5: 0,
            home_under_1_5: 0,
            home_under_2_5: 0,
            home_under_3_5: 0,
            home_under_4_5: 0,
            home_under_5_5: 0,
            away_over_0_5: 0,
            away_over_1_5: 0,
            away_over_2_5: 0,
            away_over_3_5: 0,
            away_over_4_5: 0,
            away_over_5_5: 0,
            away_under_0_5: 0,
            away_under_1_5: 0,
            away_under_2_5: 0,
            away_under_3_5: 0,
            away_under_4_5: 0,
            away_under_5_5: 0,
        };
        const promise = await performances;
        const stats = [].concat.apply([], promise);
        stats?.forEach(stat => {
            result.home_over_0_5 += stat.goal_line?.over ? +stat.goal_line?.over['0_5']?.home : 0;
            result.home_over_1_5 += stat.goal_line?.over ? +stat?.goal_line?.over['1_5']?.home: 0;
            result.home_over_2_5 += stat.goal_line?.over ?  +stat?.goal_line?.over['2_5']?.home : 0;
            result.home_over_3_5 += (stat.goal_line?.over && stats?.goal_line?.over['3_5']?.home) ?  +stats?.goal_line?.over['3_5']?.home : 0;
            result.home_over_4_5 += (stat.goal_line?.over && stats?.goal_line?.over['4_5']?.home) ? +stats?.goal_line?.over['4_5']?.home : 0;
            result.home_over_5_5 += (stat.goal_line?.over && stats?.goal_line?.over['5_5']?.home)? +stats?.goal_line?.over['5_5']?.home : 0;
            result.home_under_0_5 += stat?.goal_line?.under ? +stat?.goal_line?.under['0_5']?.home : 0;
            result.home_under_1_5 += stat?.goal_line?.under ? +stat?.goal_line?.under['1_5']?.home : 0;
            result.home_under_2_5 += stat?.goal_line?.under ? +stat?.goal_line?.under['2_5']?.home : 0;
            result.home_under_3_5 += stat?.goal_line?.under ? +stat?.goal_line?.under['3_5']?.home : 0;
            result.home_under_4_5 += stat?.goal_line?.under ? +stat?.goal_line?.under['4_5']?.home : 0;
            result.home_under_5_5 += stat?.goal_line?.under ? +stat?.goal_line?.under['5_5']?.home : 0;
            result.away_over_0_5 += stat?.goal_line?.over ? +stat?.goal_line?.over['0_5']?.away : 0;
            result.away_over_1_5 += stat?.goal_line?.over ? +stat?.goal_line?.over['1_5']?.away : 0;
            result.away_over_2_5 += stat?.goal_line?.over ? +stat?.goal_line?.over['2_5']?.away : 0;
            result.away_over_3_5 += stat?.goal_line?.over ? +stat?.goal_line?.over['3_5']?.away : 0;
            result.away_over_4_5 += stat?.goal_line?.over ? +stat?.goal_line?.over['4_5']?.away : 0;
            result.away_over_5_5 += stat?.goal_line?.over ? +stat?.goal_line?.over['5_5']?.away : 0;
            result.away_under_0_5 += stat?.goal_line?.under ? +stat?.goal_line?.under['0_5']?.away : 0;
            result.away_under_1_5 += stat?.goal_line?.under ? +stat?.goal_line?.under['1_5']?.away : 0;
            result.away_under_2_5 += stat?.goal_line?.under ? +stat?.goal_line?.under['2_5']?.away : 0;
            result.away_under_3_5 += stat?.goal_line?.under ? +stat?.goal_line?.under['3_5']?.away : 0;
            result.away_under_4_5 += stat?.goal_line?.under ? +stat?.goal_line?.under['4_5']?.away : 0;
            result.away_under_5_5 += stat?.goal_line?.under ? +stat?.goal_line?.under['5_5']?.away : 0;
        });
        return {
            teamId: stats[0]?.team_id,
            leagueId: stats[0]?.league?.data?.id,
            seasonId: stats[0]?.season_id,
            stats: {
                home: {
                    over_0_5: (result.home_over_0_5 / stats.length).toFixed(2),
                    over_1_5: (result.home_over_1_5 / stats.length).toFixed(2),
                    over_2_5: (result.home_over_2_5 / stats.length).toFixed(2),
                    over_3_5: (result.home_over_3_5 / stats.length).toFixed(2),
                    over_4_5: (result.home_over_4_5 / stats.length).toFixed(2),
                    over_5_5: (result.home_over_5_5 / stats.length).toFixed(2),
                    under_0_5:( result.home_under_0_5 / stats.length).toFixed(2),
                    under_1_5: (result.home_under_1_5 / stats.length).toFixed(2),
                    under_2_5: (result.home_under_2_5 / stats.length).toFixed(2),
                    under_3_5: (result.home_under_3_5 / stats.length).toFixed(2),
                    under_4_5: (result.home_under_4_5 / stats.length).toFixed(2),
                    under_5_5: (result.home_under_5_5 / stats.length).toFixed(2),
                },
                away: {
                    over_0_5: (result.away_over_0_5 / stats.length).toFixed(2),
                    over_1_5: (result.away_over_1_5 / stats.length).toFixed(2),
                    over_2_5: (result.away_over_2_5 / stats.length).toFixed(2),
                    over_3_5: (result.away_over_3_5 / stats.length).toFixed(2),
                    over_4_5: (result.away_over_4_5 / stats.length).toFixed(2),
                    over_5_5: (result.away_over_5_5 / stats.length).toFixed(2),
                    under_0_5: (result.away_under_0_5 / stats.length).toFixed(2),
                    under_1_5: (result.away_under_1_5 / stats.length).toFixed(2),
                    under_2_5: (result.away_under_2_5 / stats.length).toFixed(2),
                    under_3_5: (result.away_under_3_5 / stats.length).toFixed(2),
                    under_4_5: (result.away_under_4_5 / stats.length).toFixed(2),
                    under_5_5: (result.away_under_5_5 / stats.length).toFixed(2),
                },

            }
        }
    }


    playerStatsLeague({seasonId}: LeaguePlayersDto) {
        let teams = [];
        let players = [];
        return this.httpService.get(`${this.apiUrl}/teams/season/${seasonId}?api_token=${this.apiKey}`)
            .pipe(
                map(resp => {
                    teams = resp.data.data;
                    for (let i = 0; i < teams.length; i++) {
                        players.push(new Promise((resolve) => {
                            this.httpService.get(`${this.apiUrl}/squad/season/${seasonId}/team/${teams[i].id}?api_token=${this.apiKey}&include=player.team.coach`).subscribe(res => {
                                resolve(res.data.data);
                            })
                        }))
                    }
                    return Promise.all(players);
                }),
            );
    }


    playerStats({teamId, seasonId}: PlayersDto) {
        let players;
        return this.httpService.get(`${this.apiUrl}/squad/season/${seasonId}/team/${teamId}?api_token=${this.apiKey}&include=player`)
            .pipe(
                map(resp => resp.data),
                switchMap((data) => {
                    players = data;
                    return this.httpService.get(`${this.apiUrl}/teams/${teamId}?api_token=${this.apiKey}&include=coach`);
                }),
                map(resp => this.convertToPlayerStatsInterface(resp.data, players)),
            );
    }

    competitionStandings(
        {
            count,
            offset,
            seasonId,
            leagueId,
        }: CompitationStandingDto) {
        return this.httpService.get(`${this.apiUrl}/standings/season/${seasonId}?api_token=${this.apiKey}&include=standings.team&leagues=${leagueId}`)
            .pipe(map(resp => this.convertToCompetitionStandingInterface(count, offset, resp.data)));
    }

    search({name}: SearchDto) {
        const teamName = replaceCharacters(name);
        return this.httpService.get(`${this.apiUrl}/teams/search/${teamName}?api_token=${this.apiKey}&include=league`)
            .pipe(map(resp => this.convertToSearchTeamInterface(resp.data, name)));
    }

    private convertToUpcomingMatchInterface(data: TeamUpcomingMatchData): ReturnUpcoming | null {
        if (data?.data && data?.data?.length) {
            const curTeam = data.data[0];
            if (curTeam && curTeam.upcoming?.data.length) {
                const teamUpcoming = curTeam.upcoming.data;
                const filteredUpcoming = teamUpcoming.filter(match => new Date(`${match.time.starting_at.date_time} UTC`) > new Date);
                const curUpcoming = filteredUpcoming && filteredUpcoming[0];
                const odds = curUpcoming?.odds?.data[0]?.bookmaker?.data[0]?.odds?.data;
                return {
                    id: curUpcoming?.id,
                    firstTeam: {
                        id: curUpcoming?.localTeam?.data.id,
                        name: curUpcoming?.localTeam?.data.name,
                        logo_path: curUpcoming?.localTeam?.data.logo_path,
                        odd: odds?.[0]?.value
                    },
                    secondTeam: {
                        id: curUpcoming?.visitorTeam?.data.id,
                        name: curUpcoming?.visitorTeam?.data.name,
                        logo_path: curUpcoming?.visitorTeam?.data.logo_path,
                        odd: odds?.[2]?.value
                    },
                    league: {
                        id: curUpcoming?.league?.data.id,
                        name: curUpcoming?.league?.data.name,
                        logo_path: curUpcoming?.league?.data.logo_path,
                    },
                    date: curUpcoming?.time?.starting_at.date,
                    time: curUpcoming?.time?.starting_at.time,
                    city: curUpcoming?.venue?.data.city,
                };
            }
        }
        return null;
    }

    private convertToFixturesInterface(data: Fixtures[]): ReturnFixture[] {

        return data.map(item => {
            return {
                id: item.id,
                dateStart: item.time?.starting_at?.date_time,
                league: {
                    id: item.league?.data?.id,
                    logo_path: item.league?.data?.logo_path,
                },
                homeTeam: {
                    id: item.localTeam?.data?.id,
                    name: item.localTeam?.data?.name,
                    logo_path: item.localTeam?.data?.logo_path,
                    score: item.scores?.localteam_score,
                },
                awayTeam: {
                    id: item.visitorTeam?.data?.id,
                    name: item.visitorTeam?.data?.name,
                    logo_path: item.visitorTeam?.data?.logo_path,
                    score: item.scores?.visitorteam_score,
                },
            };
        });
    }

    private convertToMatchStatisticsInterface(data: MatchStatisticsData): ReturnMatchStatistics | {} {
        const stats = data.data?.stats?.data?.length && data.data.stats.data[0];
        if (stats) {
            return {
                teamId: data.data.id,
                leagueId: data.data?.league?.data.id,
                seasonId: stats?.season_id,
                stats: {
                    attacks: stats?.attacks,
                    dangerousAttacks: stats?.dangerous_attacks,
                    avPossessionPercent: stats?.avg_ball_possession_percentage,
                    fouls: stats?.fouls,
                    avFoulsPerGame: stats?.avg_fouls_per_game,
                    offside: stats?.offsides,
                    redCards: stats?.redcards,
                    yellowCards: stats?.yellowcards,
                    shotsBlocked: stats?.shots_blocked,
                    shotsOffTarget: stats?.shots_off_target,
                    avShotsOffTarget: stats?.avg_shots_off_target_per_game,
                    shotsOnTarget: stats?.shots_on_target,
                    avShotsOnTarget: stats?.avg_shots_on_target_per_game,
                    totalCorners: stats?.total_corners,
                    avCorners: stats?.avg_corners,
                    btts: stats?.btts,
                    avPlayerRatingPerMatch: stats?.avg_player_rating_per_match,
                    tackles: stats?.tackles,
                    goal_line: stats.goal_line,
                    win: stats.win,
                    draw: stats.draw,
                    lost: stats.lost,
                    avg_goals_per_game_scored: stats.avg_goals_per_game_scored
                },
            };
        } else {
            return {};
        }
    }

    private convertToPerformanceInterface(data: PerformanceData): ReturnPerformance | {} {
        const stats = data.data?.stats?.data?.length && data.data.stats.data[0];
        if (stats) {
            return {
                teamId: data.data.id,
                leagueId: data.data?.league?.data.id,
                wins: {
                    overall: stats?.win?.total,
                    home: stats?.win?.home,
                    away: stats?.win?.away,
                },
                draw: {
                    overall: stats?.draw?.total,
                    home: stats?.draw?.home,
                    away: stats?.draw?.away,
                },
                lost: {
                    overall: stats?.lost?.total,
                    home: stats?.lost?.home,
                    away: stats?.lost?.away,
                },
                goalsFor: {
                    overall: stats?.goals_for?.total,
                    home: stats?.goals_for?.home,
                    away: stats?.goals_for?.away,
                },
                goalsAgainst: {
                    overall: stats?.goals_against?.total,
                    home: stats?.goals_against?.home,
                    away: stats?.goals_against?.away,
                },
                cleanSheet: {
                    overall: stats?.clean_sheet?.total,
                    home: stats?.clean_sheet?.home,
                    away: stats?.clean_sheet?.away,
                },
                failedToScore: {
                    overall: stats?.failed_to_score?.total,
                    home: stats?.failed_to_score?.home,
                    away: stats?.failed_to_score?.away,
                },
                avGoalsScored: {
                    overall: stats?.avg_goals_per_game_scored?.total,
                    home: stats?.avg_goals_per_game_scored?.home,
                    away: stats?.avg_goals_per_game_scored?.away,
                },
                avGoalsConceded: {
                    overall: stats?.avg_goals_per_game_conceded?.total,
                    home: stats?.avg_goals_per_game_conceded?.home,
                    away: stats?.avg_goals_per_game_conceded?.away,
                },
                avFirstGoalsScored: {
                    overall: stats?.avg_first_goal_scored?.total,
                    home: stats?.avg_first_goal_scored?.home,
                    away: stats?.avg_first_goal_scored?.away,
                },
                avFirstGoalsConceded: {
                    overall: stats?.avg_first_goal_conceded?.total,
                    home: stats?.avg_first_goal_conceded?.home,
                    away: stats?.avg_first_goal_conceded?.away,
                },
            };
        } else {
            return {};
        }
    }

    private convertToGoalByMinutesInterface(data: GoalByMinutesData): ReturnGoalByMinutes | {} {
        const stats = data.data?.stats?.data?.length && data.data.stats.data[0];
        const goals = stats?.goals_conceded_minutes?.length && stats?.goals_conceded_minutes[0];
        if (goals) {
            return {
                name: data.data.name,
                teamId: data.data.id,
                leagueId: data.data?.league?.data.id,
                seasonId: stats?.season_id,
                period: goals?.period.length && goals.period.map((g, i) => {
                    return {
                        minute: g.minute,
                        scoringCount: stats.scoring_minutes[0].period[i].count,
                        scoringPercent: stats.scoring_minutes[0].period[i].percentage,
                        concededCount: g.count,
                        concededPercent: g.percentage,
                    };
                }),
            };
        } else {
            return {};
        }
    }

    private convertToGoalsProbabilitiesInterface(data: GoalProbabilitiesData): ReturnGoalProbabilities | {} {
        const stats = data.data?.stats?.data?.length && data.data.stats.data[0];
        if (stats) {
            return {
                teamId: data.data.id,
                leagueId: data.data?.league?.data.id,
                seasonId: stats?.season_id,
                stats: {
                    home: {
                        over_0_5: stats?.goal_line?.over['0_5'].home,
                        over_1_5: stats?.goal_line?.over['1_5'].home,
                        over_2_5: stats?.goal_line?.over['2_5'].home,
                        over_3_5: stats?.goal_line?.over['3_5'].home,
                        over_4_5: stats?.goal_line?.over['4_5'].home,
                        over_5_5: stats?.goal_line?.over['5_5'].home,
                        under_0_5: stats?.goal_line?.under['0_5'].home,
                        under_1_5: stats?.goal_line?.under['1_5'].home,
                        under_2_5: stats?.goal_line?.under['2_5'].home,
                        under_3_5: stats?.goal_line?.under['3_5'].home,
                        under_4_5: stats?.goal_line?.under['4_5'].home,
                        under_5_5: stats?.goal_line?.under['5_5'].home,
                    },
                    away: {
                        over_0_5: stats?.goal_line?.over['0_5'].away,
                        over_1_5: stats?.goal_line?.over['1_5'].away,
                        over_2_5: stats?.goal_line?.over['2_5'].away,
                        over_3_5: stats?.goal_line?.over['3_5'].away,
                        over_4_5: stats?.goal_line?.over['4_5'].away,
                        over_5_5: stats?.goal_line?.over['5_5'].away,
                        under_0_5: stats?.goal_line?.under['0_5'].away,
                        under_1_5: stats?.goal_line?.under['1_5'].away,
                        under_2_5: stats?.goal_line?.under['2_5'].away,
                        under_3_5: stats?.goal_line?.under['3_5'].away,
                        under_4_5: stats?.goal_line?.under['4_5'].away,
                        under_5_5: stats?.goal_line?.under['5_5'].away,
                    },
                },
            };
        } else {
            return {};
        }
    }

    private convertToPlayerStatsInterface(team: TeamData, players: { data: Squad[] }): ReturnPlayerStats {
        return {
            team: {
                id: team.data.id,
                logo_path: team.data.logo_path,
                name: team.data.name,
            },
            coach: {
                id: team?.data?.coach?.data?.id,
                fullname: team?.data?.coach?.data?.fullname,
                image_path: team?.data?.coach?.data?.image_path,
            },
            players: players?.data?.map(s => {
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
                    rating: s?.rating,
                };
            }),
        };
    }

    private convertToGeneralInfoInterface(data: GeneralInfo, name: string) {
        const team = data?.data?.filter(team => team.name.toLowerCase() === name.toLowerCase())?.[0];
        return {
            id: team?.id,
            name: team?.name,
            venue: {
                name: team?.venue?.data?.name,
                photo: team?.venue?.data?.image_path,
                capacity: team?.venue?.data?.capacity,
                city: team?.venue?.data?.city,
                country: team?.country?.data?.name,
            },
            coach: {
                id: team?.coach?.data?.id,
                lastName: team?.coach?.data?.fullname,
            },
            latest: team?.latest.data,
            trophies: team?.trophies.data
                .filter(d => d.status === StatusTrophy.Winner)
                .map(d => {
                    return {
                        league_id: d.league_id,
                        league_name: d.league,
                        count: d.times,
                    };
                }),
            rivals: team?.rivals.data
                .map(r => {
                    return {
                        id: r.id,
                        name: r.name,
                    };
                }),
        };
    }

    private convertToCompetitionStandingInterface(
        count: number,
        offset: number,
        data: CompetitionStandingData,
    ): ReturnCompetitionStanding[] {
        const standingsData = data?.data?.length && data?.data?.map(s => s?.standings?.data);
        if (standingsData.length) {
            const standings = [].concat.apply([], standingsData);
        if (standings) {
            return standings.map(s => {
                return {
                    id: s?.team?.data?.id,
                    name: s?.team?.data?.name,
                    logo_path: s.team?.data?.logo_path,
                    rank: s.position,
                    gamesPlayed: s.overall.games_played,
                    points: s.overall.points,
                    wins: s.overall.won,
                    draws: s.overall.draw,
                    losses: s.overall.lost,
                    goalsDifference: s.total.goal_difference,
                    goalsTotal: s.overall.goals_scored,
                    result: s.result,
                };
            }).filter((_, i) => i >= offset - 1 && i < offset + count - 1);
        } else {
            return [];
        }
        }
    }

    private convertToSearchTeamInterface(data: SearchTeamData, name: string): ReturnSearchTeam {
        const team = data?.data?.filter(team => team.name.toLowerCase() === name.toLowerCase())?.[0];
        return {
            id: team?.id,
            leagueId: team?.league?.data?.id,
            seasonId: team?.current_season_id,
            name: team?.name,
        };
    }

    private lastTeamForm(data: Fixtures[], teamId: number, column = 'localteam_id') {
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

    private convertToSecondaryInfoInterface(data: SecondaryInfo): ReturnSecondaryInfo | {} {
        const curData = data.data.goalscorers?.data;
        const topScorer = curData?.find(d => d.goals === Math.max(
            ...curData.map(obj => obj.goals)
        ))
        if (data?.data) {
            return {
                topScorer: topScorer,
                league: data.data.league,
                name: data.data.name,
                seasonId: data.data.current_season_id,
                teamId: data.data.id
            };
        }
        return {};
    }

    private convertToLastFixturesInterface(data: GeneralInfo): ReturnLastFixtures | {} {
        const team = data.data?.length && data.data[0];
        if (team) {
            return {
                homeForm: this.lastTeamForm(team.latest.data, team.id),
                awayForm: this.lastTeamForm(team.latest.data, team.id, 'visitorteam_id'),
            };
        }
        return {};
    }
}
