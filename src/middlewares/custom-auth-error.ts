import { Core } from "@strapi/strapi";
module.exports = (_: any, { strapi }: { strapi: Core.Strapi }) => {
  return async (ctx: any, next: any) => {
    try {
      await next();
    } catch (error) {
      // Check for the specific blocked user error
      if (
        error.message === "Your account has been blocked by an administrator"
      ) {
        return ctx.badRequest(
          "Access to this account is currently disabled. Contact AI Energy Shop support for more details."
        );
      }

      // Check for the Forbidden error related to unapproved users
      if (error.status === 403) {
        return ctx.badRequest("Please wait for your account to be approved.");
      }

      if (error.message === "Invalid identifier or password") {
        return ctx.badRequest("Invalid Email or Password");
      }

      // If it's another error, re-throw it to be handled by Strapi's default error handler
      return ctx.badRequest(error.message);
    }
  };
};
