export const resolversConfig = {
  Mutation: {
    customProductCreate: {
      auth: true,
      // middlewares: [
      //   createGraphQLRateLimitMiddleware('mutation'),
      // ],
    },
    customProductUpdate: {
      auth: true,
      // middlewares: [
      //   createGraphQLRateLimitMiddleware('mutation'),
      // ],
    },
    registerUser: {
      auth: false,
      // middlewares: [
      //   createGraphQLRateLimitMiddleware('auth'),
      // ],
    },
    updateUser: {
      auth: true,
      // middlewares: [
      //   createGraphQLRateLimitMiddleware('mutation'),
      // ],
    },
    deleteUsers: {
      auth: true,
      // middlewares: [
      //   createGraphQLRateLimitMiddleware('mutation'),
      // ],
    },
    deleteUser: {
      auth: true,
      // middlewares: [
      //   createGraphQLRateLimitMiddleware('mutation'),
      // ],
    },
    importProducts: {
      auth: true,
      // middlewares: [
      //   createGraphQLRateLimitMiddleware('mutation'),
      // ],
    },
    deleteProducts: {
      auth: true,
      // middlewares: [
      //   createGraphQLRateLimitMiddleware('mutation'),
      // ],
    },
    importPriceLists: {
      auth: true,
      // middlewares: [
      //   createGraphQLRateLimitMiddleware('mutation'),
      // ],
    },
    updateFile: {
      auth: true,
      // middlewares: [
      //   createGraphQLRateLimitMiddleware('upload'),
      // ],
    },

    // AUTH
  },
  Query: {
    searchProducts: {
      auth: false,
      // middlewares: [
      //   createGraphQLRateLimitMiddleware('public'),
      // ],
    },
    getStoreProducts: {
      auth: false,
      // middlewares: [
      //   createGraphQLRateLimitMiddleware('public'),
      // ],
    },
    getStoreProduct: {
      auth: false,
      // middlewares: [
      //   createGraphQLRateLimitMiddleware('public'),
      // ],
    },
    getPage: {
      auth: false,
      // middlewares: [
      //   createGraphQLRateLimitMiddleware('public'),
      // ],
    },
    files: {
      auth: true,
      // middlewares: [
      //   createGraphQLRateLimitMiddleware('general'),
      // ],
    },
    cart: {
      auth: true,
      // middlewares: [
      //   createGraphQLRateLimitMiddleware('general'),
      // ],
    },
    carts: {
      auth: true,
      // middlewares: [
      //   createGraphQLRateLimitMiddleware('general'),
      // ],
    },
    // user: {
    //   auth: true,
    // },
  },
};
