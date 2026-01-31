export const updateStandalone = async (
  collectionName: any,
  standaloneData: any,
  fields: string[],
) => {
  if (!standaloneData) return null;
  const payload: any = {};
  fields.forEach((f) => (payload[f] = standaloneData[f]));

  if (standaloneData.documentId) {
    await strapi.documents(collectionName as any).update({
      documentId: standaloneData.documentId,
      data: payload,
    });
    return standaloneData.documentId;
  }
  const created = await strapi.documents(collectionName as any).create({
    data: payload,
  });
  return created.documentId;
};

export const syncRelation = async (
  collectionName: any,
  incomingData: any[] = [],
  existingItems: any[] = [],
  updateFields: string[] = [],
): Promise<string | string[]> => {
  const incomingDocIds = new Set(
    incomingData.map((item) => item.documentId).filter(Boolean),
  );

  // Delete items removed by client
  const toDelete = existingItems.filter(
    (item) => !incomingDocIds.has(item.documentId),
  );
  await Promise.all(
    toDelete.map((item) =>
      strapi.documents(collectionName).delete({ documentId: item.documentId }),
    ),
  );

  // Update or Create
  return Promise.all(
    incomingData.map(async (item: any) => {
      const payload: any = {};
      updateFields.forEach((f) => (payload[f] = item[f]));

      if (item.documentId) {
        await strapi.documents(collectionName as any).update({
          documentId: item.documentId,
          data: payload,
        });
        return item.documentId;
      }
      const created = await strapi.documents(collectionName as any).create({
        data: payload,
      });
      return created.documentId;
    }),
  );
};
