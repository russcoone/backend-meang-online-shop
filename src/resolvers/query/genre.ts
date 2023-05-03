import { IResolvers } from 'graphql-tools';
import GenreService from '../../services/genre.service';

const resolversGenreQuery: IResolvers = {
  Query: {
    async genres(_, __, { db }) {
      return new GenreService(_, __, { db }).items();
    },
    async genre(_, { id }, { db }) {
      return new GenreService(_, { id }, { db }).details();
    },
    // async genre(_, { id }, { db }) {
    //   return {
    //     status: true,
    //     message: `Genero ${id} selccionado correctamente`,
    //     genre: await findOneElement(db, COLLECTION.GENRES, { id }),
    //   };
    // },
  },
};

export default resolversGenreQuery;
