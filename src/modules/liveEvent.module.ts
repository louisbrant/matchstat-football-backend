import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import {LiveEventService} from "../services/liveEvent.service";
import {LiveEventController} from "../controllers/liveEvent.controller";

@Module({
  imports: [HttpModule ],
  controllers: [LiveEventController],
  providers: [LiveEventService],
})
export class LiveEventModule {}
