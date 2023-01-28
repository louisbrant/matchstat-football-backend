import { HttpService } from '@nestjs/axios';
import { Observable } from 'rxjs';
import { ReturnUpcoming } from '../interfaces/upcoming-match.interface';
import { Fixtures } from '../interfaces/fixtures.interface';
import { MatchStatisticsDto } from '../dto/match-statistics.dto';
import { UpcomingMatchDto } from '../dto/upcoming-match.dto';
import { ReturnGoalByMinutes, ReturnGoalProbabilities, ReturnMatchStatistics, ReturnPerformance, ReturnPlayerStats } from '../interfaces/stats.interface';
import { FixturesDto } from '../dto/fixtures.dto';
import { PerdormanceDto } from '../dto/perdormance.dto';
import { GoalsProbabilitiesDto } from '../dto/goals-probabilities.dto';
import { PlayersDto } from '../dto/players.dto';
import { ReturnLastFixtures, ReturnSearchTeam, ReturnSecondaryInfo } from '../interfaces/team.interface';
import { CompitationStandingDto } from '../dto/compitation-standing.dto';
import { ReturnCompetitionStanding } from '../interfaces/competition-standing.interface';
import { SearchDto } from '../dto/search.dto';
import { GeneralInfoTeamDto } from '../dto/general-info-team.dto';
import { SecondaryInfoTeamDto } from '../dto/secondary-info-team.dto';
import { LastFixturesDto } from '../dto/last-fixtures.dto';
import { LeaguePlayersDto } from "../dto/league-players.dto";
export declare class TeamService {
    private httpService;
    private readonly apiKey;
    private readonly apiUrl;
    constructor(httpService: HttpService);
    generalInfo({ teamName }: GeneralInfoTeamDto): Observable<{
        id: number;
        name: string;
        venue: {
            name: string;
            photo: string;
            capacity: number;
            city: string;
            country: string;
        };
        coach: {
            id: number;
            lastName: string;
        };
        latest: Fixtures[];
        trophies: {
            league_id: number;
            league_name: string;
            count: number;
        }[];
        rivals: {
            id: number;
            name: string;
        }[];
    }>;
    secondaryInfo({ teamId }: SecondaryInfoTeamDto): Observable<{} | ReturnSecondaryInfo>;
    lastFixtures({ teamName }: LastFixturesDto): Observable<{} | ReturnLastFixtures>;
    upcomingMatch({ teamName }: UpcomingMatchDto): Observable<ReturnUpcoming | null>;
    fixtures({ teamId, count, page, leagueId, seasonId, leagueResult }: FixturesDto): Promise<unknown>;
    matchStatistics({ teamId, leagueId, seasonId }: MatchStatisticsDto): Promise<{
        stats: {
            attacks: number;
            dangerousAttacks: number;
            avPossessionPercent: string;
            fouls: number;
            avFoulsPerGame: string;
            offside: number;
            redCards: number;
            yellowCards: number;
            shotsBlocked: number;
            shotsOffTarget: number;
            avShotsOffTarget: string;
            shotsOnTarget: number;
            avShotsOnTarget: string;
            totalCorners: number;
            avCorners: string;
            btts: string;
            avPlayerRatingPerMatch: string;
            tackles: number;
        };
    }> | Observable<{} | ReturnMatchStatistics>;
    performance({ teamId, leagueId, seasonId, }: PerdormanceDto): Promise<{
        teamId: any;
        leagueId: any;
        wins: {
            overall: number;
            home: number;
            away: number;
        };
        draw: {
            overall: number;
            home: number;
            away: number;
        };
        lost: {
            overall: number;
            home: number;
            away: number;
        };
        goalsFor: {
            overall: number;
            home: number;
            away: number;
        };
        goalsAgainst: {
            overall: number;
            home: number;
            away: number;
        };
        cleanSheet: {
            overall: number;
            home: number;
            away: number;
        };
        failedToScore: {
            overall: number;
            home: number;
            away: number;
        };
        avGoalsScored: {
            overall: string;
            home: string;
            away: string;
        };
        avGoalsConceded: {
            overall: string;
            home: string;
            away: string;
        };
        avFirstGoalsScored: {
            overall: string;
            home: string;
            away: string;
        };
        avFirstGoalsConceded: {
            overall: string;
            home: string;
            away: string;
        };
    } | Observable<{} | ReturnPerformance>>;
    allMatchStatistics(matchStatistics: any): Promise<{
        stats: {
            attacks: number;
            dangerousAttacks: number;
            avPossessionPercent: string;
            fouls: number;
            avFoulsPerGame: string;
            offside: number;
            redCards: number;
            yellowCards: number;
            shotsBlocked: number;
            shotsOffTarget: number;
            avShotsOffTarget: string;
            shotsOnTarget: number;
            avShotsOnTarget: string;
            totalCorners: number;
            avCorners: string;
            btts: string;
            avPlayerRatingPerMatch: string;
            tackles: number;
        };
    }>;
    allPerformances(performances: any): Promise<{
        teamId: any;
        leagueId: any;
        wins: {
            overall: number;
            home: number;
            away: number;
        };
        draw: {
            overall: number;
            home: number;
            away: number;
        };
        lost: {
            overall: number;
            home: number;
            away: number;
        };
        goalsFor: {
            overall: number;
            home: number;
            away: number;
        };
        goalsAgainst: {
            overall: number;
            home: number;
            away: number;
        };
        cleanSheet: {
            overall: number;
            home: number;
            away: number;
        };
        failedToScore: {
            overall: number;
            home: number;
            away: number;
        };
        avGoalsScored: {
            overall: string;
            home: string;
            away: string;
        };
        avGoalsConceded: {
            overall: string;
            home: string;
            away: string;
        };
        avFirstGoalsScored: {
            overall: string;
            home: string;
            away: string;
        };
        avFirstGoalsConceded: {
            overall: string;
            home: string;
            away: string;
        };
    }>;
    goalsByMinutes({ teamId, leagueId, seasonId, }: PerdormanceDto): Promise<{
        period: {
            minute: any;
            concededCount: string;
            concededPercent: string;
            scoringCount: string;
            scoringPercent: string;
        }[];
    }> | Observable<{} | ReturnGoalByMinutes>;
    allGoalMinutes(data: any): Promise<{
        period: {
            minute: any;
            concededCount: string;
            concededPercent: string;
            scoringCount: string;
            scoringPercent: string;
        }[];
    }>;
    goalsProbabilities({ teamId, leagueId, seasonId, }: GoalsProbabilitiesDto): Promise<{
        teamId: any;
        leagueId: any;
        seasonId: any;
        stats: {
            home: {
                over_0_5: string;
                over_1_5: string;
                over_2_5: string;
                over_3_5: string;
                over_4_5: string;
                over_5_5: string;
                under_0_5: string;
                under_1_5: string;
                under_2_5: string;
                under_3_5: string;
                under_4_5: string;
                under_5_5: string;
            };
            away: {
                over_0_5: string;
                over_1_5: string;
                over_2_5: string;
                over_3_5: string;
                over_4_5: string;
                over_5_5: string;
                under_0_5: string;
                under_1_5: string;
                under_2_5: string;
                under_3_5: string;
                under_4_5: string;
                under_5_5: string;
            };
        };
    }> | Observable<{} | ReturnGoalProbabilities>;
    allProbabilities(performances: any): Promise<{
        teamId: any;
        leagueId: any;
        seasonId: any;
        stats: {
            home: {
                over_0_5: string;
                over_1_5: string;
                over_2_5: string;
                over_3_5: string;
                over_4_5: string;
                over_5_5: string;
                under_0_5: string;
                under_1_5: string;
                under_2_5: string;
                under_3_5: string;
                under_4_5: string;
                under_5_5: string;
            };
            away: {
                over_0_5: string;
                over_1_5: string;
                over_2_5: string;
                over_3_5: string;
                over_4_5: string;
                over_5_5: string;
                under_0_5: string;
                under_1_5: string;
                under_2_5: string;
                under_3_5: string;
                under_4_5: string;
                under_5_5: string;
            };
        };
    }>;
    playerStatsLeague({ seasonId }: LeaguePlayersDto): Observable<Promise<any[]>>;
    playerStats({ teamId, seasonId }: PlayersDto): Observable<ReturnPlayerStats>;
    competitionStandings({ count, offset, seasonId, leagueId, }: CompitationStandingDto): Observable<ReturnCompetitionStanding[]>;
    search({ name }: SearchDto): Observable<ReturnSearchTeam>;
    private convertToUpcomingMatchInterface;
    private convertToFixturesInterface;
    private convertToMatchStatisticsInterface;
    private convertToPerformanceInterface;
    private convertToGoalByMinutesInterface;
    private convertToGoalsProbabilitiesInterface;
    private convertToPlayerStatsInterface;
    private convertToGeneralInfoInterface;
    private convertToCompetitionStandingInterface;
    private convertToSearchTeamInterface;
    private lastTeamForm;
    private convertToSecondaryInfoInterface;
    private convertToLastFixturesInterface;
}
