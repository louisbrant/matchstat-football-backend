import {Injectable} from '@nestjs/common';
import {HttpService} from '@nestjs/axios';
import {SearchDto} from "../dto/search.dto";
import {map, switchMap} from "rxjs/operators";
import {SearchInterface} from "../interfaces/search.interface";


@Injectable()
export class SearchService {
    private readonly apiKey = process.env.API_KEY;
    private readonly apiUrl = process.env.API_URL;

    constructor(
        private httpService: HttpService,
    ) {
    }

    search({name, isTeam}: SearchDto) {
        const searchString = name.trim();
        if (isTeam) {
            return this.httpService.get(`${this.apiUrl}/teams/search/${searchString}?api_token=${this.apiKey}`)
                .pipe(map(resp => this.returnTeams(resp.data)));
        } else {
            let players;
            let teams;
            return this.httpService.get(`${this.apiUrl}/players/search/${searchString}?api_token=${this.apiKey}`)
                .pipe(
                    switchMap((player) => {
                        players = player;
                        return this.httpService.get(`${this.apiUrl}/teams/search/${searchString}?api_token=${this.apiKey}`)
                    }),
                    switchMap((team) => {
                        teams = team;
                        return this.httpService.get(`${this.apiUrl}/leagues/search/${searchString}?api_token=${this.apiKey}`)
                    }),
                    map(resp => this.returnSearchResult(resp.data, players, teams, searchString)),
                );
        }
    }

    returnTeams(data): SearchInterface[] {
        return data.data.map(item => {
            return {
                id: item?.id,
                name: item?.name,
                type: 'team'
            }
        })
    }

    returnSearchResult(leagues, players, teams, searchString): SearchInterface[] {
        let searchData: SearchInterface[] = [];
        players?.data?.data?.length && players?.data?.data?.map(p => {
            searchData?.push({
                id: p?.player_id,
                name: p?.firstname + ' ' +  p?.lastname,
                type: 'player'
            })
        });
        teams?.data?.data?.length && teams?.data?.data?.map(t => {
            searchData?.push({
                id: t?.id,
                name: t?.name,
                type: 'team'
            })
        });
        leagues?.data?.length && leagues?.data?.map(l => {
            searchData?.push({
                id: l?.id,
                name: l?.name,
                type: 'league'
            })
        });

        searchData = searchData?.filter(item => item?.name?.toLowerCase().indexOf(searchString?.toLowerCase()) > -1);

        return searchData;
    };

}
