import { Injectable, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';

import { Model, isValidObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';

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
      this.handleExceptions(error);
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    return this._pokemoModel.find().limit(limit).skip(offset).sort({ no: 1 }).select('-__v');
  }

  async findOne(term: string) {
    let pokemon: Pokemon;
    // Buscar por "no"
    if (!isNaN(+term)) {
      pokemon = await this._pokemoModel.findOne({ no: term });
    }
    // Buscar por MongoID
    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this._pokemoModel.findById(term);
    }

    // Buscar por name
    if (!pokemon) {
      pokemon = await this._pokemoModel.findOne({ name: term.toLowerCase().trim() });
    }

    if (!pokemon) throw new NotFoundException(`Pokemon with id, name or no "${term}" not found`);

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);
    if (updatePokemonDto.name) updatePokemonDto.name = updatePokemonDto.name.toLowerCase();

    try {
      await pokemon.updateOne(updatePokemonDto);
      // retorna el nuevo dato
      return { ...pokemon.toJSON(), ...updatePokemonDto };

    } catch (error) {
      // Registro ya esta en BD
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    /* const pokemon = await this.findOne(id);
    await pokemon.deleteOne(); */
    // Solo eliminar cuando se envia el MongoID
    // const result  = await this._pokemoModel.findByIdAndDelete(id);
    const { deletedCount } = await this._pokemoModel.deleteOne({ _id: id });
    if (deletedCount === 0) throw new BadRequestException(`Pokemon with ID "${id}" not found`);
    return;
  }

  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(`Pokemon exists in DB ${JSON.stringify(error.keyValue)}`);
    }
    throw new InternalServerErrorException(`Can't create Pokemon - Check server logs`);
  }
}
