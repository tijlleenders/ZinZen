/* eslint-disable no-param-reassign */
import { db } from "@models";
import { ISubscriber, PubSubItem, typeOfSub } from "@src/models/PubSubItem";

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

export const addSubInPub = async (goalId: string, subId: string, type: typeOfSub) => {
  const pubId = await getPubById(goalId);
  if (pubId) {
    db.transaction("rw", db.pubSubCollection, async () => {
      await db.pubSubCollection.where("id").equals(goalId)
        .modify((obj: PubSubItem) => {
          obj.subscribers.push({ subId, type });
        });
    }).catch((e) => {
      console.log(e.stack || e);
    });
  } else { await addPub(goalId, [{ subId, type }]); }
};

export const convertTypeOfSub = async (goalId: string, subId: string, newType: typeOfSub) => {
  db.transaction("rw", db.pubSubCollection, async () => {
    await db.pubSubCollection.where("id").equals(goalId)
      .modify((obj: PubSubItem) => {
        const { subscribers } = obj;
        const ind = subscribers.findIndex((ele) => ele.subId === subId);
        console.log(ind);
        if (ind >= 0) {
          subscribers.splice(ind, 1, { subId, type: newType });
        }
        obj.subscribers = [...subscribers];
      });
  }).catch((e) => {
    console.log(e.stack || e);
  });
};

export const findTypeOfSub = async (goalId: string) => {
  const goal = await db.pubSubCollection.where("id").equals(goalId).toArray();
  if (goal && goal.length > 0) { return "collaboration"; }
  return "none";
};
