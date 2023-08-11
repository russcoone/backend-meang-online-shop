import { COLLECTION, EXPIRETIME } from '../config/constants';
import { IContextData } from '../interfaces/context-data.interface';
import { findOneElement } from '../lib/db-operations';
import JWT from '../lib/jwt';
import Mailservice from './mail.service';
import ResolversOperationsService from './resolver-operations.service';
import bcrypt from 'bcrypt';

class PasswordService extends ResolversOperationsService {
  constructor(root: object, variables: object, context: IContextData) {
    super(root, variables, context);
  }
  async sendMail() {
    const email = this.getVariables().user?.email || '';
    if (email === undefined || email === '') {
      return {
        status: false,
        message: 'El email no se ha definido correctamente',
      };
    }
    //coger informacion del ususario
    const user = await findOneElement(this.getDb(), COLLECTION.USERS, {
      email,
    });
    console.log(user);

    // si usuario es indefinido mandamos un mensaje
    if (user === undefined || user === null) {
      return {
        status: false,
        message: `Usuario con el email ${email} no existe`,
      };
    }
    const newUser = {
      id: user.id,
      email,
    };
    const token = new JWT().sign({ user: newUser }, EXPIRETIME.M20);
    const html = `Para cambiar de contraseña has click sobre el enlace: <a href="${process.env.CLIENT_URL}/#/reset/${token}">Clic aqui`;
    const mail = {
      to: email,
      subject: 'Peticion para cambiar de contraseña',
      html,
    };
    return new Mailservice().send(mail);
  }
  async change() {
    const id = this.getVariables().user?.id;
    let password = this.getVariables().user?.password;
    if (id === undefined || id === '') {
      return {
        status: false,
        message: 'El ID necesita una informacion correcta ',
      };
    }
    //comproba que el password es correcto no indefinido y no esta en blaco
    if (
      password === undefined ||
      password === '' ||
      password === 'Casas4558$'
    ) {
      return {
        status: false,
        message: 'El Password necesita una informacion correcta ',
      };
    }
    // Encriptar el password
    password = bcrypt.hashSync(password, 10);

    const result = await this.update(
      COLLECTION.USERS,
      { id },
      { password },
      'users'
    );
    return {
      status: result.status,
      message: result.status
        ? 'Contraseña cambiada correctamante'
        : result.message,
    };
  }
}

export default PasswordService;
