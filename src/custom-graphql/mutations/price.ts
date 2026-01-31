import { ImportPriceListInput } from "../../../types/custom";

export default {
  importPriceLists: async (_: any, args: { data: ImportPriceListInput[] }) => {
    try {
      const createdPriceLists = [];
      const updatedPriceLists = [];
      const errorsPriceLists = [];

      // Process each product's price lists
      for (const productInput of args.data) {
        let created = false;
        try {
          // Find the product by handle
          const product = await strapi
            .documents("api::product.product")
            .findFirst({
              filters: {
                handle: productInput.handle,
              },
              populate: {
                price_lists: true,
              },
            });

          console.log(product);

          if (!product) {
            errorsPriceLists.push({
              name: product.name,
              model: product.model,
              handle: productInput.handle,
              error: "Product not found",
            });
            continue;
          }

          // Process each price list for this product
          for (const priceInput of productInput.price_lists) {
            try {
              // Validate required fields
              if (!priceInput.user_level || priceInput.price === undefined) {
                errorsPriceLists.push({
                  name: product.name,
                  model: product.model,
                  handle: productInput.handle,
                  error: "user_level and price are required",
                });
                continue;
              }

              // Check if a price with the same user level already exists for this product
              const existingPrice = product.price_lists?.find(
                (price: any) => price.user_level === priceInput.user_level,
              );

              if (existingPrice) {
                // Update existing price
                await strapi.documents("api::price.price").update({
                  documentId: existingPrice.documentId,
                  data: {
                    price: priceInput.price,
                    comparePrice: priceInput.comparePrice,
                    min_quantity: priceInput.min_quantity,
                    max_quantity: priceInput.max_quantity,
                  },
                });
                created = false;
              } else {
                // Create new price
                await strapi.documents("api::price.price").create({
                  data: {
                    products: {
                      connect: [product.documentId],
                    },
                    user_level: priceInput.user_level,
                    price: priceInput.price,
                    comparePrice: priceInput.comparePrice,
                    min_quantity: priceInput.min_quantity,
                    max_quantity: priceInput.max_quantity,
                  },
                });
                created = true;
              }
            } catch (priceError) {
              errorsPriceLists.push({
                name: product.name,
                model: product.model,
                handle: productInput.handle,
                error: `Failed to process price: ${priceError.message}`,
              });
            }
          }

          if (created) {
            createdPriceLists.push({
              name: product.name,
              model: product.model,
              handle: productInput.handle,
            });
          } else {
            updatedPriceLists.push({
              name: product.name,
              model: product.model,
              handle: productInput.handle,
            });
          }
        } catch (productError) {
          errorsPriceLists.push({
            handle: productInput.handle,
            error: `Failed to process product: ${productInput.handle} ${productError.message}`,
          });
        }
      }

      return {
        createdPriceLists,
        updatedPriceLists,
        errorsPriceLists,
      };
    } catch (error) {
      console.error("Error importing price lists:", error.message);
      return error;
    }
  },
};
