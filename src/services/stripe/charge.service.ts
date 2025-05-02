import { IStripeCharge } from "../../interfaces/striper/charge.interface";
import { IPayment } from "../../interfaces/striper/payment.interface";
import StripeApi, { STRIPE_ACTION, STRIPE_OBJECTS } from "../../lib/stripe-api";
import StripeCardService from "./card.service";
import StripeCustomerService from "./customer.service";

class StripeChargeService extends StripeApi {
    private async getClient(customer: string) {
        return new StripeCustomerService().get(customer)
    }
    async order(payment: IPayment) {
        //comprobar que existe el cliente
        const userData = await this.getClient(payment.customer);
        if (userData && (userData).status) {
            console.log('cliente en contrado')
            if (payment.token !== undefined) {
                // asociar el cliente a la tarjeta
                const cardCreate = await new StripeCardService().create(
                    payment.customer, payment.token
                );

                //Actualizar como fuente predeterminada de pago
                await new StripeCustomerService().update(
                    payment.customer, {
                    default_source: cardCreate.card?.id
                }
                );

                // Actualizar como fuente predeterminada de pago
                await new StripeCustomerService().update(
                    payment.customer, {
                    default_source: cardCreate.card?.id
                }
                )

                // actulizando borrado las demas tarjetas de ese cliente
                await new StripeCardService().removeOtherCards(payment.customer, cardCreate.card?.id || '')
            } else if (payment.token === undefined && userData.customer?.default_source === null) {
                return {
                    status: false,
                    message: 'El cliente no tiene ningun metodo de pago asignado'
                }

            }
        } else {
            return {
                status: false,
                message: 'El cliente no encontrado y no  se puede realizar el pago'
            };

        }

        delete payment.token


        //convertir a cero deimal
        payment.amount = Math.round((+payment.amount + Number.EPSILON) * 100) / 100;
        console.log(payment.amount);
        payment.amount *= 100;

        return await this.execute(
            STRIPE_OBJECTS.CHARGES,
            STRIPE_ACTION.CREATE,
            payment,
        ).then((result: object) => {
            return {
                status: true,
                message: 'Pago realizado correctamente',
                charge: result
            };
        }).catch((error: Error) => this.getError(error));
    }
    async listByCustomer(customer: string, limit: number, startingAfter: string,
        endingBefore: string) {
        const pagination = this.getPagination(startingAfter, endingBefore);
        return this.execute(
            STRIPE_OBJECTS.CHARGES,
            STRIPE_ACTION.LIST,
            {
                limit, customer, ...pagination
            }
        ).then((result: { has_more: boolean; data: Array<IStripeCharge> }) => {
            return {
                status: true,
                message:
                    'Lista cargada correctamente con los pagos  clientes seleccionados',
                hasMore: result.has_more,
                charges: result.data


            };
        })
            .catch((error: Error) => this.getError(error))
    }
}

export default StripeChargeService