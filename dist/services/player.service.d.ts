import { HttpService } from '@nestjs/axios';
import { SearchDto } from '../dto/search.dto';
import { ReturnGeneralInfo, ReturnPlayerStats } from '../interfaces/player.interface';
import { PlayerStatsDto } from '../dto/player-stats.dto';
export declare class PlayerService {
    private httpService;
    private readonly apiKey;
    private readonly apiUrl;
    constructor(httpService: HttpService);
    generalInfo({ name }: SearchDto): import("rxjs").Observable<ReturnGeneralInfo>;
    stats({ playerId, leagueId, seasonId }: PlayerStatsDto): import("rxjs").Observable<{} | ReturnPlayerStats>;
    private getPlayerById;
    private returnGeneralInfo;
    private returnPlayerStats;
    private calculateAge;
    private dateFormat;
}
