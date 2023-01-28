import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TeamController } from '../controllers/team.controller';
import { TeamService } from '../services/team.service';

@Module({
  imports: [HttpModule],
  controllers: [TeamController],
  providers: [TeamService],
})
export class TeamModule {}
