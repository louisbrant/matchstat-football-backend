import { HttpService } from '@nestjs/axios';
import { SearchDto } from "../dto/search.dto";
import { SearchInterface } from "../interfaces/search.interface";
export declare class SearchService {
    private httpService;
    private readonly apiKey;
    private readonly apiUrl;
    constructor(httpService: HttpService);
    search({ name, isTeam }: SearchDto): import("rxjs").Observable<SearchInterface[]>;
    returnTeams(data: any): SearchInterface[];
    returnSearchResult(leagues: any, players: any, teams: any, searchString: any): SearchInterface[];
}
