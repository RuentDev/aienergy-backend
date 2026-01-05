module.exports = {
  async afterCreate(event) {
    console.log("AFTER CREATE PRODUCT");
    const { action, result, model } = event;
    try {
      await fetch(`${process.env.N8N_WEBHOOK_URL}/create-product`, {
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
  async afterUpdate(event) {
    console.log("AFTER UPDATE PRODUCT");
    const { action, result, model } = event;
    try {
      await fetch(`${process.env.N8N_WEBHOOK_URL}/update-product`, {
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
  async afterDelete(event) {
    console.log("AFTER DELETE PRODUCT");
    const { action, result, model } = event;
    try {
      await fetch(`${process.env.N8N_WEBHOOK_URL}/delete-product`, {
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
};
