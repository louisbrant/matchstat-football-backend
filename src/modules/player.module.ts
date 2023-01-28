import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PlayerService } from '../services/player.service';
import { PlayerController } from '../controllers/player.controller';

@Module({
  imports: [HttpModule],
  controllers: [PlayerController],
  providers: [PlayerService],
})
export class PlayerModule {}
