"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.STRIPE_ACTION = exports.STRIPE_OBJECTS = void 0;
exports.STRIPE_OBJECTS = {
    CHARGES: 'charges',
    CUSTOMERS: 'customers',
    TOKENS: 'tokens'
};
exports.STRIPE_ACTION = {
    CREATE: 'create',
    CREATE_SOURCE: 'createSource',
    DELETE: 'del',
    DELETE_SOURCE: 'deleteSource',
    GET: 'retrieve',
    GET_SOURCE: 'retrieveSource',
    LIST: 'list',
    LIST_SOURCE: 'listSources',
    UPDATE: 'update',
    UPDATE_SOURCE: 'updateSource',
};
class StripeApi {
    constructor() {
        this.stripe = require('stripe')(process.env.STRIPE_API_KEY, {
            apiVersion: process.env.STRIPE_API_VERSION
        });
    }
    execute(object, action, ...args) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.stripe[object][action](...args);
        });
    }
    getError(error) {
        return __awaiter(this, void 0, void 0, function* () {
            {
                return {
                    status: false,
                    message: 'Error: '.concat(error.message),
                    hashMore: false,
                    customer: undefined,
                    card: undefined,
                    cards: undefined,
                };
            }
        });
    }
    getPagination(startingAfter, endingBefore) {
        let pagination;
        if (startingAfter !== '' && endingBefore === '') {
            pagination = { starting_after: startingAfter };
        }
        else if (startingAfter == '' && endingBefore !== '') {
            pagination = { ending_before: endingBefore };
        }
        else {
            pagination = {};
        }
        ;
        return pagination;
    }
}
exports.default = StripeApi;
