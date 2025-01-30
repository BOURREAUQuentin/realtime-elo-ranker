import { Module } from '@nestjs/common';
import { RankingController } from './app.controller';
import { RankingService } from './app.service';

@Module({
  imports: [],
  controllers: [RankingController],
  providers: [RankingService],
})
export class AppModule {}
