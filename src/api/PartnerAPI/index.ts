/* eslint-disable no-param-reassign */
import { db } from "@models";
import { GoalItem } from "@src/models/GoalItem";
import { PartnerItem } from "@src/models/PartnerItem";

export const getPartnerByRelId = async (relId: string) => {
  const partner: PartnerItem[] = await db.partnersCollection.where("relId").equals(relId).toArray();
  return partner.length > 0 ? partner[0] : null;
};

export const getMyPartner = async () => {
  const partner: PartnerItem[] = await db.partnersCollection.toArray();
  return partner.length > 0 ? partner[0] : null;
};

export const createPartner = async (relId: string, name: string) => {
  db.transaction("rw", db.partnersCollection, async () => {
    await db.partnersCollection.add({
      relId,
      name,
      goals: [],
    });
  }).catch((e) => {
    console.log(e.stack || e);
  });
};

export const addGoalToPartner = async (relId: string, goal: GoalItem) => {
  db.transaction("rw", db.partnersCollection, async () => {
    await db.partnersCollection
      .where("relId")
      .equals(relId)
      .modify((obj: PartnerItem) => {
        obj.goals.push(goal);
      });
  }).catch((e) => {
    console.log(e.stack || e);
  });
};

export const removeGoalFromPartner = async (relId: string, goal: GoalItem) => {
  db.transaction("rw", db.partnersCollection, async () => {
    await db.partnersCollection
      .where("relId")
      .equals(relId)
      .modify((obj: PartnerItem) => {
        obj.goals = [...obj.goals.filter((pg) => pg.id !== goal.id)];
      });
  }).catch((e) => {
    console.log(e.stack || e);
  });
};
