/* eslint-disable no-param-reassign */
import { db } from "@models";
import { DumpboxItem } from "@src/models/DumpboxItem";
import { v4 as uuidv4 } from "uuid";

export const getFromOutbox = async (key: string) => {
  try {
    const dumpbox = await db.dumpboxCollection.where("key").equals(key).toArray();
    return dumpbox[0];
  } catch (err) {
    return null;
  }
};

export const addSchedulerRes = async (uniqueId: string, output: string) => {
  let newId;
  await db
    .transaction("rw", db.dumpboxCollection, async () => {
      newId = await db.dumpboxCollection.add({
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
  db.transaction("rw", db.dumpboxCollection, async () => {
    await db.dumpboxCollection
      .where("key")
      .equals("scheduler")
      .modify((obj: DumpboxItem) => {
        obj.value = JSON.stringify({
          uniqueId,
          output,
        });
      });
  }).catch((e) => {
    console.log(e.stack || e);
  });
};
