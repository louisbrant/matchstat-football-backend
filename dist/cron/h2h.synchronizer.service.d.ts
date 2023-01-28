import { Connection, Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { H2h_current_page_count } from '../entities/h2h_current_page_count.entity';
import { Observable } from 'rxjs';
export declare class H2hSynchronizerService {
    private httpService;
    private readonly connection;
    private h2hPageRepository;
    private readonly apiKey;
    private readonly apiUrl;
    data: Observable<any>;
    constructor(httpService: HttpService, connection: Connection, h2hPageRepository: Repository<H2h_current_page_count>);
    parse(): Promise<void>;
}
