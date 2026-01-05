/**
 * cart controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::cart.cart', {
    async find(ctx) {
        
        const { user } = ctx.state;
        const { populate } = ctx.query;

        console.log(user)
        const carts = await strapi.entityService.findMany('api::cart.cart', {
            populate: ["createdBy", "updatedBy"]
        });

        return carts;
    }
});
