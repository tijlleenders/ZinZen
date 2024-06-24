import { db, IFeelingItem } from "@models";

export const fetchFeelings = async ({ pageParam = 1 }) => {
  const limit = 6;
  const offset = (pageParam - 1) * limit;
  const feelings = await db.feelingsCollection.orderBy("date").reverse().offset(offset).limit(limit).toArray();
  return { feelings, nextPage: pageParam + 1 };
};

export const addFeeling = async (feeling: Omit<IFeelingItem, "id">) => {
  return db.feelingsCollection.add(feeling);
};

export const getFeelings = async () => {
  return db.feelingsCollection.toArray();
};

export const getFeelingById = async (id: number) => {
  return db.feelingsCollection.get(id);
};

export const updateFeeling = async (id: number, updatedFeeling: Partial<IFeelingItem>) => {
  return db.feelingsCollection.update(id, updatedFeeling);
};

export const deleteFeeling = async (id: number) => {
  return db.feelingsCollection.delete(id);
};
