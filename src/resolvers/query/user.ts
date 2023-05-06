import { COLLECTION, EXPIRETIME, MESSAGES } from './../../config/constants';
import { IResolvers } from 'graphql-tools';
import JWT from './../../lib/jwt';
import bcrypt from 'bcrypt';
import { findElements, findOneElement } from '../../lib/db-operations';
import { IUser } from '../../interfaces/user.interface';

const resolversUserQuery: IResolvers = {
  Query: {
    async users(_, __, { db }) {
      try {
        return {
          status: true,
          message: 'Lista de usuarios cargada correctamante',
          users: await findElements(db, COLLECTION.USERS),
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
        // const user = await db.collection(COLLECTION.USERS).findOne({ email });
        const user: IUser = (await findOneElement(db, COLLECTION.USERS, {
          email,
        })) as IUser;

        // const user = await findOneElement(db, COLLECTION.USERS, {email})

        if (user === null) {
          return {
            status: false,
            message: 'El usuario no existe',
            token: null,
          };
        }
        //revision si prensenta un erro mas adelante por <as string>
        const passwordCheck = bcrypt.compareSync(password, user.password || '');

        if (passwordCheck !== null) {
          delete user.password, delete user.birthday, delete user.registerDate;
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

export default resolversUserQuery;
// export default resolversQuery:
