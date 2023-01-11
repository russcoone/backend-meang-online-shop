import { IJwt } from './../interfaces/jwt.interface';
import { COLLECTION, EXPIRETIME, MESSAGES } from './../config/constants';
import { IResolvers } from 'graphql-tools';
import JWT from '../lib/jwt';
import bcrypt from 'bcrypt';

const resolversQuery: IResolvers = {
  Query: {
    async users(_, __, { db }) {
      try {
        return {
          status: true,
          message: 'Lista de usuarios cargada correctamante',
          users: await db.collection(COLLECTION.USERS).find().toArray(),
        };
      } catch (error) {
        console.log(error);
        return {
          status: false,
          message:
            'Error al cargar la lista de usuarios Comprueba que tienes correctamente todo',
          users: [],
        };
      }
    },

    async login(_, { email, password }, { db }) {
      try {
        const user = await db.collection(COLLECTION.USERS).findOne({ email });
        if (user === null) {
          return {
            status: false,
            message: 'El usuario no existe',
            token: null,
          };
        }
        const passwordCheck = bcrypt.compareSync(password, user.password);

        if (passwordCheck !== null) {
          delete user.password, delete user.birthday, delete user.registerDay;
        }

        return {
          status: true,
          message: !passwordCheck
            ? 'password y usuario no son correctos sesion no iniciada'
            : 'Usuarios cargada correctamente',
          token: !passwordCheck
            ? null
            : new JWT().sign({ user }, EXPIRETIME.H24),
        };
      } catch (error) {
        console.log(error);
        return {
          status: false,
          message:
            'Error al cargar el usuarios Comprueba que tienes correctamente todo',
          token: null,
        };
      }
    },
    me(_, __, { token }) {
      console.log(token);
      let info = new JWT().verify(token);
      if (info === MESSAGES.TOKEN_VERIFICATION_FAILT) {
        return {
          status: false,
          message: info,
          user: null,
        };
      }
      return {
        status: true,
        message: 'Usuario authenticado correctamente mediante el token',
        user: Object.values(info)[0],
      };
    },
  },
};

export default resolversQuery;
