import {
  RegisterUserInput,
  UserApprovalRequestInput,
} from "../../../types/custom";
import { sendMail } from "../../utils/send-mail";

export default {
  registerUser: async (_: any, args: { data: RegisterUserInput }) => {
    try {
      //  Check if the email already exists
      const useremail = await strapi
        .documents("plugin::users-permissions.user")
        .findFirst({
          filters: {
            email: {
              $contains: args.data.email,
            },
          },
        });

      //  Throw an error if the email already exists
      if (useremail) {
        throw new Error("Email already exists!");
      }

      //  Check if the username already exists
      const username = await strapi
        .documents("plugin::users-permissions.user")
        .findFirst({
          filters: {
            username: {
              $contains: args.data.username,
            },
          },
        });

      //  Throw an error if the username already exists
      if (username) {
        throw new Error("Username already exists!");
      }

      //  Check if the business name already exists
      const businessName = await strapi
        .documents("plugin::users-permissions.user")
        .findFirst({
          filters: {
            business_name: {
              $contains: args.data.businessName,
            },
          },
        });

      //  Throw an error if the business name already exists
      if (businessName) {
        throw new Error("Business name already exists!");
      }

      //  Check if the business number already exists
      const businessNumber = await strapi
        .documents("plugin::users-permissions.user")
        .findFirst({
          filters: {
            business_number: {
              $contains: args.data.businessNumber,
            },
          },
        });

      //  Throw an error if the business number already exists
      if (businessNumber) {
        throw new Error("Business number already exists!");
      }

      //  Create the address
      const address = await strapi.documents("api::address.address").create({
        data: {
          title: "Default",
          street1: args.data.street1,
          street2: args.data.street2,
          city: args.data.city,
          state: args.data.state,
          phone: args.data.phone,
          zip_code: args.data.zipCode,
          country: args.data.country,
          isActive: true,
        },
      });

      //  Create the user
      const createdUser = await strapi
        .documents("plugin::users-permissions.user")
        .create({
          data: {
            provider: "local",
            email: args.data.email,
            username: args.data.username,
            business_name: args.data.businessName,
            business_number: args.data.businessNumber,
            business_type: args.data.businessType,
            password: args.data.password,
            phone: args.data.phone,
            account_status: "PENDING",
            addresses: {
              connect: [address.documentId],
            },
          },
          populate: {
            addresses: true,
          },
        });

      //  Return the created user
      return createdUser;
    } catch (err) {
      return err;
    }
  },
  approvedUser: async (_: any, args: UserApprovalRequestInput) => {
    try {
      const { documentId, data } = args;

      //  Get the user data
      const userData = await strapi
        .documents("plugin::users-permissions.user")
        .findOne({
          documentId: documentId,
          populate: {
            role: true,
          },
        });

      const isApproved = data.account_status.includes("APPROVED") || false;
      const currentStatus = userData.account_status;

      //  Check if the user exists
      if (!userData) {
        throw new Error("User not found!");
      }

      //  Check if the user has been processed
      if (
        currentStatus.includes("APPROVED") ||
        currentStatus.includes("DENIED")
      ) {
        throw new Error(
          `User has been processed and marked as "${currentStatus}"`,
        );
      }

      //  Get the roles
      const role = await strapi
        .documents("plugin::users-permissions.role")
        .findFirst({
          filters: {
            name: {
              $contains: "CUSTOMER",
            },
          },
        });

      //  Update the user
      const userUpdate = await strapi
        .documents("plugin::users-permissions.user")
        .update({
          documentId: userData.documentId,
          data: {
            role: isApproved && role ? role.documentId : null,
            createAccountRequest: isApproved ? Date.now() : null,
            account_status: isApproved ? "APPROVED" : data.account_status,
          },
          populate: {
            role: true,
          },
        });

      return userUpdate;
    } catch (err) {
      return err;
    }
  },
  updateUser: async (_: any, args: { documentId: string; data: any }) => {
    try {
      const { documentId, data } = args;
      const user = await strapi
        .documents("plugin::users-permissions.user")
        .update({
          documentId: documentId,
          data: data,
        });

      return user;
    } catch (error) {
      console.error("Error updating user status:", error.message);
      return error;
    }
  },
  deleteUser: async (_: any, args: { documentId: string }) => {
    try {
      const user = await strapi
        .documents("plugin::users-permissions.user")
        .findFirst({
          filters: {
            documentId: {
              $eq: args.documentId,
            },
          },
          populate: {
            addresses: true,
            carts: true,
            creditCards: true,
            orders: true,
          },
        });

      if (user.addresses) {
        await strapi.query("api::address.address").deleteMany({
          where: {
            documentId: {
              $in: user.addresses.map((address) => address.documentId),
            },
          },
        });
      }
      if (user.carts) {
        await strapi.query("api::cart.cart").deleteMany({
          where: {
            documentId: {
              $in: user.carts.map((cartItem) => cartItem.documentId),
            },
          },
        });
      }
      if (user.creditCards) {
        await strapi.query("api::credit-card.credit-card").deleteMany({
          where: {
            documentId: {
              $in: user.creditCards.map((creditCard) => creditCard.documentId),
            },
          },
        });
      }

      if (user.orders) {
        await strapi.query("api::order.order").deleteMany({
          where: {
            documentId: {
              $in: user.orders.map((order) => order.documentId),
            },
          },
        });
      }

      const deletedUser = await strapi
        .documents("plugin::users-permissions.user")
        .delete({
          documentId: user.documentId,
        });

      return deletedUser;
    } catch (error) {
      console.error("Error deleting users:", error.message);
      return error;
    }
  },
  deleteUsers: async (_: any, args: { documentIds: string[] }) => {
    try {
      const users = await strapi
        .documents("plugin::users-permissions.user")
        .findMany({
          filters: {
            documentId: {
              $in: args.documentIds,
            },
          },
          populate: {
            addresses: true,
            carts: true,
            creditCards: true,
            orders: true,
          },
        });

      users.forEach(async (user) => {
        if (user.addresses) {
          await strapi.query("api::address.address").deleteMany({
            where: {
              documentId: {
                $in: user.addresses.map((address) => address.documentId),
              },
            },
          });
        }

        if (user.carts) {
          await strapi.query("api::cart.cart").deleteMany({
            where: {
              documentId: {
                $in: user.carts.map((cartItem) => cartItem.documentId),
              },
            },
          });
        }

        if (user.creditCards) {
          await strapi.query("api::credit-card.credit-card").deleteMany({
            where: {
              documentId: {
                $in: user.creditCards.map(
                  (creditCard) => creditCard.documentId,
                ),
              },
            },
          });
        }

        if (user.orders) {
          await strapi.query("api::order.order").deleteMany({
            where: {
              documentId: {
                $in: user.orders.map((order) => order.documentId),
              },
            },
          });
        }
      });

      const userIds = users.map((user) => user.documentId);

      await strapi.query("plugin::users-permissions.user").deleteMany({
        where: {
          documentId: {
            $in: userIds,
          },
        },
      });

      return {
        success: userIds,
      };
    } catch (error) {
      console.error("Error deleting users:", error.message);
      return error;
    }
  },
  submitInquery: async (_: any, args: { [key: string]: any }) => {
    const { text, html } = args;
    try {
      const recipients = await strapi
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
      const recipientsEmails = recipients.map((recipient) => recipient.email);

      // send email to user
      await sendMail(strapi, {
        to: recipientsEmails.join(","),
        from: process.env.SMTP_FROM_EMAIL,
        subject: "New Inquery",
        text: text,
        html: html,
      });
      return {
        message: "Email sent successfully",
        success: true,
      };
    } catch (error) {
      return {
        message: error.message,
        success: false,
      };
    }
  },
  registerForNews: async (_: any, args: { [key: string]: any }) => {
    const { companyName, email } = args;

    try {
      const user = await strapi
        .documents("plugin::users-permissions.user")
        .findFirst({
          filters: {
            $or: [
              { email: email },
              { username: email },
              { business_name: companyName },
            ],
          },
        });

      if (user) {
        await strapi.documents("plugin::users-permissions.user").update({
          documentId: user.documentId,
          data: {
            isRegisteredForNews: true,
          },
        });
        return {
          message: "Registration Successful",
          success: true,
        };
      } else {
        await strapi.documents("plugin::users-permissions.user").create({
          data: {
            username: email,
            email: email,
            business_name: companyName,
            account_status: "PENDING",
            isRegisteredForNews: true,
          },
        });
        return {
          message: "Registration Successful",
          success: true,
        };
      }
    } catch (error) {
      return error;
    }
  },
};
