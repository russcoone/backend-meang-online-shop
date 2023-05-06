import { Db, SortDirection } from 'mongodb';

/*
Obtener el Id que vamos a utilizar el nuevo usuario
@param database---->  Base de datos con la que estamos trabjando
@param collection---->  collection donde queremos buscar el ultimo elemento
@param sort ----> como queremos ordenarlo {<propiedad>: -1}
*/

export const asignDocumentId = async (
  database: Db,
  collection: string,
  sort: { key: string; order: SortDirection } = {
    //obserbacion
    key: 'registerDate',
    order: -1,
  }
) => {
  //comprovar el ultimo usuario registrado para asignar ID
  const lastElement = await database
    .collection(collection)
    .find()
    .sort(sort.key, sort.order as SortDirection)
    .limit(1)
    .toArray();

  if (lastElement.length === 0) {
    return 1;
  } else {
    // por si marca un error devemos cambiar esta opcion y ver lo de la clase 93
    return lastElement[0].id + 1;
  }
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
  document: Array<object>
) => {
  return await database.collection(collection).insertMany(document);
};

export const findElements = async (
  database: Db,
  collection: string,
  filter: object = {}
) => {
  return await database.collection(collection).find(filter).toArray();
};
