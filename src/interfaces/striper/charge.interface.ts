export interface IStripeCharge {
    id: string;
    amount: number;
    status: string;
    receiptEmail: string;
    receiptUrl: string;
    paid: string;
    created: string;
    typeOrder: string;
    description: string;
    card: string;
    cusomer: string;

}