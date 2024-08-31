import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { MoviesService } from '../services/movies.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Public } from '../../auth/decorators/public.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../auth/models/roles.model';
import { CreateMovieDto, UpdateMovieDto } from '../dtos/movie.dtos';

@ApiTags('movies')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('movies')
export class MoviesController {
  constructor(private readonly _movieService: MoviesService) {
  }

  @ApiBearerAuth(undefined)
  @ApiOperation({ summary: '* Endpoint para obtener la lista de películas. | No Necesita Token' })
  @Public()
  @Get('all')
  private _getAllMovies() {
    return this._movieService.getAllMoviesStarWarsApi();
  }

  @Roles(Role.CUSTOMER)
  @ApiOperation({ summary: '* Endpoint para obtener los detalles de una película específica. Solo los "Usuarios Regulares" deberían tener acceso a este endpoint. | Necesita Token de Usuario Customer id_role = 2' })
  @Get(':id')
  private _getMovieById(@Param('id', ParseIntPipe) id: number) {
    return this._movieService.getMovieById(id);
  }

  @ApiOperation({
    summary:
      '* Endpoint para crear una nueva película. Solo los "Administradores" deberían tener acceso a este endpoint. | Necesita Token de Usuario Admin id_role = 1'
  })
  @Roles(Role.ADMIN)
  @Post('create')
  private createMovie(@Body() createMovieDto: CreateMovieDto) {
    return this._movieService.createMovie(createMovieDto);
  }

  @ApiOperation({
    summary:
      '* Endpoint para actualizar la información de una película existente. Solo los "Administradores" deberían tener acceso a este endpoint. | Necesita Token de Usuario Admin id_role = 1',
  })
  @Roles(Role.ADMIN)
  @Put('update/:id')
  private updateMovie(
    @Param('id', ParseIntPipe) id: number,
    @Body() payload: UpdateMovieDto
  ) {
    return this._movieService.updateMovie(id, payload);
  }

  @ApiOperation({
    summary:
      '* Endpoint para eliminar una película. Solo los "Administradores" deberían tener acceso a este endpoint | Necesita Token de Usuario Admin id_role = 1',
  })
  @Roles(Role.ADMIN)
  @Delete('delete/:id')
  private deleteMovie(@Param('id', ParseIntPipe) id: number) {
    return this._movieService.deleteMovie(id);
  }

  @ApiOperation({
    summary:
      '* Endpoint o cron que sincronice el listado de películas que devuelve la API de Stars Wars. Solo para "Administradores" en caso de ser un endpoint. | Necesita Token de Usuario Admin id_role = 1',
  })
  @Roles(Role.ADMIN)
  @Get()
  private getAllMoviesCron() {
    return this._movieService.getAllMoviesCron();
  }
}
