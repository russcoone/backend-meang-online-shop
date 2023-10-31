import { COLLECTION } from './../config/constants';
import ResolversOperationsService from './resolver-operations.service';

class PlatformService extends ResolversOperationsService {
  collection = COLLECTION.PLATFORMS;
  constructor(root: object, variables: object, context: object) {
    super(root, variables, context);
  }

  async details() {
    const result = await this.get(this.collection);
    return {
      status: result.status,
      message: result.message,
      platform: result.item,
    };
  }
}

export default PlatformService;
