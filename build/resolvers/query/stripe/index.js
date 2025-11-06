"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_merge_resolvers_1 = __importDefault(require("graphql-merge-resolvers"));
const customer_1 = __importDefault(require("./customer"));
const card_1 = __importDefault(require("./card"));
const charge_1 = __importDefault(require("./charge"));
const queryStripeResolvers = graphql_merge_resolvers_1.default.merge([
    customer_1.default,
    card_1.default,
    charge_1.default
]);
exports.default = queryStripeResolvers;
