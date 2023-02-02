import { db } from "@models";
import { ISubscriber, PubSubItem } from "@src/models/PubSubItem";

export const addPub = async (id: string, subscribers: ISubscriber[]) => {
  let newPubId;
  await db
    .transaction("rw", db.pubSubCollection, async () => {
      newPubId = await db.pubSubCollection.add({ id, subscribers });
    })
    .catch((e) => {
      console.log(e.stack || e);
    });
  return newPubId;
};

export const getPubById = async (id: string) => {
  const goal = await db.pubSubCollection.where("id").equals(id).toArray();
  return goal[0];
};

export const addSubInPub = async (goalId: string, relId: string, type: "shared" | "collaboration") => {
  const pubId = await getPubById(goalId);
  if (pubId) {
    db.transaction("rw", db.pubSubCollection, async () => {
      await db.pubSubCollection.where("id").equals(goalId)
        .modify((obj: PubSubItem) => {
          obj.subscribers.push({ relId, type });
        });
    }).catch((e) => {
      console.log(e.stack || e);
    });
  } else { await addPub(goalId, [{ relId, type }]); }
};

export const convertTypeOfSub = async (goalId: string, relId: string, newType: "shared" | "collaboration") => {
  db.transaction("rw", db.pubSubCollection, async () => {
    await db.pubSubCollection.where("id").equals(goalId)
      .modify((obj: PubSubItem) => {
        const { subscribers } = obj;
        const ind = subscribers.findIndex((ele) => ele.relId === relId);
        console.log(ind);
        if (ind >= 0) {
          subscribers.splice(ind, 1, { relId, type: newType });
        }
        obj.subscribers = [...subscribers];
      });
  }).catch((e) => {
    console.log(e.stack || e);
  });
};
