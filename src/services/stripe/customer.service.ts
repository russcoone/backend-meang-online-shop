import { IStripeCustomer } from "../../interfaces/striper/customer.interface";
import StripeApi, { STRIPE_ACTION, STRIPE_OBJECTS } from "../../lib/stripe-api";
import { IUser } from "../../interfaces/user.interface";
import { findOneElement } from "../../lib/db-operations";
import UsersService from "../users.service";
import { COLLECTION } from "../../config/constants";
import { Db } from "mongodb";


class StripeCustomerService extends StripeApi {
  //cliente lista

  async list(limit: number, startingAfter: string, endingBefore: string) {
    const pagination = this.getPagination(startingAfter, endingBefore)


    return await this.execute(
      STRIPE_OBJECTS.CUSTOMERS,
      STRIPE_ACTION.LIST,
      { limit, ...pagination }
    ).then((result: { has_more: boolean, data: Array<IStripeCustomer> }) => {
      return {
        status: true,
        message: 'Lista cargada correctamente con los clientes seleccionado',
        hasMore: result.has_more,
        customers: result.data
      };

    }).catch((error: Error) => this.getError(error))
  }
  async get(id: string) {
    return await this
      .execute(STRIPE_OBJECTS.CUSTOMERS, STRIPE_ACTION.GET, id)
      .then(async (result: IStripeCustomer) => {
        return {
          status: true,
          message: `El cliente ${result.name} se ha obtenido correctamente`,
          customer: result,
        }

      }).catch((error: Error) => this.getError(error));

  }
  async add(name: string, email: string, db: Db) {
    // Comprobar que el usuario no existe y en el caso de que exista 
    // devolviendo que no se puede añadir
    const userCheckExist: { data: Array<IStripeCustomer> } = await this.execute(
      STRIPE_OBJECTS.CUSTOMERS,
      STRIPE_ACTION.LIST,
      { email }
    );
    if (userCheckExist.data.length > 0) {
      //usuario Existe
      return {
        status: false,
        message: `El usuario con el email ${email} ya exixte en el sistema`
      }

    };

    return await this
      .execute(STRIPE_OBJECTS.CUSTOMERS, STRIPE_ACTION.CREATE, {
        name,
        email,
        description: `${name} (${email})`,
      }).then(async (result: IStripeCustomer) => {
        //Actualizar en nuestra base de datos conmla nueva

        // propiedad que es el id del cliente
        const user: IUser = await findOneElement(db, COLLECTION.USERS, { email },
        );
        if (user) {
          user.stripeCustomer = result.id;
          const resultUserOperation = await new UsersService({}, { user }, { db }).modify();
          console.log(resultUserOperation);

          // si el resultado es falso no se ha ejecutado


        }
        return {
          status: true,
          message: `El cliente ${name} se ha creado correctamente`,
          customer: result
        };

      }).catch((error: Error) => this.getError(error));
  }
  async update(id: string, customer: IStripeCustomer) {
    return await this.execute(
      STRIPE_OBJECTS.CUSTOMERS,
      STRIPE_ACTION.UPDATE,
      id,
      customer
    ).then((result: IStripeCustomer) => {
      return {
        status: true,
        message: `Usuario ${id} actualizado correctamente`,
        customer: result
      };
    }).catch((error: Error) => this.getError(error));
  }

  async delete(id: string, db: Db) {

    return await this.execute(
      STRIPE_OBJECTS.CUSTOMERS,
      STRIPE_ACTION.DELETE,
      id
    ).then(async (result: { id: string, deleted: boolean }) => {
      if (result.deleted) {
        const resultOperation = await db.collection(COLLECTION.USERS).updateOne({ stripeCustomer: result.id }, { $unset: { stripeCustomer: result.id } })
        return {
          status: result.deleted && resultOperation ? true : false,
          message: result.deleted && resultOperation ?
            ` Usuario ${id} Borrado correctamente` :
            `Usuario no se ha borrado correctamanete en la base de datos nuestra`,

        };
      }
      return {
        status: false,
        message: `Usuario ${id} NO SE HA borrado Compruebalo`,
      };
    }).catch((error: Error) => this.getError)
  }

}


export default StripeCustomerService;