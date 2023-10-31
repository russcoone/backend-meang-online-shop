import { COLLECTION } from './../config/constants';
import ResolversOperationsService from './resolver-operations.service';

class ProductService extends ResolversOperationsService {
  collection = COLLECTION.PRODUCTS;
  constructor(root: object, variables: object, context: object) {
    super(root, variables, context);
  }

  async details() {
    const result = await this.get(this.collection);
    return {
      status: result.status,
      message: result.message,
      product: result.item,
    };
  }
}

export default ProductService;
