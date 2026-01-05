// src/api/address/content-types/address/lifecycle.ts
module.exports = {
  async afterCreate(event) {
    console.log("AFTER CREATE ADDRESS");
    // your script after a record is created
    const { action, result, model } = event;
    try {
      await fetch(`${process.env.N8N_WEBHOOK_URL}/create-address`, {
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
    console.log("AFTER UPDATE ADDRESS");
    const { action, result, model } = event;
    try {
      await fetch(`${process.env.N8N_WEBHOOK_URL}/update-address`, {
        method: "POST",
        body: JSON.stringify(result),
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.log(`ERROR: ${model.singularName} ${action}`, error);
    }
  },
  async afterDelete(event) {
    console.log("AFTER DELETE ADDRESS");
    const { action, result, model } = event;
    try {
      await fetch(`${process.env.N8N_WEBHOOK_URL}/delete-address`, {
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
