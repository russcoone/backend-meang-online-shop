import { loadFilesSync } from '@graphql-tools/load-files';
import { filter } from 'compression';
import { Db } from 'mongodb';
import { IContextData } from '../interfaces/context-data.interface';
import { IVariables } from '../interfaces/variable.interface';
import {
  deleteOneElement,
  findElements,
  findOneElement,
  insertOneElement,
  updateOneElement,
} from '../lib/db-operations';
import { pagination } from '../lib/pagiantion';
import { StringLiteralType } from 'typescript';

class ResolverOperationsService {
  private variables: IVariables; // revisar este punto por algunos errores
  private context: IContextData;
  constructor(root: object, variables: IVariables, context: IContextData) {
    this.variables = variables;
    this.context = context;
  }

  protected getContext(): IContextData {
    return this.context;
  }
  protected getDb(): Db {
    return this.context.db!; // revisar este punto por algunos errores
  }

  //Listainformacion
  protected getVariables(): IVariables {
    return this.variables;
  }

  protected async list(
    collection: string,
    listElement: string,
    page: number = 1,
    itemsPage: number = 15,
    filter: object = { active: { $ne: false } }
  ) {
    try {
      const paginationData = await pagination(
        this.getDb(),
        collection,
        page,
        itemsPage,
        filter
      );

      return {
        info: {
          page: paginationData.page,
          pages: paginationData.pages,
          itemsPage: paginationData.itemsPage,
          // skip: paginationData.skip,
          total: paginationData.total,
        },
        status: true,
        message: `Lista de ${listElement} correctamente cargada`,
        items: await findElements(
          this.getDb(),
          collection,
          filter,
          paginationData
        ),
      };
    } catch (error) {
      return {
        info: null,
        status: false,
        message: `Lista de ${listElement} no cargada: ${error}`,
        items: null,
      };
    }
  }

  // obtener detalles del items
  protected async get(collection: string) {
    const collectionLabel = collection.toLowerCase();
    try {
      return await findOneElement(this.getDb(), collection, {
        id: this.variables.id, //revisar este punto por algunos errores
      }).then((result) => {
        if (result) {
          return {
            status: true,
            message: `${collectionLabel} ha sido cargada correctamente con sus detalles`,
            item: result,
          };
        }
        return {
          status: true,
          message: `${collectionLabel} no ha obtenido correctamente con sus detalles`,
          item: null,
        };
      });
    } catch (error) {
      return {
        status: false,
        message: `Error inesperado po querer cargas los detalles ${collectionLabel} `,
        item: null,
      };
    }
  }

  // Añadir item

  protected async add(collection: string, document: object, item: string) {
    try {
      return await insertOneElement(this.getDb(), collection, document).then(
        (res) => {
          if (res.result.ok === 1) {
            return {
              status: true,
              message: `Añadido correctamente ${item}`,
              item: document,
            };
          }
          return {
            status: false,
            message: `No se ha insertado el ${item}. Intentalo de nuevo por favor`,
            item: null,
          };
        }
      );
    } catch (error) {
      return {
        status: false,
        message: `Error inesperado al insertar el ${item}. Intentalo de nuevo por favor`,
        item: null,
      };
    }
  }
  protected async update(
    collection: string,
    filter: object,
    objectUpdate: object,
    item: string
  ) {
    try {
      return await updateOneElement(
        this.getDb(),
        collection,
        filter,
        objectUpdate
      ).then((res) => {
        if (res.result.nModified === 1 && res.result.ok) {
          return {
            status: true,
            message: `Elemento ${item} actulizado correctamente`,
            item: Object.assign({}, filter, objectUpdate),
          };
        }
        return {
          status: false,
          message: `No se ha actualizado el ${item}. Intentalo de nuevo por favor`,
          item: null,
        };
      });
    } catch (error) {
      return {
        status: false,
        message: `Error inesperado al actualizar el ${item}. Intentalo de nuevo por favor`,
        item: null,
      };
    }
  }
  protected async del(collection: string, filter: object, item: string) {
    try {
      return await deleteOneElement(this.getDb(), collection, filter).then(
        (res) => {
          if (res.deletedCount === 1) {
            return {
              status: true,
              message: `Elemento de ${item} eliminado correctamente`,
            };
          }
          return {
            status: false,
            message: `Elemento de ${item} No se ha borrado correctamente con prueba el filtro`,
          };
        }
      );
    } catch (error) {
      return {
        status: false,
        message: `Error inesperado al eliminar el ${item}. Intentalo de nuevo por favor`,
      };
    }
  }

  //modificar item
}

export default ResolverOperationsService;
