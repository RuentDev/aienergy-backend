import PRODUCT_QUERIES from "./queries/products";
import PAGE_QUERIES from "./queries/page";
import COLLECTION_QUERIES from "./queries/collections";
import FILES_QUERIES from "./queries/files";
import USER_QUERIES from "./queries/user";

import PRICE_MUTATIONS from "./mutations/price";
import PRODUCT_MUTATIONS from "./mutations/product";
import FILE_MUTATIONS from "./mutations/file";
import USER_MUTATIONS from "./mutations/user";

export const resolvers = {
  Mutation: {
    ...PRICE_MUTATIONS,
    ...PRODUCT_MUTATIONS,
    ...FILE_MUTATIONS,
    ...USER_MUTATIONS,
  },
  Query: {
    ...PRODUCT_QUERIES,
    ...PAGE_QUERIES,
    ...COLLECTION_QUERIES,
    ...FILES_QUERIES,
    ...USER_QUERIES,
  },
};
