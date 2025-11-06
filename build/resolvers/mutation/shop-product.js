"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const shop_product_service_1 = __importDefault(require("../../services/shop-product.service"));
const resolverShopProductMutation = {
    Mutation: {
        updateStock(_, { update }, { db, pubsub }) {
            console.log(update);
            return new shop_product_service_1.default(_, {}, { db }).updateStock(update, pubsub);
        }
    }
};
exports.default = resolverShopProductMutation;
