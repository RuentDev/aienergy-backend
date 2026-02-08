export const updateStandalone = async (
  collectionName: any,
  standaloneData: any,
  fields: string[],
) => {
  if (!standaloneData) return null;
  const payload: any = {};
  fields.forEach((f) => (payload[f] = standaloneData[f]));

  const docId =
    standaloneData.documentId === "" ? null : standaloneData.documentId;

  if (docId) {
    await strapi.documents(collectionName as any).update({
      documentId: docId as string,
      data: payload,
    });
    return docId as string;
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
    incomingData
      .map((item) => (item.documentId === "" ? null : item.documentId))
      .filter(Boolean),
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

      const docId = item.documentId === "" ? null : item.documentId;
      if (docId) {
        await strapi.documents(collectionName as any).update({
          documentId: docId as string,
          data: payload,
        });
        return docId as string;
      }
      const created = await strapi.documents(collectionName as any).create({
        data: payload,
      });
      return created.documentId;
    }),
  );
};
