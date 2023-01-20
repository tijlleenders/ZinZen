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
      await db.pubSubCollection.where("id").equals(relId)
        .modify((obj: PubSubItem) => {
          obj.subscribers = [...obj.subscribers, [{ relId, type }]];
        });
    }).catch((e) => {
      console.log(e.stack || e);
    });
  } else { await addPub(goalId, [{ relId, type }]); }
};
