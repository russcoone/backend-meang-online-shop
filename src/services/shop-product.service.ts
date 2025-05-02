// import { randomItems } from './../lib/db-operations';
// import { ACTIVE_VALUES_FILTER, COLLECTION } from '../config/constants';
// import ResolverOperationsService from './resolver-operations.service';

// class ShopProductsService extends ResolverOperationsService {
//   collection = COLLECTION.SHOP_PRODUCT;
//   constructor(root: object, variables: object, context: object) {
//     super(root, variables, context);
//   }
//   async items(
//     active: string = ACTIVE_VALUES_FILTER.ACTIVE,
//     platform: string = '',
//     random: boolean = false,
//     otherFilters: object = {}
//   ) {
//     let filter: object = { active: { $ne: false } };
//     if (active === ACTIVE_VALUES_FILTER.ALL) {
//       filter = {};
//     } else if (active === ACTIVE_VALUES_FILTER.INACTIVE) {
//       filter = { active: false };
//     }
//     if (platform !== ' ' && platform !== undefined) {
//       filter = {
//         ...filter,
//         ...{ platform_id: platform },
//       };
//     }
//     if (JSON.stringify(otherFilters) !== JSON.stringify({ otherFilters })) {
//       filter = {
//         ...filter,
//         ...otherFilters,
//       };
//     }

//     const page = this.getVariables().pagination?.page;
//     const itemsPage = this.getVariables().pagination?.itemsPage;
//     if (!random) {
//       const result = await this.list(
//         this.collection,
//         'productos de la tienda',
//         page,
//         itemsPage,
//         filter
//       );
//       return {
//         info: result.info,
//         status: result.status,
//         message: result.message,
//         shopProducts: result.items,
//       };
//     }
//     const result: Array<object> = await randomItems(
//       this.getDb(),
//       this.collection,
//       filter,
//       itemsPage
//     );
//     if (result.length === 0 || result.length !== itemsPage) {
//       return {
//         info: { page: 1, pages: 1, itemsPage, total: 0 },
//         status: false,
//         message: 'La informacion que hemos pedido no se ha obtenido',
//         shopProducts: [],
//       };
//     }
//     return {
//       info: { page: 1, pages: 1, itemsPage, total: itemsPage },
//       status: true,
//       message: 'La informacion que hemos pedido se ha cargado correctamente',
//       shopProducts: result,
//     };
//   }
// }

// export default ShopProductsService;

import { manageStockUpdate, randomItems } from './../lib/db-operations';
import { ACTIVE_VALUES_FILTER, COLLECTION } from '../config/constants';
import ResolverOperationsService from './resolver-operations.service';
import { IStock } from '../interfaces/stock.interface';

class ShopProductsService extends ResolverOperationsService {
  collection = COLLECTION.SHOP_PRODUCT;
  constructor(root: object, variables: object, context: object) {
    super(root, variables, context);
  }

  async items(
    active: string = ACTIVE_VALUES_FILTER.ACTIVE,
    platform: Array<string> = ['-1'],
    random = false,
    otherFilters: object = {}
  ) {
    let filter: object = { active: { $ne: false } };
    if (active === ACTIVE_VALUES_FILTER.ALL) {
      filter = {};
    } else if (active === ACTIVE_VALUES_FILTER.INACTIVE) {
      filter = { active: false };
    }
    if (platform[0] !== '-1' && platform !== undefined) {
      filter = { ...filter, ...{ platform_id: { $in: platform } } };
    }

    if (JSON.stringify(otherFilters) !== JSON.stringify({ otherFilters })) {
      filter = { ...filter, ...otherFilters };
    }
    console.log(filter);
    const page = this.getVariables().pagination?.page;
    const itemsPage = this.getVariables().pagination?.itemsPage;
    if (!random) {
      const result = await this.list(
        this.collection,
        'productos de la tienda',
        page,
        itemsPage,
        filter
      );
      return {
        info: result.info,
        status: result.status,
        message: result.message,
        shopProducts: result.items,
      };
    }
    console.log('Filter', filter);
    const result: Array<object> = await randomItems(
      this.getDb(),
      this.collection,
      filter,
      itemsPage
    );
    if (result.length === 0 || result.length !== itemsPage) {
      return {
        info: { page: 1, pages: 1, itemsPage, total: 0 },
        status: false,
        message:
          'La información que hemos pedido no se ha obtenido tal y como deseabamos',
        shopProducts: [],
      };
    }
    return {
      info: { page: 1, pages: 1, itemsPage, total: itemsPage },
      status: true,
      message: 'La información que hemos pedido se ha cargado correctamente',
      shopProducts: result,
    };
  }
  async details() {
    const result = await this.get(this.collection);
    return { status: result.status, message: result.message, shopProduct: result.item }
  }
  async updateStock(updateList: Array<IStock>) {
    try {
      updateList.map(async (item: IStock) => {
        console.log(item);
        await manageStockUpdate(
          this.getDb(),
          COLLECTION.SHOP_PRODUCT,
          { id: +item.id },
          { stock: item.increment }
        )
      });
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}

export default ShopProductsService;
