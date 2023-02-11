import { db } from "@models";
import { IMyMetrics, IPoll, PublicGroupItem } from "@src/models/PublicGroupItem";
import { findPublicGroupsOnline } from "@src/services/group.service";

export const addPublicGroup = async (groupDetails: PublicGroupItem) => {
  // @ts-ignore
  const publicGroup: PublicGroupItem = { ...groupDetails, createdAt: new Date() };
  publicGroup.polls = [...publicGroup.polls.map((ele) => (
    {
      ...ele,
      myMetrics: {
        voteScore: 0,
        inMyGoals: false,
        completed: false,
      }
    })
  )];

  let newGoalId;
  await db
    .transaction("rw", db.publicGroupsCollection, async () => {
      newGoalId = await db.publicGroupsCollection.add(publicGroup);
    })
    .catch((e) => {
      console.log(e.stack || e);
    });
  return newGoalId;
};

export const getPublicGroup = async (groupId: string) => {
  const publicGroups: PublicGroupItem[] = await db.publicGroupsCollection.where("id").equals(groupId).toArray();
  return publicGroups[0];
};

export const getAllPublicGroups = async () => {
  const allGroups: PublicGroupItem[] = await db.publicGroupsCollection.toArray();
  allGroups.reverse();
  return allGroups;
};

export const addPollsInPublicGroup = async (publicGroupId: string, polls: IPoll[], replace = false) => (
  db.transaction("rw", db.publicGroupsCollection, async () => {
    await db.publicGroupsCollection.where("id").equals(publicGroupId)
      .modify((obj: PublicGroupItem) => {
        obj.polls = replace ? [...polls] : [...obj.polls, ...polls];
      });
  }).catch((e) => {
    console.log(e.stack || e);
    return "Failed to Share your Goal";
  })
);

export const deleteGroup = async (id: string) => {
  await db.publicGroupsCollection.delete(id).catch((err) => console.log("failed to delete", err));
};

export const updateMyMetric = async (publicGroupId: string, pollId: string, RxnMetric: IMyMetrics) => {
  db.transaction("rw", db.publicGroupsCollection, async () => {
    await db.publicGroupsCollection.where("id").equals(publicGroupId)
      .modify((obj: PublicGroupItem) => {
        const indx = obj.polls.findIndex((poll) => poll.id === pollId);
        if (indx) {
          obj.polls[indx].myMetrics = RxnMetric;
        }
      });
  }).catch((e) => {
    console.log(e.stack || e);
    return "Failed to Share your Goal";
  });
};

export const syncGroupPolls = async () => {
  findPublicGroupsOnline().then(async (res) => {
    if (res.success) {
      const mygroups = await getAllPublicGroups();
      const userGroups = mygroups.reduce((acc, curr) => ({ ...acc, [curr.id]: curr }), {});
      res.response.forEach(async (group: PublicGroupItem) => {
        if (Object.keys(userGroups).includes(group.id)) {
          addPollsInPublicGroup(group.id, group.polls, true).then(() => {
            if (Object.keys(userGroups).length > 0) {
              userGroups[group.id].polls.forEach(async (poll: IPoll) => {
                updateMyMetric(group.id, poll.id, userGroups[group.id].poll.myMetrics);
              });
            }
          });
        }
      });
    }
  });
};
