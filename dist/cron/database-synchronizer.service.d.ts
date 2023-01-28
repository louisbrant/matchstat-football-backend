import { Connection } from 'typeorm';
import { HttpService } from '@nestjs/axios';
export declare class DatabaseSynchronizerService {
    private httpService;
    private connection;
    private readonly apiKey;
    private readonly apiUrl;
    constructor(httpService: HttpService, connection: Connection);
    parse(): Promise<void>;
    private synchronizeLeague;
    private getLeagues;
}
