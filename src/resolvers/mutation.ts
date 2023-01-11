import { COLLECTION } from './../config/constants';
import { IResolvers } from 'graphql-tools';
import bcrypt from 'bcrypt';

const resolversMutation: IResolvers = {
  Mutation: {
    async register(_, { user }, { db }) {
      // comprovar que el usuario no existe
      const userCheck = await db
        .collection(COLLECTION.USERS)
        .findOne({ email: user.email });
      if (userCheck !== null) {
        return {
          status: false,
          message: `El usuario ${user.email} ya existe`,
          user: null,
        };
      }

      //comprovar el ultimo usuario registrado para asignar ID
      const lastUser = await db
        .collection(COLLECTION.USERS)
        .find()
        .limit(1)
        .sort({ registerDate: -1 })
        .toArray();

      if (lastUser.length === 0) {
        user.id = 1;
      } else {
        // por si marca un error devemos cambiar esta opcion y ver lo de la clase 93
        user.id = lastUser[0].id + 1;
      }

      //asignar la fecha en formato ISO en la propiedad regidter
      user.registerDate = new Date().toISOString();
      //encriptar password
      user.password = bcrypt.hashSync(user.password, 10);

      //guardar el documento (register en la coleccion)

      return await db
        .collection(COLLECTION.USERS)
        .insertOne(user)
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
export default resolversMutation;
