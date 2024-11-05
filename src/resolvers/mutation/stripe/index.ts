import GMR from "graphql-merge-resolvers";
import resolversStripeCustomerMutation from "./customer";
import resolversStripeCardMutation from "./card";
import resolversStripeChargerMutation from "./charge";




const mutationStripeResolver = GMR.merge([
    resolversStripeCustomerMutation,
    resolversStripeCardMutation,
    resolversStripeChargerMutation,

]);

export default mutationStripeResolver;