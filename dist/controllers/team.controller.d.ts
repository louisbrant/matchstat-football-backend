import { TeamService } from '../services/team.service';
import { MatchStatisticsDto } from '../dto/match-statistics.dto';
import { UpcomingMatchDto } from '../dto/upcoming-match.dto';
import { FixturesDto } from '../dto/fixtures.dto';
import { PerdormanceDto } from '../dto/perdormance.dto';
import { GoalByMinutesDto } from '../dto/goal-by-minutes.dto';
import { GoalsProbabilitiesDto } from '../dto/goals-probabilities.dto';
import { CompitationStandingDto } from '../dto/compitation-standing.dto';
import { SearchDto } from '../dto/search.dto';
import { GeneralInfoTeamDto } from '../dto/general-info-team.dto';
import { PlayersDto } from '../dto/players.dto';
import { SecondaryInfoTeamDto } from '../dto/secondary-info-team.dto';
import { LeaguePlayersDto } from "../dto/league-players.dto";
export declare class TeamController {
    private readonly teamService;
    constructor(teamService: TeamService);
    generalInfo(body: GeneralInfoTeamDto): import("rxjs").Observable<{
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
        latest: import("../interfaces/fixtures.interface").Fixtures[];
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
    secondaryInfo(body: SecondaryInfoTeamDto): import("rxjs").Observable<{} | import("../interfaces/team.interface").ReturnSecondaryInfo>;
    fixtures(body: FixturesDto): Promise<unknown>;
    upcomingMatch(body: UpcomingMatchDto): import("rxjs").Observable<import("../interfaces/upcoming-match.interface").ReturnUpcoming>;
    matchStatistics(body: MatchStatisticsDto): import("rxjs").Observable<{} | import("../interfaces/stats.interface").ReturnMatchStatistics> | Promise<{
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
    performance(body: PerdormanceDto): Promise<import("rxjs").Observable<{} | import("../interfaces/stats.interface").ReturnPerformance> | {
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
    goalsByMinutes(body: GoalByMinutesDto): import("rxjs").Observable<{} | import("../interfaces/stats.interface").ReturnGoalByMinutes> | Promise<{
        period: {
            minute: any;
            concededCount: string;
            concededPercent: string;
            scoringCount: string;
            scoringPercent: string;
        }[];
    }>;
    goalsProbabilities(body: GoalsProbabilitiesDto): import("rxjs").Observable<{} | import("../interfaces/stats.interface").ReturnGoalProbabilities> | Promise<{
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
    playerStats(body: PlayersDto): import("rxjs").Observable<import("../interfaces/stats.interface").ReturnPlayerStats>;
    playerStatsLeague(body: LeaguePlayersDto): import("rxjs").Observable<Promise<any[]>>;
    competitionStandings(body: CompitationStandingDto): import("rxjs").Observable<import("../interfaces/competition-standing.interface").ReturnCompetitionStanding[]>;
    search(body: SearchDto): import("rxjs").Observable<import("../interfaces/team.interface").ReturnSearchTeam>;
}
