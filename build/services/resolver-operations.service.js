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
const db_operations_1 = require("../lib/db-operations");
const pagiantion_1 = require("../lib/pagiantion");
class ResolverOperationsService {
    constructor(root, variables, context) {
        this.variables = variables;
        this.context = context;
    }
    getContext() {
        return this.context;
    }
    getDb() {
        return this.context.db;
    }
    getVariables() {
        return this.variables;
    }
    list(collection, listElement, page = 1, itemsPage = 15, filter = { active: { $ne: false } }) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const paginationData = yield (0, pagiantion_1.pagination)(this.getDb(), collection, page, itemsPage, filter);
                return {
                    info: {
                        page: paginationData.page,
                        pages: paginationData.pages,
                        itemsPage: paginationData.itemsPage,
                        total: paginationData.total,
                    },
                    status: true,
                    message: `Lista de ${listElement} correctamente cargada`,
                    items: yield (0, db_operations_1.findElements)(this.getDb(), collection, filter, paginationData),
                };
            }
            catch (error) {
                return {
                    info: null,
                    status: false,
                    message: `Lista de ${listElement} no cargada: ${error}`,
                    items: null,
                };
            }
        });
    }
    get(collection) {
        return __awaiter(this, void 0, void 0, function* () {
            const collectionLabel = collection.toLowerCase();
            try {
                return yield (0, db_operations_1.findOneElement)(this.getDb(), collection, {
                    id: this.variables.id,
                }).then((result) => {
                    if (result) {
                        return {
                            status: true,
                            message: `${collectionLabel} ha sido cargada correctamente con sus detalles`,
                            item: result,
                        };
                    }
                    return {
                        status: true,
                        message: `${collectionLabel} no ha obtenido correctamente con sus detalles`,
                        item: null,
                    };
                });
            }
            catch (error) {
                return {
                    status: false,
                    message: `Error inesperado po querer cargas los detalles ${collectionLabel} `,
                    item: null,
                };
            }
        });
    }
    add(collection, document, item) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield (0, db_operations_1.insertOneElement)(this.getDb(), collection, document).then((res) => {
                    if (res.result.ok === 1) {
                        return {
                            status: true,
                            message: `Añadido correctamente ${item}`,
                            item: document,
                        };
                    }
                    return {
                        status: false,
                        message: `No se ha insertado el ${item}. Intentalo de nuevo por favor`,
                        item: null,
                    };
                });
            }
            catch (error) {
                return {
                    status: false,
                    message: `Error inesperado al insertar el ${item}. Intentalo de nuevo por favor`,
                    item: null,
                };
            }
        });
    }
    update(collection, filter, objectUpdate, item) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield (0, db_operations_1.updateOneElement)(this.getDb(), collection, filter, objectUpdate).then((res) => {
                    if (res.result.nModified === 1 && res.result.ok) {
                        return {
                            status: true,
                            message: `Elemento ${item} actulizado correctamente`,
                            item: Object.assign({}, filter, objectUpdate),
                        };
                    }
                    return {
                        status: false,
                        message: `No se ha actualizado el ${item}. Intentalo de nuevo por favor`,
                        item: null,
                    };
                });
            }
            catch (error) {
                return {
                    status: false,
                    message: `Error inesperado al actualizar el ${item}. Intentalo de nuevo por favor`,
                    item: null,
                };
            }
        });
    }
    del(collection, filter, item) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield (0, db_operations_1.deleteOneElement)(this.getDb(), collection, filter).then((res) => {
                    if (res.deletedCount === 1) {
                        return {
                            status: true,
                            message: `Elemento de ${item} eliminado correctamente`,
                        };
                    }
                    return {
                        status: false,
                        message: `Elemento de ${item} No se ha borrado correctamente con prueba el filtro`,
                    };
                });
            }
            catch (error) {
                return {
                    status: false,
                    message: `Error inesperado al eliminar el ${item}. Intentalo de nuevo por favor`,
                };
            }
        });
    }
}
exports.default = ResolverOperationsService;
