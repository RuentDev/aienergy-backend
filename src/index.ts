import graphqlExtensionServiceExtension from "./extension-service/graphql-extension-service";
import { sendMail } from "./utils/send-mail";
import type { Core } from "@strapi/strapi";
import {
  registerUserEmailTemplate,
  approvedUserEmailTemplate,
  internalWaitingForApprovalEmailTemplate,
} from "./constant/email-templates";

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }: { strapi: Core.Strapi }) {
    // Add your logic here
    const graphqlExtensionService = strapi
      .plugin("graphql")
      .service("extension");

    // userPermissionsExtensionService.use(test);
    graphqlExtensionService.use(graphqlExtensionServiceExtension);
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }: { strapi: Core.Strapi }) {
    strapi.db.lifecycles.subscribe({
      models: ["plugin::users-permissions.user"],
      afterCreate: async (event) => {
        // console.log("AFTER CREATE", event.model.singularName);
        const { action, result, model, params } = event;

        try {
          const roleData = await strapi
            .documents("plugin::users-permissions.role")
            .findFirst({
              filters: {
                users: {
                  documentId: {
                    $eq: event.result.documentId,
                  },
                },
              },
            });

          if (roleData && roleData?.type === "public") {
            await strapi.documents("api::name.name").create({
              data: {
                first_name: params.data.name.first_name,
                last_name: params.data.name.last_name,
                user: event.result.documentId,
              },
              populate: {
                user: true,
              },
            });

            await strapi.documents("api::address.address").create({
              data: {
                title: "Default",
                street1: params.data.street1,
                street2: params.data.street2,
                city: params.data.city,
                state: params.data.state,
                phone: params.data.phone,
                zip_code: params.data.zip_code,
                country: params.data.country,
                isActive: true,
                user: event.result.documentId,
              },
              populate: {
                user: true,
              },
            });

            // create notification for new user
            const userWithNotification = await strapi
              .documents("plugin::users-permissions.user")
              .findMany({
                filters: {
                  role: {
                    name: {
                      $in: ["SALES", "ADMIN"],
                    },
                  },
                },
                populate: {
                  role: true,
                },
              });
            userWithNotification.forEach(async (user) => {
              await strapi.documents("api::notification.notification").create({
                data: {
                  message: "New user registered",
                  type: "new_user",
                  trigger_user: event.result.documentId,
                  admin_user: user.documentId,
                },
              });
            });
            // 1.0
          }
          await fetch(`${process.env.N8N_WEBHOOK_URL}/create-user`, {
            method: "POST",
            body: JSON.stringify(result),
            headers: {
              "Content-Type": "application/json",
            },
          });
        } catch (error) {
          console.log(
            "AFTER CREATE ERROR:" + model.singularName + action,
            error,
          );
        }
      },
      afterUpdate: async (event) => {
        // console.log("AFTER UPDATE", event);
        const { action, result, model, params } = event;

        const accountConfirmed = result.confirmed;
        const accountIsPending = result.account_status === "PENDING";
        const userConfirmedEmail = accountConfirmed && accountIsPending;
        if (userConfirmedEmail) {
          const mailRecipientData = await strapi
            .documents("plugin::users-permissions.user")
            .findMany({
              filters: {
                role: {
                  name: {
                    $eq: process.env.SMTP_MAIL_RECIPIENT_ROLE_NAME,
                  },
                },
              },
            });
          const salesEmails = mailRecipientData.map((sale) => sale.email);

          if (salesEmails.length === 0) return;

          // send email to user
          try {
            sendMail(strapi, {
              to: result.email,
              from: process.env.SMTP_FROM_EMAIL,
              subject: "Account Registration Pending",
              text: "Account Registration Pending",
              html: registerUserEmailTemplate(result),
            });
          } catch (error) {
            console.log("Error sending user email: ", error.message);
          }

          // send email to sales
          try {
            sendMail(strapi, {
              to: salesEmails.join(","),
              from: process.env.SMTP_FROM_EMAIL,
              subject: "Someone has registered an account",
              text: "Someone has registered an account",
              html: internalWaitingForApprovalEmailTemplate(event.result),
            });
          } catch (error) {
            console.log("Error sending sales email: ", error.message);
          }
        }

        /*
              check if ROLE is existing  on params,
              It means this the user just approved recently
            */
        if (params.data.role) {
          // send email to user
          try {
            sendMail(strapi, {
              to: result.email,
              from: process.env.SMTP_FROM_EMAIL,
              subject: "Your account has been approved",
              text: "Your account has been approved",
              html: approvedUserEmailTemplate(result),
            });
          } catch (error) {
            console.log("Error sending user email: ", error.message);
          }
        }

        try {
          await fetch(`${process.env.N8N_WEBHOOK_URL}/update-user`, {
            method: "POST",
            body: JSON.stringify(result),
            headers: {
              "Content-Type": "application/json",
            },
          });
        } catch (error) {
          console.log("ERROR:" + model.singularName + action, error);
        }
      },
    });
  },
};
