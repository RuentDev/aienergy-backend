module.exports = {
  async afterCreate(event) {
    console.log("AFTER CREATE ORDER");
    const { action, result, model } = event;

    try {
      const order = await strapi.documents("api::order.order").findFirst({
        filters: {
          documentId: result.documentId,
        },
        populate: {
          shippingAddress: true,
          shippingOption: true,
          pickupOption: true,
          lineItems: {
            populate: ["line"],
          },
          warehouseLocation: {
            populate: ["address"],
          },
          total: true,
          payments: {
            populate: ["cardDetails"],
          },
          emailSent: true,
          user: {
            fields: [
              "business_name",
              "business_number",
              "phone",
              "email",
              "odoo_user_id",
            ],
          },
        },
      });

      const res = await fetch(`${process.env.N8N_WEBHOOK_URL}/create-order`, {
        method: "POST",
        body: JSON.stringify(order),
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log(res)
    } catch (error) {
      console.log(
        "ERROR CALLING N8N WEBHOOK:" + model.singularName + action,
        error
      );
    }
  },
  async afterUpdate(event) {
    console.log("AFTER UPDATE ORDER");
    const { action, result, model } = event;
    try {
      await fetch(`${process.env.N8N_WEBHOOK_URL}/update-order`, {
        method: "POST",
        body: JSON.stringify(result),
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.log(
        "ERROR CALLING N8N WEBHOOK:" + model.singularName + action,
        error
      );
    }
  },
};
