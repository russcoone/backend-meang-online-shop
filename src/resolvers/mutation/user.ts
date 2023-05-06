import { findOneElement, insertOneElement } from './../../lib/db-operations';
import { COLLECTION } from './../../config/constants';
import { IResolvers } from 'graphql-tools';
import bcrypt from 'bcrypt';
import { asignDocumentId } from '../../lib/db-operations';

const resolversUserMutation: IResolvers = {
  Mutation: {
    async register(_, { user }, { db }) {
      // comprovar que el usuario no existe
      const userCheck = await findOneElement(db, COLLECTION.USERS, {
        email: user.email,
      });
      if (userCheck !== null) {
        return {
          status: false,
          message: `El usuario ${user.email} ya existe`,
          user: null,
        };
      }
      user.id = await asignDocumentId(db, COLLECTION.USERS, {
        key: 'registerDate',
        order: -1,
      });

      //asignar la fecha en formato ISO en la propiedad regidter
      user.registerDate = new Date().toISOString();
      //encriptar password
      user.password = bcrypt.hashSync(user.password, 10);

      //guardar el documento (register en la coleccion)

      return await insertOneElement(db, COLLECTION.USERS, user)
        .then(async () => {
          return {
            status: true,
            message: `El usuario ${user.email} se agrego correctamente`,
            user,
          };
        })
        .catch((err: Error) => {
          console.log(err.message);
          return {
            status: false,
            message: `Error inesperado prueba de nuevo`,
            user: null,
          };
        });
    },
  },
};
export default resolversUserMutation;
