import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { CreateMovieDto, DeleteMovieDto, UpdateMovieDto } from '../dtos/movie.dtos';
import { Client, QueryResult } from 'pg';
import { Movie } from '../entities/movie.entity';

@Injectable()
export class MoviesService {

  private readonly _BASE_URL = 'https://swapi.dev/api/';
  private readonly _NUMBER_ZERO: number = 0;

  constructor(
    @Inject('PG') private _clientPg: Client,
    private _http: HttpService
  ) {
  }

  public async getAllMoviesStarWarsApi() {
    try {
      const movies = this._http.get(`${this._BASE_URL}films`);
      const tasks = await lastValueFrom(movies);

      return tasks.data;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  public async getMovieById(id: number) {
    try {
      const movies = this._http.get(`${this._BASE_URL}films/${id}`);
      const tasks = await lastValueFrom(movies);

      return tasks.data;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  public async createMovie(movie: CreateMovieDto): Promise<CreateMovieDto> {
    const {
      title,
      episode_id,
      opening_crawl,
      director,
      producer,
      species,
      starships,
      vehicles,
      characters,
      planets
    } = movie;
    const query: string =
      'INSERT INTO movies.movie(title, episode_id, opening_crawl, producer, director, species, starships, vehicles, characters, planets) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *';

    try {
      const result = await this._clientPg.query(query, [
        title,
        episode_id,
        opening_crawl,
        director,
        producer,
        species,
        starships,
        vehicles,
        characters,
        planets
      ]);

      return result.rows[this._NUMBER_ZERO];
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  public async updateMovie(
    id: number,
    movie: UpdateMovieDto
  ): Promise<UpdateMovieDto> {
    const {
      title,
      episode_id,
      opening_crawl,
      director,
      producer,
      species,
      starships,
      vehicles,
      characters,
      planets
    } = movie;
    const query: string =
      'UPDATE movies.movie SET title = $1, episode_id = $2, opening_crawl = $3, producer = $4, director = $5, species = $6, starships = $7, vehicles = $8, characters = $9, planets = $10  WHERE id_movie = $11 RETURNING *';

    try {
      const result = await this._clientPg.query(query, [
        title,
        episode_id,
        opening_crawl,
        director,
        producer,
        species,
        starships,
        vehicles,
        characters,
        planets,
        id
      ]);

      return result.rows[this._NUMBER_ZERO];
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  public async deleteMovie(id: number): Promise<DeleteMovieDto> {
    const query = 'DELETE movies.movie WHERE id_movie = $1 RETURNING *';
    try {
      const result = await this._clientPg.query(query, [id]);

      return result.rows[this._NUMBER_ZERO];
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }

  public async getAllMoviesCron(): Promise<Movie[]> {
    const query: string = 'SELECT * FROM movies.movie';
    try {
      const movies = this._http.get(`${this._BASE_URL}films/`);
      const tasks = await lastValueFrom(movies);
      const apiResult: Movie[] = tasks.data.results;

      const result = await this._clientPg.query(query);
      const dbResult: Movie[] = result.rows;

      const combineResults: Movie[] = [...dbResult, ...apiResult];
      return combineResults;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error);
    }
  }
}
