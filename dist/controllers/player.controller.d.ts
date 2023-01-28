import { SearchDto } from '../dto/search.dto';
import { PlayerService } from '../services/player.service';
import { PlayerStatsDto } from '../dto/player-stats.dto';
export declare class PlayerController {
    private readonly playerService;
    constructor(playerService: PlayerService);
    generalInfo(body: SearchDto): import("rxjs").Observable<import("../interfaces/player.interface").ReturnGeneralInfo>;
    stats(body: PlayerStatsDto): import("rxjs").Observable<{} | import("../interfaces/player.interface").ReturnPlayerStats>;
}
