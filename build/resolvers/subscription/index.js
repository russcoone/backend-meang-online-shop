"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_merge_resolvers_1 = __importDefault(require("graphql-merge-resolvers"));
const shop_product_1 = __importDefault(require("./shop-product"));
const subscriptionResolvers = graphql_merge_resolvers_1.default.merge([
    shop_product_1.default
]);
exports.default = subscriptionResolvers;
