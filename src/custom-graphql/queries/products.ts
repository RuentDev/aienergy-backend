import { FILTER_KEYS } from "../../constant";

export default {
  searchProducts: async (_: any, args: { query: string }) => {
    const { query } = args;

    try {
      const searchWords = query
        .trim()
        .split(/\s+/)
        .filter((word) => word.length > 0);

      const wordMatchConditions = {
        $or: searchWords.map((word) => ({
          $or: FILTER_KEYS.map((key) => {
            if (key === "brand") {
              return {
                brand: {
                  $or: [
                    { name: { $containsi: word } },
                    { handle: { $containsi: word } },
                  ],
                },
              };
            }

            if (key === "specifications") {
              return {
                specifications: {
                  value: { $containsi: word },
                },
              };
            }
            return {
              [key]: {
                $containsi: word,
              },
            };
          }),
        })),
      };

      const products = await strapi.documents("api::product.product").findMany({
        filters: {
          $or: [
            {
              $or: [
                {
                  name: { $containsi: query },
                },
                {
                  model: { $containsi: query },
                },
                {
                  product_type: { $containsi: query },
                },
                {
                  brand: {
                    name: { $containsi: query },
                  },
                },
                {
                  specifications: {
                    $or: searchWords?.map?.((item) => ({
                      value: { $containsi: item },
                    })),
                  },
                },
              ],
            },
            // { ...wordMatchConditions },
          ],
          releasedAt: { $notNull: true },
        },
        sort: {
          name: "asc",
        },
      });
      return products;
    } catch (error) {
      return error;
    }
  },
  getStoreProducts: async (_: any, args: any) => {
    const { filters, pagination, sort } = args;
    const products = await strapi.documents("api::product.product").findMany({
      filters,
      pagination,
      sort,
      populate: {
        brand: true,
        tags: true,
        collections: true,
        inventory: true,
        shipping: true,
        price_lists: true,
        key_features: true,
        specifications: true,
        files: true,
        images: true,
      },
    });

    return products;
  },
  getStoreProduct: async (_: any, args: any) => {
    const { handle } = args;
    const product = await strapi.documents("api::product.product").findFirst({
      filters: {
        handle: handle,
        releasedAt: { $notNull: true },
      },
      populate: {
        files: true,
        images: true,
        brand: true,
        tags: true,
        collections: true,
        inventory: true,
        shipping: true,
        price_lists: true,
        key_features: true,
        specifications: true,
      },
    });

    return product;
  },
};
