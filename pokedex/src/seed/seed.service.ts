import { Injectable } from '@nestjs/common';
import { PokemonResponse } from './interfaces/pokemon_response.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {



  // Model no es un servicio o provider (no se puede inyectar)
  // Para usarlo, se coloca el decorador @InjectModel
  constructor(
    @InjectModel(Pokemon.name)
    private readonly _pokemoModel: Model<Pokemon>,
    private readonly _http: AxiosAdapter
  ) { }

  async executeSeed() {
    await this._pokemoModel.deleteMany({}); // Borrar todo pora volver a insertar
    const data = await this._http.get<PokemonResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');

    const pokemonToInsert: { name: string, no: number }[] = [];

    data.results.forEach(async ({ name, url }) => {
      const segments = url.split('/');
      const no: number = +segments[segments.length - 2];

      // const pokemon = await this._pokemoModel.create({ name, no })
      pokemonToInsert.push({ name, no });
    });
    await this._pokemoModel.insertMany(pokemonToInsert);
    return 'Seed executed';
  }
}
