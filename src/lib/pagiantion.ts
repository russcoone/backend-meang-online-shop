import { filter } from 'compression';
import { Db } from 'mongodb';
import { countElements } from './db-operations';

export async function pagination(
  db: Db,
  collection: string,
  page: number = 1,
  itemsPage: number = 15,
  filter: object = {}
) {
  //comprobar el numero de items
  if (itemsPage < 1 || itemsPage > 15) {
    itemsPage = 15;
  }
  if (page < 1) {
    page = 1;
  }
  const total = await countElements(db, collection, filter);
  const pages = Math.ceil(total / itemsPage);
  return {
    page,
    skip: (page - 1) * itemsPage,
    itemsPage,
    total,
    pages,
  };
}
