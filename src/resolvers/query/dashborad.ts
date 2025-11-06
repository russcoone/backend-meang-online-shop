import { IResolvers } from "graphql-tools";
import { countElements } from "../../lib/db-operations";



const resolverDashboardQuery: IResolvers = {
    Query: {
        async totalElements(_, { collection }, { db }) {
            return await countElements(db, collection)
        }
    }
}
export default resolverDashboardQuery