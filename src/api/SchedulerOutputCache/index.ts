/* eslint-disable no-param-reassign */
import { db } from "@models";
import { SchedulerOutputCacheItem } from "@src/models/SchedulerOutputCacheItem";
import { v4 as uuidv4 } from "uuid";

export const getSchedulerCachedRes = async (key: string) => {
  try {
    const schedulerOutputCache = await db.schedulerOutputCacheCollection.where("key").equals(key).toArray();
    return schedulerOutputCache[0];
  } catch (err) {
    return null;
  }
};

export const addSchedulerResToCache = async (uniqueId: string, output: string) => {
  let newId;
  console.log("adding to cache");
  await db
    .transaction("rw", db.schedulerOutputCacheCollection, async () => {
      await db.schedulerOutputCacheCollection.clear();
      newId = await db.schedulerOutputCacheCollection.add({
        key: "scheduler",
        value: JSON.stringify({
          uniqueId,
          output,
        }),
        id: uuidv4(),
      });
    })
    .catch((e) => {
      console.log(e.stack || e);
    });
  return newId;
};

export const updateSchedulerCachedRes = async (uniqueId: string, output: string) => {
  db.transaction("rw", db.schedulerOutputCacheCollection, async () => {
    await db.schedulerOutputCacheCollection
      .where("key")
      .equals("scheduler")
      .modify((obj: SchedulerOutputCacheItem) => {
        obj.value = JSON.stringify({
          uniqueId,
          output,
        });
      });
  }).catch((e) => {
    console.log(e.stack || e);
  });
};
