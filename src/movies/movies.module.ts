/**
 * @author Edson Sosa
 */
import { Module } from '@nestjs/common';
import { MoviesService } from './services/movies.service';
import { MoviesController } from './controllers/movies.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [MoviesService],
  controllers: [MoviesController],
})
export class MoviesModule {}
