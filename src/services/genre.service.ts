import { filter } from 'compression';
import { COLLECTION } from '../config/constants';
import { IContextData } from '../interfaces/context-data.interface';
import { IVariables } from '../interfaces/variable.interface';
import { asignDocumentId, findOneElement } from '../lib/db-operations';
import ResolverOperationsService from './resolver-operations.service';
import slugify from 'slugify';

class GenreService extends ResolverOperationsService {
  collection = COLLECTION.GENRES;
  constructor(root: object, variables: object, context: IContextData) {
    super(root, variables, context);
  }
  async items() {
    const page = this.getVariables().pagination?.page;
    const itemsPage = this.getVariables().pagination?.itemsPage;
    const result = await this.list(this.collection, 'generos', page, itemsPage);

    console.log(this.getVariables().pagination);
    console.log(page, itemsPage);

    return {
      info: result.info,
      status: result.status,
      message: result.message,
      genres: result.items,
    };
  }
  async details() {
    const result = await this.get(this.collection);
    return {
      status: result.status,
      message: result.message,
      genre: result.item,
    };
  }
  async insert() {
    const genre = this.getVariables().genre;
    //comprovar que no esta en blanco  ni es indefinido
    if (!this.checkData(genre || '')) {
      return {
        status: false,
        message: 'El genero no se haespecificado correctamente',
        genre: null,
      };
    }

    // comprovar que no existe
    if (await this.checkInDatabase(genre || '')) {
      return {
        status: false,
        message: 'El genero existe ne la base de datos intenta con otro genro',
        genre: null,
      };
    }

    // si valida las opciones anteriores veir qui y crea el contenido
    const genreObject = {
      id: await asignDocumentId(this.getDb(), this.collection, { id: -1 }),
      name: genre,
      slug: slugify(genre || '', { lower: true }),
    };
    const result = await this.add(this.collection, genreObject, 'generos');
    return {
      status: result.status,
      message: result.message,
      genre: result.item,
    };
  }
  async modify() {
    const id = this.getVariables().id;
    const genre = this.getVariables().genre;
    if (!this.checkData(String(id) || '')) {
      return {
        status: false,
        message: 'El  ID delgenero no se haespecificado correctamente',
        genre: null,
      };
    }
    if (!this.checkData(genre || '')) {
      return {
        status: false,
        message: 'El genero no se ha especificado correctamente',
        genre: null,
      };
    }
    const objectUpdate = {
      name: genre,
      slug: slugify(genre || '', { lower: true }),
    };

    const result = await this.update(
      this.collection,
      { id },
      objectUpdate,
      'generos'
    );
    return {
      status: result.status,
      message: result.message,
      genre: result.item,
    };
  }
  async delete() {
    const id = this.getVariables().id;
    if (!this.checkData(String(id) || '')) {
      return {
        status: false,
        message: 'El  ID del genero no se haespecificado correctamente',
        genre: null,
      };
    }
    const result = await this.del(this.collection, { id }, 'generos');
    return {
      status: result.status,
      message: result.message,
    };
  }

  private checkData(value: string) {
    return value === '' || value === undefined ? false : true;
  }

  private async checkInDatabase(value: string) {
    return await findOneElement(this.getDb(), this.collection, {
      name: value,
    });
  }
}

export default GenreService;
