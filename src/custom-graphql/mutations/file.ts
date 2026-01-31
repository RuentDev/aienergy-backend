export default {
  updateFile: async (_: any, args: { [key: string]: any }) => {
    try {
      const updatedFile = await strapi.documents("plugin::upload.file").update({
        documentId: args.documentId,
        data: {
          ...args.data,
        },
      });
      return updatedFile;
    } catch (error) {
      return error;
    }
  },
};
