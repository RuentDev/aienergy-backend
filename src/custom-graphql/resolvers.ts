import {
  ImportPriceListInput,
  ImportProductsInput,
  RegisterUserInput,
  UserApprovalRequestInput,
} from "../../types/custom";
import { FILTER_KEYS } from "../constant";
import { sendMail } from "../utils/send-mail";
import { capsAllFirstCharWithSpace } from "../utils/string";

export const resolvers = {
  Mutation: {
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
            `User has been processed and marked as "${currentStatus}"`
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
                $in: user.creditCards.map(
                  (creditCard) => creditCard.documentId
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
                    (creditCard) => creditCard.documentId
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
    customProductCreate: async (_: any, args: any, context: any) => {
      try {
        // 1. Fetch files and images
        const [files, images] = await Promise.all([
          strapi.documents("plugin::upload.file").findMany({
            filters: { documentId: { $in: args.data.files || [] } },
          }),
          strapi.documents("plugin::upload.file").findMany({
            filters: { documentId: { $in: args.data.images || [] } },
          }),
        ]);

        // 2. Sort files and images to match the client's order
        const sortedFileIds = files
          .map((existingFile) =>
            files.find(
              (file: any) => file.documentId === existingFile.documentId
            )
          )
          .filter(Boolean)
          .map((file: any) => file.id);

        const sortedImageIds = images
          .map((existingImage) =>
            images.find(
              (image: any) => image.documentId === existingImage.documentId
            )
          )
          .filter(Boolean)
          .map((image: any) => image.id);

        // 3. Process relations that might need creation (Prices, Features, Specs)
        const [priceListIds, keyFeatureIds, specificationIds] =
          await Promise.all([
            // Prices
            Promise.all(
              (args.data.price_lists || []).map(async (price: any) => {
                if (price.documentId) {
                  await strapi.documents("api::price.price").update({
                    documentId: price.documentId,
                    data: {
                      price: price.price,
                      user_level: price.user_level,
                      min_quantity: price.min_quantity,
                      max_quantity: price.max_quantity,
                      comparePrice: price.comparePrice,
                    },
                  });
                  return price.documentId;
                }
                const newPrice = await strapi
                  .documents("api::price.price")
                  .create({
                    data: {
                      price: price.price,
                      user_level: price.user_level,
                      min_quantity: price.min_quantity,
                      max_quantity: price.max_quantity,
                      comparePrice: price.comparePrice,
                    },
                  });
                return newPrice.documentId;
              })
            ),
            // Key Features
            Promise.all(
              (args.data.key_features || []).map(async (feature: any) => {
                if (feature.documentId) {
                  await strapi
                    .documents("api::key-feature.key-feature")
                    .update({
                      documentId: feature.documentId,
                      data: {
                        feature: feature.feature,
                      },
                    });
                  return feature.documentId;
                }
                // FIX: Spread the feature object directly into the data payload
                const newFeature = await strapi
                  .documents("api::key-feature.key-feature")
                  .create({ data: { feature: feature.feature } });
                return newFeature.documentId;
              })
            ),
            // Specifications
            Promise.all(
              (args.data.specifications || []).map(async (spec: any) => {
                if (spec.documentId) {
                  await strapi
                    .documents("api::specification.specification")
                    .update({
                      documentId: spec.documentId,
                      data: {
                        key: spec.key,
                        value: spec.value,
                      },
                    });
                  return spec.documentId;
                }
                // FIX: Assumes the model fields are 'name' and 'value' matching the spec object
                const newSpec = await strapi
                  .documents("api::specification.specification")
                  .create({ data: { key: spec.key, value: spec.value } });
                return newSpec.documentId;
              })
            ),
          ]);

        // 4. Update standalone relations (Inventory, Shipping)
        const [createdInventory, createdShipping] = await Promise.all([
          // Inventory
          await strapi.documents("api::inventory.inventory").create({
            data: {
              melbourne: args.data.inventory.melbourne,
              sydney: args.data.inventory.sydney,
              brisbane: args.data.inventory.brisbane,
            },
          }),
          // Shipping
          await strapi.documents("api::shipping.shipping").create({
            // FIX: Use data from args.data.shipping, not inventory
            data: {
              height: args.data.shipping.height,
              width: args.data.shipping.width,
              weight: args.data.shipping.weight,
              length: args.data.shipping.length,
            },
          }),
        ]);

        const res = await strapi.documents("api::product.product").create({
          data: {
            handle: args.data.handle,
            name: args.data.name,
            model: args.data.model,
            odoo_product_id: args.data.odoo_product_id,
            description: args.data.description,
            product_type: args.data.product_type,
            brand: args.data.brand,
            collections: args.data.collections,
            images: sortedImageIds,
            files: sortedFileIds,
            price_lists: priceListIds,
            specifications: specificationIds,
            inventory: createdInventory.documentId,
            shipping: createdShipping.documentId,
            key_features: keyFeatureIds,
            maxQuantity: args.data.maxQuantity,
            maxQuantityForLargeShipment: args.data.maxQuantityForLargeShipment,
            releasedAt: args.data.releaseAt !== "published" && null,
            madeBy: context.state.user.documentId,
          },
          populate: {
            files: true,
            images: true,
            tags: true,
            collections: true,
            price_lists: true,
            inventory: true,
            specifications: true,
            key_features: true,
            improvedBy: true,
            madeBy: true,
            shipping: true,
          },
        });

        return res;
      } catch (error) {
        console.log("Create Product Error: ", error);
        return error;
      }
    },
    customProductUpdate: async (_: any, args: any, context: any) => {
      // 1. Fetch files and images
      const [files, images] = await Promise.all([
        strapi.documents("plugin::upload.file").findMany({
          filters: { documentId: { $in: args.data.files || [] } },
        }),
        strapi.documents("plugin::upload.file").findMany({
          filters: { documentId: { $in: args.data.images || [] } },
        }),
      ]);

      // 2. Sort files and images to match the client's order
      const sortedFileIds = args.data.files
        .filter((idInOrder: string) =>
          files.some((existingImage) => existingImage.documentId === idInOrder)
        )
        .map((idInOrder: string) => {
          const existingFile = files.find(
            (img) => img.documentId === idInOrder
          );
          return existingFile?.id;
        })
        .filter(Boolean);

      const sortedImageIds = args.data.images
        .filter((idInOrder: string) =>
          images.some((existingImage) => existingImage.documentId === idInOrder)
        )
        .map((idInOrder: string) => {
          const existingImage = images.find(
            (img) => img.documentId === idInOrder
          );
          return existingImage?.id;
        })
        .filter(Boolean);

      // 3. Process relations that might need creation (Prices, Features, Specs)
      const [priceListIds, keyFeatureIds, specificationIds] = await Promise.all(
        [
          // Prices
          Promise.all(
            (args.data.price_lists || []).map(async (price: any) => {
              if (price.documentId) {
                await strapi.documents("api::price.price").update({
                  documentId: price.documentId,
                  data: {
                    price: price.price,
                    user_level: price.user_level,
                    min_quantity: price.min_quantity,
                    max_quantity: price.max_quantity,
                    comparePrice: price.comparePrice,
                  },
                });
                return price.documentId;
              }
              const newPrice = await strapi.query("api::price.price").create({
                data: {
                  price: price.price,
                  user_level: price.user_level,
                  min_quantity: price.min_quantity,
                  max_quantity: price.max_quantity,
                  comparePrice: price.comparePrice,
                },
              });
              return newPrice.documentId;
            })
          ),
          // Key Features
          Promise.all(
            (args.data.key_features || []).map(async (feature: any) => {
              if (feature.documentId) {
                await strapi.documents("api::key-feature.key-feature").update({
                  documentId: feature.documentId,
                  data: {
                    feature: feature.feature,
                  },
                });
                return feature.documentId;
              }
              // FIX: Spread the feature object directly into the data payload
              const newFeature = await strapi
                .query("api::key-feature.key-feature")
                .create({ data: { feature: feature.feature } });
              return newFeature.documentId;
            })
          ),
          // Specifications
          Promise.all(
            (args.data.specifications || []).map(async (spec: any) => {
              if (spec.documentId) {
                await strapi
                  .documents("api::specification.specification")
                  .update({
                    documentId: spec.documentId,
                    data: {
                      key: spec.key,
                      value: spec.value,
                    },
                  });
                return spec.documentId;
              }
              // FIX: Assumes the model fields are 'name' and 'value' matching the spec object
              const newSpec = await strapi
                .query("api::specification.specification")
                .create({ data: { key: spec.key, value: spec.value } });
              return newSpec.documentId;
            })
          ),
        ]
      );

      // 4. Update standalone relations (Inventory, Shipping)
      const [updatedInventory, updatedShipping] = await Promise.all([
        // Inventory - Check if exists, update or create
        (async () => {
          if (args.data.inventory.documentId) {
            // Update existing inventory
            try {
              return await strapi.documents("api::inventory.inventory").update({
                documentId: args.data.inventory.documentId,
                data: {
                  melbourne: args.data.inventory.melbourne,
                  sydney: args.data.inventory.sydney,
                  brisbane: args.data.inventory.brisbane,
                },
              });
            } catch (error) {
              console.error("Failed to update inventory:", error);
              return error;
            }
          }

          // Create new inventory if documentId doesn't exist or is null
          try {
            return await strapi.documents("api::inventory.inventory").create({
              data: {
                melbourne: args.data.inventory.melbourne,
                sydney: args.data.inventory.sydney,
                brisbane: args.data.inventory.brisbane,
              },
            });
          } catch (error) {
            console.error("Failed to create inventory:", error);
            return error;
          }
        })(),
        // Shipping
        (async () => {
          if (args.data.shipping.documentId) {
            try {
              return await strapi.documents("api::shipping.shipping").update({
                documentId: args.data.shipping.documentId,
                data: {
                  height: args.data.shipping.height,
                  width: args.data.shipping.width,
                  weight: args.data.shipping.weight,
                  length: args.data.shipping.length,
                },
              });
            } catch (error) {
              console.error("Failed to update shipping:", error);
              return error;
            }
          }

          // Create new inventory if documentId doesn't exist or is null
          try {
            return await strapi.query("api::shipping.shipping").create({
              data: {
                height: args.data.shipping.height,
                width: args.data.shipping.width,
                weight: args.data.shipping.weight,
                length: args.data.shipping.length,
              },
            });
          } catch (error) {
            console.error("Failed to create shipping:", error);

            return error;
          }
        })(),
      ]);

      // 5. Update the main product
      try {
        const res = await strapi.documents("api::product.product").update({
          documentId: args.documentId,
          data: {
            handle: args.data.handle,
            name: args.data.name,
            model: args.data.model,
            odoo_product_id: args.data.odoo_product_id,
            description: args.data.description,
            product_type: args.data.product_type,
            brand: args.data.brand,
            tags: (args.data.tags || []).map((tag: any) => tag.documentId),
            collections: (args.data.collections || []).map(
              (col: any) => col.documentId
            ),
            images: sortedImageIds,
            files: sortedFileIds,
            price_lists: priceListIds,
            key_features: keyFeatureIds,
            specifications: specificationIds,
            inventory: updatedInventory.documentId,
            shipping: updatedShipping.documentId,
            improvedBy: context.state.user.documentId,
            releasedAt: args.data.releasedAt,
            maxQuantity: args.data.maxQuantity,
            maxQuantityForLargeShipment: args.data.maxQuantityForLargeShipment,
          },
          populate: {
            files: true,
            images: true,
            tags: true,
            collections: true,
            price_lists: true,
            inventory: true,
            specifications: true,
            key_features: true,
            improvedBy: true,
            madeBy: true,
            shipping: true,
          },
        });
        return res;
      } catch (error) {
        console.error("Product Update error:", error);
        return error;
      }
    },
    importProducts: async (
      _: any,
      { data }: { data: ImportProductsInput[] },
      context: any
    ) => {
      try {
        const createdProducts = [];
        const existingProducts = [];
        const errorsProducts = [];

        for (const product of data) {
          // Reset variables for each product to prevent data leakage
          let pricesIds = [];
          let specs = [];
          let keyFeatures = [];
          let collectionIds = [];
          let tagIds = [];
          let inventory = null;
          let shipping = null;
          let brand = null;

          try {
            const existingProduct = await strapi.db
              .query("api::product.product")
              .findOne({
                where: {
                  odoo_product_id: product?.odoo_product_id,
                },
                populate: {
                  specifications: true,
                  key_features: true,
                  inventory: true,
                  shipping: true,
                  brand: true,
                },
              });

            if (!product?.odoo_product_id) {
              errorsProducts.push({
                name: product.name,
                model: product.model,
                error: "Missing odoo_product_id",
              });
              continue;
            }

            try {
              if (existingProduct?.brand) {
                brand = existingProduct.brand;
              } else {
                brand = await strapi.db.query("api::brand.brand").findOne({
                  where: {
                    $or: [
                      {
                        name: {
                          $contains: product.brand,
                        },
                      },
                      {
                        handle: {
                          $contains: product.brand,
                        },
                      },
                    ],
                  },
                });
                if (!brand) {
                  const createdBrand = await strapi.db
                    .query("api::brand.brand")
                    .create({
                      data: {
                        name: product.brand,
                        handle: product.brand.toLowerCase().replace(/ /g, "-"),
                        url: product.brand.toLowerCase().replace(/ /g, "-"),
                      },
                    });
                  brand = createdBrand;
                }
              }
            } catch (error) {
              console.error("Failed to create brand:", error);
              errorsProducts.push({
                name: product.name,
                model: product.model,
                error: `Failed to create brand: ${error.message}`,
              });
              continue;
            }

            try {
              if (existingProduct?.inventory) {
                inventory = existingProduct.inventory;
              } else {
                inventory = await strapi.db
                  .query("api::inventory.inventory")
                  .create({
                    data: {
                      melbourne: product.inventory.melbourne || 0,
                      sydney: product.inventory.sydney || 0,
                      brisbane: product.inventory.brisbane || 0,
                    },
                  });
              }
            } catch (error) {
              console.error("Failed to create inventory:", error);
              errorsProducts.push({
                name: product.name,
                model: product.model,
                error: `Failed to create inventory: ${error.message}`,
              });
              continue;
            }

            try {
              if (existingProduct?.shipping) {
                shipping = existingProduct.shipping;
              } else {
                shipping = await strapi.db
                  .query("api::shipping.shipping")
                  .create({
                    data: {
                      weight: product.shipping.weight || 0,
                      width: product.shipping.width || 0,
                      height: product.shipping.height || 0,
                      length: product.shipping.length || 0,
                    },
                  });
              }
            } catch (error) {
              console.error("Failed to create shipping:", error);
              errorsProducts.push({
                name: product.name,
                model: product.model,
                error: `Failed to create shipping: ${error.message}`,
              });
              continue;
            }

            if (product.collections && product.collections.length > 0) {
              for (const collection of product.collections) {
                const existingCollection = await strapi.db
                  .query("api::collection.collection")
                  .findOne({
                    where: {
                      $or: [
                        {
                          title: collection.collection,
                        },
                        {
                          handle: collection.collection
                            .toLowerCase()
                            .replace(/ /g, "-"),
                        },
                      ],
                    },
                  });

                if (!existingCollection) {
                  const createdCollection = await strapi.db
                    .query("api::collection.collection")
                    .create({
                      data: {
                        title: collection.collection,
                        handle: collection.collection
                          .toLowerCase()
                          .replace(/ /g, "-"),
                      },
                    });
                  collectionIds.push(createdCollection.id);
                } else {
                  collectionIds.push(existingCollection.id);
                }
              }
            }

            if (product.tags && product.tags.length > 0) {
              for (const tag of product.tags) {
                const existingTag = await strapi.db
                  .query("api::tag.tag")
                  .findOne({
                    where: {
                      $or: [
                        {
                          title: capsAllFirstCharWithSpace(tag.tag),
                        },
                        {
                          handle: tag.tag.toLowerCase().replace(/ /g, "-"),
                        },
                      ],
                    },
                  });

                if (!existingTag) {
                  const createdTag = await strapi.db
                    .query("api::tag.tag")
                    .create({
                      data: {
                        tag: tag.tag,
                        title: capsAllFirstCharWithSpace(tag.tag),
                        handle: tag.tag.toLowerCase().replace(/ /g, "-"),
                      },
                    });
                  tagIds.push(createdTag.id);
                } else {
                  tagIds.push(existingTag.id);
                }
              }
            }

            if (product.specifications && product.specifications.length > 0) {
              try {
                // Validate and prepare specifications data
                const validSpecs = product.specifications.filter(
                  (spec) =>
                    spec.key &&
                    spec.value &&
                    typeof spec.key === "string" &&
                    typeof spec.value === "string"
                );

                if (validSpecs.length === 0) {
                  errorsProducts.push({
                    name: product.name,
                    model: product.model,
                    error:
                      "No valid specifications found (key and value are required)",
                  });
                  continue;
                }

                for (const spec of validSpecs) {
                  const existingSpec = await strapi.db
                    .query("api::specification.specification")
                    .findOne({
                      where: {
                        $and: [{ key: spec.key }, { value: spec.value }],
                      },
                    });

                  if (existingSpec) {
                    specs.push(existingSpec.id);
                  } else {
                    try {
                      const createdSpecs = await strapi.db
                        .query("api::specification.specification")
                        .create({
                          data: {
                            key: spec.key,
                            value: spec.value,
                          },
                        });
                      specs.push(createdSpecs.id);
                    } catch (createManyError) {
                      console.warn(
                        `createMany failed for ${product.name} specifications, using individual creates: ${createManyError.message}`
                      );
                    }
                  }
                }
              } catch (error) {
                console.error("Failed to create specifications:", error);
                errorsProducts.push({
                  name: product.name,
                  model: product.model,
                  error: `Failed to create specifications: ${error.message}`,
                });
                continue;
              }
            }

            if (product.key_features && product.key_features.length > 0) {
              try {
                // Validate and prepare key features data
                const validKeyFeatures = product.key_features.filter(
                  (feature) =>
                    feature.feature && typeof feature.feature === "string"
                );

                if (validKeyFeatures.length === 0) {
                  errorsProducts.push({
                    name: product.name,
                    model: product.model,
                    error: "No valid key features found (feature is required)",
                  });
                  continue;
                }

                // Use individual creates (consistent approach)
                try {
                  const createdKeyFeatures = await strapi.db
                    .query("api::key-feature.key-feature")
                    .createMany({
                      data: validKeyFeatures.map((keyFeature) => ({
                        feature: keyFeature.feature,
                      })),
                    });
                  keyFeatures = createdKeyFeatures.ids.map((id) => id) || [];
                } catch (createError) {
                  console.warn(
                    `Failed to create key features: ${createError.message}`
                  );
                }
              } catch (error) {
                console.error("Failed to create key features:", error);
                errorsProducts.push({
                  name: product.name,
                  model: product.model,
                  error: `Failed to create key features: ${error.message}`,
                });
                continue;
              }
            }

            if (existingProduct) {
              const updatedProductData = await strapi.db
                .query("api::product.product")
                .update({
                  where: { id: existingProduct.id },
                  data: {
                    name: product.name,
                    handle: product.handle,
                    description: product.description,
                    product_type: product.product_type,
                    model: product.model,
                    maxQuantity: product.maxQuantity,
                    maxQuantityForLargeShipment:
                      product.maxQuantityForLargeShipment,
                    odoo_product_id: product.odoo_product_id,
                    odoo_product_name: product.odoo_product_name,
                    shipping:
                      typeof shipping === "string" ? shipping : shipping.id,
                    inventory:
                      typeof inventory === "string" ? inventory : inventory?.id,
                    brand: typeof brand === "string" ? inventory : brand?.id,
                    ...(pricesIds.length > 0 && {
                      price_lists: pricesIds,
                    }),
                    ...(specs.length > 0 && {
                      specifications: specs,
                    }),
                    ...(keyFeatures.length > 0 && {
                      key_features: keyFeatures,
                    }),
                    ...(collectionIds.length > 0 && {
                      collections: collectionIds,
                    }),
                    ...(tagIds.length > 0 && {
                      tags: tagIds,
                    }),

                    improvedBy: context.state.user.id,
                  },
                });

              existingProducts.push({
                name: updatedProductData.name,
                model: updatedProductData.model,
                documentId: updatedProductData.documentId,
                odoo_product_id: product?.odoo_product_id,
              });

              continue;
            }

            // Create related entities with error handling
            const createdProduct = await strapi.db
              .query("api::product.product")
              .create({
                data: {
                  name: product.name,
                  handle: product.handle,
                  model: product.model,
                  odoo_product_id: product.odoo_product_id,
                  description: product.description,
                  product_type: product.product_type,
                  maxQuantity: product.maxQuantity,
                  maxQuantityForLargeShipment:
                    product.maxQuantityForLargeShipment,
                  releasedAt: null,
                  madeBy: context.state.user.id,
                  shipping: shipping?.id,
                  inventory: inventory?.id,
                  brand: brand?.id,
                  ...(pricesIds.length > 0 && {
                    price_lists: pricesIds,
                  }),
                  ...(specs.length > 0 && {
                    specifications: specs,
                  }),
                  ...(keyFeatures.length > 0 && {
                    key_features: keyFeatures,
                  }),
                  ...(collectionIds.length > 0 && {
                    collections: collectionIds,
                  }),
                  ...(tagIds.length > 0 && {
                    tags: tagIds,
                  }),
                },
              });

            createdProducts.push({
              documentId: createdProduct.documentId,
              name: product.name,
              model: product.model,
              odoo_product_id: product?.odoo_product_id,
            });
          } catch (productError) {
            console.log("Product creation failed:", productError.details);
            console.log(Object.keys(productError));
            errorsProducts.push({
              name: product.name,
              model: product.model,
              error: `Product creation failed: ${productError.message}`,
            });
          }
        }

        return {
          createdProducts,
          existingProducts,
          errorsProducts,
        };
      } catch (error) {
        console.error("Import products error:", error);
        // Return a structured error response instead of raw error
        return {
          createdProducts: [],
          existingProducts: [],
          errorsProducts: [
            {
              name: "System Error",
              model: "N/A",
              error: `Import failed: ${error.message || "Unknown error occurred"}`,
            },
          ],
        };
      }
    },
    deleteProducts: async (_: any, args: { documentIds: string[] }) => {
      try {
        const successfullDeleted = [];
        const failedDeleted = [];

        for (const documentId of args.documentIds) {
          const product = await strapi.db
            .query("api::product.product")
            .findOne({
              where: { documentId: documentId },
              populate: {
                inventory: true,
                shipping: true,
                price_lists: true,
                specifications: true,
                key_features: true,
                files: true,
                images: true,
              },
            });

          if (!product) {
            failedDeleted.push({
              documentId: documentId,
              productError: "Product not found",
              errors: {
                inventory: { deleted: 0, failed: 0 },
                shipping: { deleted: 0, failed: 0 },
                price_lists: { deleted: 0, failed: 0 },
                specifications: { deleted: 0, failed: 0 },
                key_features: { deleted: 0, failed: 0 },
                files: { deleted: 0, failed: 0 },
                images: { deleted: 0, failed: 0 },
              },
            });
            continue;
          }

          const productDeletedData = {
            inventory: {
              deleted: 0,
              failed: 0,
            },
            shipping: {
              deleted: 0,
              failed: 0,
            },
            price_lists: {
              deleted: 0,
              failed: 0,
            },
            specifications: {
              deleted: 0,
              failed: 0,
            },
            key_features: {
              deleted: 0,
              failed: 0,
            },
            files: {
              deleted: 0,
              failed: 0,
            },
            images: {
              deleted: 0,
              failed: 0,
            },
          };

          let hasDeletionErrors = false;

          //  Delete the related inventory
          if (product.inventory) {
            try {
              await strapi.db.query("api::inventory.inventory").delete({
                where: { id: product.inventory.id },
              });
              productDeletedData.inventory.deleted = 1;
            } catch (error) {
              productDeletedData.inventory.failed = 1;
              hasDeletionErrors = true;
            }
          }

          //  Delete the related shipping
          if (product.shipping) {
            try {
              await strapi.db.query("api::shipping.shipping").delete({
                where: { id: product.shipping.id },
              });
              productDeletedData.shipping.deleted = 1;
            } catch (error) {
              productDeletedData.shipping.failed = 1;
              hasDeletionErrors = true;
            }
          }

          //  Delete the related price lists
          if (product.price_lists && product.price_lists.length > 0) {
            try {
              const res = await strapi.db.query("api::price.price").deleteMany({
                where: {
                  id: {
                    $in: product.price_lists.map((price) => price.id),
                  },
                },
              });
              productDeletedData.price_lists.deleted += res.count;
            } catch (error) {
              productDeletedData.price_lists.failed +=
                product.price_lists.length;
              hasDeletionErrors = true;
            }
          }

          //  Delete the related specifications
          if (product.specifications && product.specifications.length > 0) {
            try {
              const res = await strapi.db
                .query("api::specification.specification")
                .deleteMany({
                  where: {
                    id: {
                      $in: product.specifications.map((spec) => spec.id),
                    },
                  },
                });
              productDeletedData.specifications.deleted += res.count;
            } catch (error) {
              productDeletedData.specifications.failed +=
                product.specifications.length;
              hasDeletionErrors = true;
            }
          }

          //  Delete the related key features
          if (product.key_features && product.key_features.length > 0) {
            try {
              const res = await strapi.db
                .query("api::key-feature.key-feature")
                .deleteMany({
                  where: {
                    id: {
                      $in: product.key_features.map(
                        (keyFeature) => keyFeature.id
                      ),
                    },
                  },
                });
              productDeletedData.key_features.deleted += res.count;
            } catch (error) {
              productDeletedData.key_features.failed +=
                product.key_features.length;
              hasDeletionErrors = true;
            }
          }

          //  Delete the related files
          if (product.files && product.files.length > 0) {
            try {
              const res = await strapi.db
                .query("plugin::upload.file")
                .deleteMany({
                  where: {
                    id: {
                      $in: product.files.map((file) => file.id),
                    },
                  },
                });
              productDeletedData.files.deleted += res.count;
            } catch (error) {
              productDeletedData.files.failed += product.files.length;
              hasDeletionErrors = true;
            }
          }

          //  Delete the related images
          if (product.images && product.images.length > 0) {
            try {
              const res = await strapi.db
                .query("plugin::upload.file")
                .deleteMany({
                  where: {
                    id: {
                      $in: product.images.map((image) => image.id),
                    },
                  },
                });
              productDeletedData.images.deleted += res.count;
            } catch (error) {
              productDeletedData.images.failed += product.images.length;
              hasDeletionErrors = true;
            }
          }

          // If any related deletions failed, don't delete the main product
          if (hasDeletionErrors) {
            failedDeleted.push({
              documentId: product.documentId,
              errors: productDeletedData,
            });
            continue;
          }

          //  Delete the product only if all related items were successfully deleted
          try {
            const deletedProduct = await strapi.db
              .query("api::product.product")
              .delete({
                where: { id: product.id },
              });

            if (!deletedProduct) {
              throw new Error("Failed to delete product");
            }

            successfullDeleted.push({
              documentId: product.documentId,
              deletedData: productDeletedData,
            });
          } catch (error) {
            failedDeleted.push({
              documentId: product.documentId,
              errors: productDeletedData,
              productError: error.message,
            });
          }
        }

        const res = {
          success: successfullDeleted,
          failed: failedDeleted,
        };

        return res;
      } catch (error) {
        console.log(Object.keys(error));
        console.error("Error deleting products:", error.message);
        return {
          success: [],
          failed: [
            {
              documentId: "System Error",
              productError: `Delete operation failed: ${error.message || "Unknown error occurred"}`,
              errors: {
                inventory: { deleted: 0, failed: 0 },
                shipping: { deleted: 0, failed: 0 },
                price_lists: { deleted: 0, failed: 0 },
                specifications: { deleted: 0, failed: 0 },
                key_features: { deleted: 0, failed: 0 },
                files: { deleted: 0, failed: 0 },
                images: { deleted: 0, failed: 0 },
              },
            },
          ],
        };
      }
    },
    importPriceLists: async (
      _: any,
      args: { data: ImportPriceListInput[] }
    ) => {
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
                  (price: any) => price.user_level === priceInput.user_level
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
    updateFile: async (_: any, args: { [key: string]: any }) => {
      try {
        const updatedFile = await strapi
          .documents("plugin::upload.file")
          .update({
            documentId: args.documentId,
            data: {
              ...args.data,
            },
          });
        return updatedFile;
      } catch (error) {
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

    // AUTH
  },
  Query: {
    searchProducts: async (_: any, args: { query: string }) => {
      const { query } = args;

      try {
        const searchWords = query
          .trim()
          .split(/\s+/)
          .filter((word) => word.length > 0);

        const wordMatchConditions = {
          $or: searchWords.map((word) => ({
            $or: FILTER_KEYS.map((key) => {
              if (key === "brand") {
                return {
                  brand: {
                    $or: [
                      { name: { $containsi: word } },
                      { handle: { $containsi: word } },
                    ],
                  },
                };
              }

              if (key === "specifications") {
                return {
                  specifications: {
                    value: { $containsi: word },
                  },
                };
              }
              return {
                [key]: {
                  $containsi: word,
                },
              };
            }),
          })),
        };

        const products = await strapi
          .documents("api::product.product")
          .findMany({
            filters: {
              $or: [
                {
                  $or: [
                    {
                      name: { $containsi: query },
                    },
                    {
                      model: { $containsi: query },
                    },
                    {
                      product_type: { $containsi: query },
                    },
                    {
                      brand: {
                        name: { $containsi: query },
                      },
                    },
                    {
                      specifications: {
                        $or: searchWords?.map?.((item) => ({
                          value: { $containsi: item },
                        })),
                      },
                    },
                  ],
                },
                // { ...wordMatchConditions },
              ],
              releasedAt: { $notNull: true },
            },
            sort: {
              name: "asc",
            },
          });
        return products;
      } catch (error) {
        return error;
      }
    },
    getStoreProducts: async (_: any, args: any) => {
      const { filters, pagination, sort } = args;
      const products = await strapi.documents("api::product.product").findMany({
        filters,
        pagination,
        sort,
        populate: {
          brand: true,
          tags: true,
          collections: true,
          inventory: true,
          shipping: true,
          price_lists: true,
          key_features: true,
          specifications: true,
          files: true,
          images: true,
        },
      });

      return products;
    },
    getStoreProduct: async (_: any, args: any) => {
      const { handle } = args;
      const products = await strapi
        .documents("api::product.product")
        .findFirst({
          filters: {
            handle: handle,
            releasedAt: { $notNull: true },
          },
          populate: {
            files: true,
            images: true,
            brand: true,
            tags: true,
            collections: true,
            inventory: true,
            shipping: true,
            price_lists: true,
            key_features: true,
            specifications: true,
          },
        });

      return products;
    },
    getPage: async (_: any, { slug }: { slug: string }) => {
      try {
        if (!slug || slug === null || slug === "/" || slug === "") {
          const homepage = await strapi.documents("api::page.page").findFirst({
            filters: {
              slug: "/",
            },
          });

          return homepage;
        }

        const res = await strapi.documents("api::page.page").findFirst({
          filters: {
            slug: slug,
          },
        });

        return res;
      } catch (error) {}
    },
    files: async (_: any, args: any) => {
      try {
        const files = await strapi.documents("plugin::upload.file").findMany({
          filters: {
            ext: {
              $eq: args.filters.ext.eq,
            },
          },
        });

        // console.log(files)

        return files;
      } catch (error) {
        console.error(error);
        return [];
      }
    },
    user: async (
      _: any,
      args: { filters: { email: string; username: string } }
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
  },
};
