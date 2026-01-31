export default {
  files: async (_: any, args: any) => {
    try {
      const files = await strapi.documents("plugin::upload.file").findMany({
        filters: {
          ext: {
            $eq: args.filters.ext.eq,
          },
        },
      });

      // console.log(files)

      return files;
    } catch (error) {
      console.error(error);
      return [];
    }
  },
};
