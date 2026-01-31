export default {
  getCollectionWithProducts: async (_: any, args: { handle: string }) => {
    try {
      const { handle } = args;
      const collection = await strapi
        .documents("api::collection.collection")
        .findFirst({
          filters: {
            handle: handle,
          },
          populate: {
            products: true,
          },
        });

      return {
        ...collection,
        products_connection: {
          nodes: collection.products,
          pageInfo: {
            total: collection.products.length,
          },
        },
      };

      // return collection;
    } catch (error) {
      console.error(error);
      return null;
    }
  },
};
