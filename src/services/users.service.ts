import {
  ACTIVE_VALUES_FILTER,
  COLLECTION,
  EXPIRETIME,
  MESSAGES,
} from '../config/constants';
import { IContextData } from '../interfaces/context-data.interface';
import { IUser } from '../interfaces/user.interface';
import { asignDocumentId, findOneElement } from '../lib/db-operations';
import JWT from '../lib/jwt';
import Mailservice from './mail.service';
import ResolverOperationsService from './resolver-operations.service';
import bcrypt from 'bcrypt';

class UsersService extends ResolverOperationsService {
  private collection = COLLECTION.USERS;
  //revisar si presenta a futuro un erro antes tenia IVariables
  constructor(root: object, variables: object, context: IContextData) {
    super(root, variables, context);
  }
  // Lista de usuarios
  async items(active: string = ACTIVE_VALUES_FILTER.ACTIVE) {
    console.log('servive', active);
    let filter: object = { active: { $ne: false } };
    if (active === ACTIVE_VALUES_FILTER.ALL) {
      filter = {};
    } else if (active === ACTIVE_VALUES_FILTER.INACTIVE) {
      filter = { active: false };
    }

    const page = this.getVariables().pagination?.page;
    const itemsPage = this.getVariables().pagination?.itemsPage;

    const result = await this.list(
      this.collection,
      'usuarios',
      page,
      itemsPage,
      filter
    );
    return {
      info: result.info,
      status: result.status,
      message: result.message,
      users: result.items,
    };
  }

  //autenticarnos
  async auth() {
    let info = new JWT().verify(this.getContext().token!);
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
  }

  // Iniciar seccion
  async login() {
    try {
      const variables = this.getVariables().user;

      // const user = await db.collection(COLLECTION.USERS).findOne({ email });
      const user: IUser = ((await findOneElement(
        this.getDb(),
        this.collection,
        {
          email: variables?.email,
        }
      )) as unknown) as IUser;

      // const user = await findOneElement(db, COLLECTION.USERS, {email})

      if (user === null) {
        return {
          status: false,
          message: 'El usuario no existe',
          token: null,
        };
      }
      //revision si prensenta un erro mas adelante por <as string>
      const passwordCheck = bcrypt.compareSync(
        variables?.password || '',
        user.password || ''
      );

      if (passwordCheck !== null) {
        delete user.password, delete user.birthday, delete user.registerDate;
      }

      return {
        status: passwordCheck,
        message: !passwordCheck
          ? 'password y usuario no son correctos sesion no iniciada'
          : 'Datos de Usuaria Correctos espere 10 segundo',
        token: !passwordCheck ? null : new JWT().sign({ user }, EXPIRETIME.H24),
        user: !passwordCheck ? null : user,
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
  }

  //Registrar un usuario
  async register() {
    // comprovar que el usuario no existe
    const user = this.getVariables().user;
    //comprova que user no es null
    if (user === null) {
      return {
        status: false,
        message: 'Usuario no denifinido, procura definirlo',
        user: null,
      };
    }
    if (
      user?.password === null ||
      user?.password === undefined ||
      user?.password === ''
    ) {
      return {
        status: false,
        message: 'Usuario sin password correcto , procura definirlo',
        user: null,
      };
    }

    //comprovar que el usuario no exite
    const userCheck = await findOneElement(this.getDb(), this.collection, {
      email: user?.email,
    });
    if (userCheck !== null) {
      return {
        status: false,
        message: `El usuario ${user?.email} ya existe`,
        user: null,
      };
    }
    user!.id = await asignDocumentId(this.getDb(), this.collection, {
      // registerDate: -1,
      key: 'registerDate',
      order: 1,
    });

    //asignar la fecha en formato ISO en la propiedad regidter
    user!.registerDate = new Date().toISOString();
    //encriptar password
    user!.password = bcrypt.hashSync(user!.password || '', 10);

    //guardar el documento (register en la coleccion)
    const result = await this.add(this.collection, user || {}, 'usuario');
    return {
      status: result.status,
      message: result.message,
      user: result.item,
    };
  }
  //modificar un usuario
  async modify() {
    const user = this.getVariables().user;
    if (user === null) {
      return {
        status: false,
        message: 'Usuario no denifinido, procura definirlo',
        user: null,
      };
    }
    const filter = { id: user?.id };
    const result = await this.update(this.collection, filter, user || {}, '');
    return {
      status: result.status,
      message: result.message,
      user: result.item,
    };
  }
  // borrar el usuario seleccionado
  async delete() {
    const id = this.getVariables().id;
    if (id === undefined || id === '') {
      return {
        status: false,
        message: 'Identificdor del usuario no denifinido, procura definirlo',
        user: null,
      };
    }
    const result = await this.del(this.collection, { id }, 'usuario');
    return {
      status: result.status,
      message: result.message,
    };
  }
  async unblock(unblock: boolean, admin: boolean) {
    const id = this.getVariables().id;
    const user = this.getVariables().user;
    if (!this.checkData(String(id) || '')) {
      return {
        status: false,
        message: 'El ID del usuario no se ha especificado correctamente',
        user: null,
      };
    }
    if (user?.password === '12345') {
      return {
        status: false,
        message:
          'En este caso no podemos activar porque no has cambiado el passsword',
      };
    }
    let update = { active: unblock };
    if (unblock && !admin) {
      console.log('Soy clinte y estoycmabiando la contraseña');
      update = Object.assign(
        {},
        { active: true },
        {
          birthday: user?.birthday,
          password: bcrypt.hashSync(user?.password || '', 10),
        }
      );
    }
    console.log(update);
    const result = await this.update(
      this.collection,
      { id },
      update,
      'usuario'
    );
    const action = unblock ? 'Desbloqueado' : 'Bloqueado';
    return {
      status: result.status,
      message: result.status ? `${action} correctamente` : `No se ha ${action}`,
    };
  }
  async active() {
    const id = this.getVariables().user?.id;
    const email = this.getVariables().user?.email || '';
    if (email === undefined || email === '') {
      return {
        status: false,
        message: 'El email no se ha definido correectamente',
      };
    }
    const token = new JWT().sign({ user: { id, email } }, EXPIRETIME.H1);
    const html = `Para activar la cuenta haz click sobre el enlace: <a href="${process.env.CLIENT_URL}/#/active/${token}">Clic aqui`;
    const mail = {
      subject: 'Activar usuario',
      to: email,
      html,
    };

    return new Mailservice().send(mail);
  }
  private checkData(value: string) {
    return value === '' || value === undefined ? false : true;
  }
}

export default UsersService;
