import { ImportProductsInput } from "../../../types/custom";
import { capsAllFirstCharWithSpace } from "../../utils/string";
import { updateStandalone, syncRelation } from "../../utils/utils";

export default {
  customProductCreate: async (_: any, args: any, context: any) => {
    try {
      const { data } = args;

      // 1. Fetch files and images
      const [files, images] = await Promise.all([
        strapi.documents("plugin::upload.file").findMany({
          filters: { documentId: { $in: data.files || [] } },
        }),
        strapi.documents("plugin::upload.file").findMany({
          filters: { documentId: { $in: data.images || [] } },
        }),
      ]);

      // 2. Sort files and images to match the client's order (Map-based approach)
      const fileMap = new Map<string, number>(
        files.map((f: any) => [f.documentId, f.id] as [string, number]),
      );
      const sortedFileIds = (data.files || [])
        .map((docId: string) => fileMap.get(docId))
        .filter(Boolean);

      const imageMap = new Map<string, number>(
        images.map((i: any) => [i.documentId, i.id] as [string, number]),
      );
      const sortedImageIds = (data.images || [])
        .map((docId: string) => imageMap.get(docId))
        .filter(Boolean);

      // 3. Process relations
      const [
        priceListIds,
        keyFeatureIds,
        specificationIds,
        inventoryId,
        shippingId,
      ] = await Promise.all([
        syncRelation(
          "api::price.price",
          data.price_lists,
          [],
          [
            "price",
            "user_level",
            "min_quantity",
            "max_quantity",
            "comparePrice",
          ],
        ),
        syncRelation(
          "api::key-feature.key-feature",
          data.key_features,
          [],
          ["feature"],
        ),
        syncRelation(
          "api::specification.specification",
          data.specifications,
          [],
          ["key", "value"],
        ),
        updateStandalone("api::inventory.inventory", data.inventory, [
          "melbourne",
          "sydney",
          "brisbane",
        ]),
        updateStandalone("api::shipping.shipping", data.shipping, [
          "height",
          "width",
          "weight",
          "length",
        ]),
      ]);

      // 4. Create Product
      const res = await strapi.documents("api::product.product").create({
        data: {
          handle: data.handle,
          name: data.name,
          model: data.model,
          odoo_product_id: data.odoo_product_id,
          description: data.description,
          product_type: data.product_type,
          brand: data.brand,
          collections: (data.collections || []).map((c: any) => c.documentId),
          tags: (data.tags || []).map((t: any) => t.documentId),
          images: sortedImageIds,
          files: sortedFileIds,
          price_lists: Array.isArray(priceListIds) ? priceListIds : [],
          specifications: Array.isArray(specificationIds)
            ? specificationIds
            : [],
          inventory: inventoryId as string,
          shipping: shippingId as string,
          key_features: Array.isArray(keyFeatureIds) ? keyFeatureIds : [],
          maxQuantity: data.maxQuantity,
          maxQuantityForLargeShipment: data.maxQuantityForLargeShipment,
          releasedAt:
            data.releaseAt === "published" ? new Date() : data.releasedAt,
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
      console.error("Create Product Error:", error);
      throw error;
    }
  },
  customProductUpdate: async (_: any, args: any, context: any) => {
    try {
      const { data } = args;

      // 1. Fetch existing product to handle deletions and populate checks
      const existingProduct = await strapi
        .documents("api::product.product")
        .findOne({
          documentId: args.documentId,
          populate: [
            "price_lists",
            "key_features",
            "specifications",
            "inventory",
            "shipping",
          ],
        });

      if (!existingProduct) {
        throw new Error("Product not found");
      }

      // Prepare the main update payload
      const updatePayload: any = {
        improvedBy: context.state.user.documentId,
      };

      // Helper to conditionally add simple fields
      const simpleFields = [
        "handle",
        "name",
        "model",
        "odoo_product_id",
        "description",
        "product_type",
        "brand",
        "releasedAt",
        "maxQuantity",
        "maxQuantityForLargeShipment",
      ];

      simpleFields.forEach((field) => {
        if (data[field] !== undefined) {
          updatePayload[field] = data[field];
        }
      });

      // 2. Handle Files and Images (Sorting + Relations)
      if (data.files !== undefined || data.images !== undefined) {
        const [files, images] = await Promise.all([
          data.files
            ? strapi.documents("plugin::upload.file").findMany({
                filters: { documentId: { $in: data.files } },
              })
            : [],
          data.images
            ? strapi.documents("plugin::upload.file").findMany({
                filters: { documentId: { $in: data.images } },
              })
            : [],
        ]);

        if (data.files !== undefined) {
          const fileMap = new Map<string, number>(
            files.map((f: any) => [f.documentId, f.id] as [string, number]),
          );
          updatePayload.files = data.files
            .map((docId: string) => fileMap.get(docId))
            .filter(Boolean);
        }

        if (data.images !== undefined) {
          const imageMap = new Map<string, number>(
            images.map((i: any) => [i.documentId, i.id] as [string, number]),
          );
          updatePayload.images = data.images
            .map((docId: string) => imageMap.get(docId))
            .filter(Boolean);
        }
      }

      // 3. Process relations with Orphan Cleanup

      const relationTasks = [];

      if (data.price_lists !== undefined) {
        relationTasks.push(
          syncRelation(
            "api::price.price",
            data.price_lists || [],
            existingProduct.price_lists || [],
            [
              "price",
              "user_level",
              "min_quantity",
              "max_quantity",
              "comparePrice",
            ],
          ).then((ids) => (updatePayload.price_lists = ids)),
        );
      }

      if (data.key_features !== undefined) {
        relationTasks.push(
          syncRelation(
            "api::key-feature.key-feature",
            data.key_features || [],
            existingProduct.key_features || [],
            ["feature"],
          ).then((ids) => (updatePayload.key_features = ids)),
        );
      }

      if (data.specifications !== undefined) {
        relationTasks.push(
          syncRelation(
            "api::specification.specification",
            data.specifications || [],
            existingProduct.specifications || [],
            ["key", "value"],
          ).then((ids) => (updatePayload.specifications = ids)),
        );
      }

      // 4. Standalone Relations

      if (data.inventory !== undefined) {
        relationTasks.push(
          updateStandalone("api::inventory.inventory", data.inventory, [
            "melbourne",
            "sydney",
            "brisbane",
          ]).then((id) => (updatePayload.inventory = id)),
        );
      }

      if (data.shipping !== undefined) {
        relationTasks.push(
          updateStandalone("api::shipping.shipping", data.shipping, [
            "height",
            "width",
            "weight",
            "length",
          ]).then((id) => (updatePayload.shipping = id)),
        );
      }

      if (data.tags !== undefined) {
        updatePayload.tags = data.tags;
      }

      if (data.collections !== undefined) {
        updatePayload.collections = data.collections;
      }

      await Promise.all(relationTasks);

      console.log("Update Payload:", updatePayload);

      // 5. Final Update
      const res = await strapi.documents("api::product.product").update({
        documentId: args.documentId,
        data: updatePayload,
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
      console.log("Product Update error:", error);
      throw error; // Throw so that GraphQL returns an error response
    }
  },
  importProducts: async (
    _: any,
    { data }: { data: ImportProductsInput[] },
    context: any,
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
                  typeof spec.value === "string",
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
                      `createMany failed for ${product.name} specifications, using individual creates: ${createManyError.message}`,
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
                  feature.feature && typeof feature.feature === "string",
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
                  `Failed to create key features: ${createError.message}`,
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
        const product = await strapi.db.query("api::product.product").findOne({
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
            productDeletedData.price_lists.failed += product.price_lists.length;
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
                      (keyFeature) => keyFeature.id,
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
};
