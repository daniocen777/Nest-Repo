import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';

@Injectable()
export class PokemonService {

  // Model no es un servicio o provider (no se puede inyectar)
  // Para usarlo, se coloca el decorador @InjectModel
  constructor(
    @InjectModel(Pokemon.name)
    private readonly _pokemoModel: Model<Pokemon>
  ) { }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();
    try {
      const pokemon = await this._pokemoModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      // Registro ya esta en BD
      if (error.code === 11000) {
        throw new BadRequestException(`Pokemon exists in DB ${JSON.stringify(error.keyValue)}`);
      }
      throw new InternalServerErrorException(`Can't create Pokemon - Check server logs`);
    }
  }

  findAll() {
    return `This action returns all pokemon`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pokemon`;
  }

  update(id: number, updatePokemonDto: UpdatePokemonDto) {
    return `This action updates a #${id} pokemon`;
  }

  remove(id: number) {
    return `This action removes a #${id} pokemon`;
  }
}
