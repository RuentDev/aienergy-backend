export default {
  user: async (
    _: any,
    args: { filters: { email: string; username: string } },
  ) => {
    try {
      const user = await strapi
        .documents("plugin::users-permissions.user")
        .findFirst({
          filters: {
            $or: [
              { email: args.filters.email },
              { username: args.filters.username },
            ],
          },
        });

      return user;
    } catch (error) {
      console.error("Error getting user:", error.message);
      return error;
    }
  },
};
