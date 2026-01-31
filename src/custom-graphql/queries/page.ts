export default {
  getPage: async (_: any, { slug }: { slug: string }) => {
    try {
      if (!slug || slug === null || slug === "/" || slug === "") {
        const homepage = await strapi.documents("api::page.page").findFirst({
          filters: {
            slug: "/",
          },
        });

        return homepage;
      }

      const res = await strapi.documents("api::page.page").findFirst({
        filters: {
          slug: slug,
        },
      });

      return res;
    } catch (error) {}
  },
};
