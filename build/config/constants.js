"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SUBSCRIPTIONS_EVENT = exports.ACTIVE_VALUES_FILTER = exports.EXPIRETIME = exports.MESSAGES = exports.COLLECTION = exports.SECRET_KEY = void 0;
const environments_1 = __importDefault(require("./environments"));
if (process.env.NODE_ENV !== 'production') {
    const env = environments_1.default;
}
exports.SECRET_KEY = process.env.SECRET || 'abrahamcomservicetiendaOnlineGraphql';
var COLLECTION;
(function (COLLECTION) {
    COLLECTION["USERS"] = "users";
    COLLECTION["GENRES"] = "genres";
    COLLECTION["TAGS"] = "tags";
    COLLECTION["SHOP_PRODUCT"] = "products_platforms";
    COLLECTION["PLATFORMS"] = "platforms";
    COLLECTION["PRODUCTS"] = "products";
})(COLLECTION = exports.COLLECTION || (exports.COLLECTION = {}));
var MESSAGES;
(function (MESSAGES) {
    MESSAGES["TOKEN_VERIFICATION_FAILT"] = "token no valido inicia sesion de nuevo";
})(MESSAGES = exports.MESSAGES || (exports.MESSAGES = {}));
var EXPIRETIME;
(function (EXPIRETIME) {
    EXPIRETIME[EXPIRETIME["H1"] = 3600] = "H1";
    EXPIRETIME[EXPIRETIME["H24"] = 86400] = "H24";
    EXPIRETIME[EXPIRETIME["M1"] = 900] = "M1";
    EXPIRETIME[EXPIRETIME["M20"] = 1200] = "M20";
    EXPIRETIME[EXPIRETIME["D3"] = 259200] = "D3";
})(EXPIRETIME = exports.EXPIRETIME || (exports.EXPIRETIME = {}));
var ACTIVE_VALUES_FILTER;
(function (ACTIVE_VALUES_FILTER) {
    ACTIVE_VALUES_FILTER["ALL"] = "ALL";
    ACTIVE_VALUES_FILTER["ACTIVE"] = "ACTIVE";
    ACTIVE_VALUES_FILTER["INACTIVE"] = "INACTIVE";
})(ACTIVE_VALUES_FILTER = exports.ACTIVE_VALUES_FILTER || (exports.ACTIVE_VALUES_FILTER = {}));
var SUBSCRIPTIONS_EVENT;
(function (SUBSCRIPTIONS_EVENT) {
    SUBSCRIPTIONS_EVENT["UPDATE_STOCK_PRODUCT"] = "UPDATE_STOCK_PRODUCT";
})(SUBSCRIPTIONS_EVENT = exports.SUBSCRIPTIONS_EVENT || (exports.SUBSCRIPTIONS_EVENT = {}));
