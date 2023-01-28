import { SearchDto } from "../dto/search.dto";
import { SearchService } from "../services/search.service";
export declare class SearchController {
    private readonly searchService;
    constructor(searchService: SearchService);
    searchData(body: SearchDto): import("rxjs").Observable<import("../interfaces/search.interface").SearchInterface[]>;
}
