import { Body, Controller, HttpCode, HttpStatus, Post, Res } from '@nestjs/common';
import { SearchDto } from '../dto/search.dto';
import { PlayerService } from '../services/player.service';
import { PlayerStatsDto } from '../dto/player-stats.dto';

@Controller('football/api/v1/players')
export class PlayerController {

  constructor(
    private readonly playerService: PlayerService
  ){}

  @Post('generalInfo')
  @HttpCode(HttpStatus.OK)
  generalInfo(
    @Body() body: SearchDto
  ) {
    return this.playerService.generalInfo(body)
  }

  @Post('stats')
  @HttpCode(HttpStatus.OK)
  stats(
    @Body() body: PlayerStatsDto
  ) {
    return this.playerService.stats(body)
  }
}
