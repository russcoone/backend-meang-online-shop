"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const shop_product_service_1 = __importDefault(require("../../services/shop-product.service"));
const resolversShopProductsQuery = {
    Query: {
        shopProducts(_, { page, itemsPage, active }, context) {
            return new shop_product_service_1.default(_, {
                pagination: { page, itemsPage },
            }, context).items(active);
        },
        shopProductsPlatforms(_, { page, itemsPage, active, platform, random }, context) {
            return new shop_product_service_1.default(_, {
                pagination: { page, itemsPage },
            }, context).items(active, platform, random);
        },
        shopProductsOffersLast(_, { page, itemsPage, active, random, topPrice, lastUnits }, context) {
            let otherFilters = {};
            console.log(topPrice);
            if (lastUnits > 0 && topPrice > 10) {
                otherFilters = {
                    $and: [
                        {
                            price: { $lte: topPrice },
                        },
                        {
                            stock: { $lte: topPrice },
                        },
                    ],
                };
            }
            else if (lastUnits <= 0 && topPrice > 10) {
                otherFilters = { price: { $lte: topPrice } };
            }
            else if (lastUnits > 0 && topPrice <= 10) {
                otherFilters = { stock: { $lte: lastUnits } };
            }
            console.log(otherFilters);
            return new shop_product_service_1.default(_, {
                pagination: { page, itemsPage },
            }, context).items(active, ['-1'], random, otherFilters);
        },
        shopProductDetails(_, { id }, context) {
            console.log(id, typeof id);
            return new shop_product_service_1.default(_, { id }, context).details();
        }
    },
};
exports.default = resolversShopProductsQuery;
