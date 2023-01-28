import {Body, Controller, HttpCode, HttpStatus, Post} from '@nestjs/common';
import {SearchDto} from "../dto/search.dto";
import {SearchService} from "../services/search.service";

@Controller('football/api/v1/search')
export class SearchController {

    constructor(
        private readonly searchService: SearchService
    ) {
    }

    @Post()
    @HttpCode(HttpStatus.OK)
    searchData(
        @Body() body: SearchDto
    ) {
        return this.searchService.search(body);
    }

}
