import { HttpService } from '@nestjs/axios';
import { UpcomingMatchesDto } from "../dto/upcoming-matches.dto";
export declare class UpcomingMatchesService {
    private httpService;
    private readonly apiKey;
    private readonly apiUrl;
    constructor(httpService: HttpService);
    upcomingMatches({ page, perPage, dateFrom, dateTo }: UpcomingMatchesDto): import("rxjs").Observable<any>;
    upcomingMatchesInterface(matches: any, perPage: number): any;
}
