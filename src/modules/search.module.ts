import { Module } from '@nestjs/common';
import {HttpModule} from "@nestjs/axios";
import {SearchController} from "../controllers/search.controller";
import {SearchService} from "../services/search.service";


@Module({
    imports: [HttpModule
      ],
    controllers: [SearchController],
    providers: [SearchService],
})
export class SearchModule {}
