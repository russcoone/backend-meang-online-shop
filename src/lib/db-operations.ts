// import { Db } from 'mongodb';
// import { IPaginationOptions } from '../interfaces/pagination-options.interface';
// import { SortDirections } from 'property-sort/dist/sort/sort.interface';
// // import { SortDirections } from 'property-sort';

// export const asignDocumentId = async (
//   database: Db,
//   collection: string,
//   sort: { key: string; order: SortDirections } = {
//     key: 'registerDate',
//     order: 1,
//   }
//   //obserbacion
// ) => {
//   //comprovar el ultimo usuario registrado para asignar ID
//   const lastElement = await database
//     .collection(collection)
//     .find()
//     .limit(1)
//     .sort(sort.key, sort.order as SortDirections)
//     .toArray();

//   if (lastElement.length === 0) {
//     return '1';
//   }
//   // por si marca un error devemos cambiar esta opcion y ver lo de la clase 93
//   return String(+lastElement[0].id + 1);
// };

// export const findOneElement = async (
//   database: Db,
//   collection: string,
//   filter: object
// ) => {
//   return database.collection(collection).findOne(filter);
// };

// export const insertOneElement = async (
//   database: Db,
//   collection: string,
//   document: object
// ) => {
//   return await database.collection(collection).insertOne(document);
// };

// export const insertManyElements = async (
//   database: Db,
//   collection: string,
//   document: Array<object>
// ) => {
//   return await database.collection(collection).insertMany(document);
// };
// export const updateOneElement = async (
//   database: Db,
//   collection: string,
//   filter: object,
//   updateObject: object
// ) => {
//   return await database
//     .collection(collection)
//     .updateOne(filter, { $set: updateObject });
// };
// export const deleteOneElement = async (
//   database: Db,
//   collection: string,
//   filter: object = {}
// ) => {
//   return await database.collection(collection).deleteOne(filter);
// };

// export const findElements = async (
//   database: Db,
//   collection: string,
//   filter: object = {},
//   paginationOptions: IPaginationOptions = {
//     page: 1,
//     pages: 1,
//     itemsPage: -1,
//     skip: 0,
//     total: -1,
//   }
// ) => {
//   if (paginationOptions.total === -1) {
//     return await database.collection(collection).find(filter).toArray();
//   }
//   return await database
//     .collection(collection)
//     .find(filter)
//     .limit(paginationOptions.itemsPage)
//     .skip(paginationOptions.skip)
//     .toArray();
// };

// export const countElements = async (database: Db, collection: string) => {
//   return await database.collection(collection).countDocuments();
// };

//NOTA IMPORTANTE EN FUTURO SI LAS VERSIONES DE MONGODB Y TYPECRIP NO SON LAS MISMAS AL CURSO
//EN SORT AQUE PONER ANTENCION O SORTDIRECION OPSERVAR EN LA LECCION 119 0 162
// MUY IMPORTANTE ---------

import { Db } from 'mongodb';
import { IPaginationOptions } from '../interfaces/pagination-options.interface';
import database from './database';
import { resolve } from 'path';

/**
 * Obtener el ID que vamos a utilizar en el nuevo usuario
 * @param database Base de datos con la que estamos trabajando
 * @param collection Collección donde queremos buscar el último elemento
 * @param sort Como queremos ordenarlo { <propiedad>: -1 }
 */
export const asignDocumentId = async (
  database: Db,
  collection: string,
  sort: object = { key: 'registerDate', order: -1 }
) => {
  const lastElement = await database
    .collection(collection)
    .find()
    .sort({ registerDate: -1 })
    .limit(1)
    .toArray();
  if (lastElement.length === 0) {
    return '1';
  }
  return String(+lastElement[0].id + 1);
};

export const findOneElement = async (
  database: Db,
  collection: string,
  filter: object
) => {
  return database.collection(collection).findOne(filter);
};

export const insertOneElement = async (
  database: Db,
  collection: string,
  document: object
) => {
  return await database.collection(collection).insertOne(document);
};

export const insertManyElements = async (
  database: Db,
  collection: string,
  documents: Array<object>
) => {
  return await database.collection(collection).insertMany(documents);
};

export const updateOneElement = async (
  database: Db,
  collection: string,
  filter: object,
  updateObject: object
) => {
  return await database
    .collection(collection)
    .updateOne(filter, { $set: updateObject });
};

export const deleteOneElement = async (
  database: Db,
  collection: string,
  filter: object = {}
) => {
  return await database.collection(collection).deleteOne(filter);
};

export const findElements = async (
  database: Db,
  collection: string,
  filter: object = {},
  paginationOptions: IPaginationOptions = {
    page: 1,
    pages: 1,
    itemsPage: -1,
    skip: 0,
    total: -1,
  }
) => {
  if (paginationOptions.total === -1) {
    return await database.collection(collection).find(filter).toArray();
  }
  return await database
    .collection(collection)
    .find(filter)
    .limit(paginationOptions.itemsPage)
    .skip(paginationOptions.skip)
    .toArray();
};

export const countElements = async (
  database: Db,
  collection: string,
  filter: object = {}
) => {
  return await database.collection(collection).countDocuments(filter);
};

export const randomItems = async (
  database: Db,
  collection: string,
  filter: object = {},
  items: number = 10
): Promise<Array<object>> => {
  return new Promise(async (resolve) => {
    const pipeline = [{ $match: filter }, { $sample: { size: items } }];
    resolve(
      await database.collection(collection).aggregate(pipeline).toArray()
    );
  });
};

// export const randomItems = async (
//   database: Db,
//   collection: string,
//   filter: object = {},
//   items = 10
// ): Promise<Array<object>> => {
//   return new Promise((resolve) => {
//     const pipeline = [{ $match: filter }, { $sample: { size: items } }];
//     resolve(database.collection(collection).aggregate(pipeline).toArray());
//   });
// };

// // Gestión del stock de productos
// export const manageStockUpdate = async (
//   database: Db,
//   collection: string,
//   filter: object,
//   updateObject: object
// ) => {
//   return await database
//     .collection(collection)
//     .updateOne(filter, { $inc: updateObject });
// };
