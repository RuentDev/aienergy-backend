module.exports = (plugin) => {
  const rawAuth = plugin.controllers.auth({ strapi });

  const auth = () => {
    return {
      ...rawAuth,
      register: async (ctx: any, next: any) => {
        const requestMethod = ctx.request.method;
        const requestUrl = ctx.request.url;

        // Fix: Use OR instead of AND for the condition
        if (
          requestMethod !== "POST" ||
          requestUrl !== "/api/auth/local/register"
        ) {
          await rawAuth.register(ctx);
        }

        try {
          // Validate required fields exist
          const { business_name, business_number, username, email } =
            ctx.request.body;

          if (!business_name || !business_number) {
            return ctx.badRequest(
              "Business name and business number are required."
            );
          }

          // Check if business name already exists
          const existingBusinessName = await strapi
            .documents("plugin::users-permissions.user")
            .findFirst({
              filters: {
                business_name: {
                  $eq: business_name,
                },
              },
            });

          if (existingBusinessName) {
            return ctx.badRequest("Business name already exists.");
          }

          // Check if business number already exists
          const existingBusinessNumber = await strapi
            .documents("plugin::users-permissions.user")
            .findFirst({
              filters: {
                business_number: {
                  $eq: business_number,
                },
              },
            });

          if (existingBusinessNumber) {
            return ctx.badRequest("Business number already exists.");
          }

          // Check if username already exists
          const existingUsername = await strapi
            .documents("plugin::users-permissions.user")
            .findFirst({
              filters: {
                username: {
                  $eq: username,
                },
              },
            });

          if (existingUsername) {
            return ctx.badRequest("Username already exists.");
          }

          // Check if email already exists
          const existingEmail = await strapi
            .documents("plugin::users-permissions.user")
            .findFirst({
              filters: {
                email: {
                  $eq: email,
                },
              },
            });

          if (existingEmail) {
            return ctx.badRequest("Email already exists.");
          }

          await rawAuth.register(ctx);
        } catch (error) {
          console.error("Error in strapi-server: ", error);
          return ctx.internalServerError(
            "An error occurred during validation."
          );
        }
      },
      // Keep the callback method for GraphQL/OAuth flows
      callback: async (ctx: any) => {
        const { identifier } = ctx.request.body;

        await rawAuth.callback(ctx);
        // Step 3: Fetch the user with additional populated data
        const user = await strapi
          .documents("plugin::users-permissions.user")
          .findFirst({
            filters: {
              $or: [{ email: identifier }, { username: identifier }],
            },
            fields: [
              "name",
              "username",
              "email",
              "phone",
              "blocked",
              "account_status",
              "business_name",
              "business_number",
              "business_type",
              "odoo_user_id",
              "stripeCustomerID",
              "user_level",
              "refreshToken",
              "tokenVersion",
              "confirmed",
              "createdAt",
              "updatedAt",
            ],
            populate: {
              role: {
                fields: ["name"],
              },
            },
          });

        if (user.role.name === "PUBLIC") {
          return ctx.badRequest(
            "This account is currently pending approval. You will be notified once the account is approved."
          );
        }

        if (user) {
          // Step 4: Merge the new data into the existing user object in the response
          ctx.body["user"] = {
            ...user,
          };
        }
      },
    };
  };
  plugin.controllers.auth = auth;
  return plugin;
};
