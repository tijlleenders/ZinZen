/* eslint-disable no-param-reassign */
import { db } from "@models";
import { GoalItem, IParticipant } from "@src/models/GoalItem";
import { createGetHintsRequest, shareGoal } from "@src/services/goal.service";
import { getInstallId } from "@src/utils";
import { IHintRequestBody } from "@src/models/HintItem";
import { sortGoalsByProps } from "../GCustomAPI";
import { deleteHintItem, getGoalHintItem } from "../HintsAPI";

export const addDeletedGoal = async (goal: GoalItem) => {
  await db
    .transaction("rw", db.goalTrashCollection, async () => {
      await db.goalTrashCollection.add({ ...goal, deletedAt: new Date().toISOString() });
    })
    .catch((e) => {
      console.log(e.stack || e);
    });
};

export const addIntoSublist = async (parentGoalId: string, goalIds: string[]) => {
  db.transaction("rw", db.goalsCollection, async () => {
    await db.goalsCollection
      .where("id")
      .equals(parentGoalId)
      .modify((obj: GoalItem) => {
        obj.sublist = [...obj.sublist, ...goalIds];
      });
  }).catch((e) => {
    console.log(e.stack || e);
  });
};

export const addGoal = async (goalDetails: GoalItem) => {
  // @ts-ignore
  const goals: GoalItem = { ...goalDetails, createdAt: new Date() };
  let newGoalId;
  await db
    .transaction("rw", db.goalsCollection, async () => {
      newGoalId = await db.goalsCollection.add(goals);
    })
    .catch((e) => {
      console.log(e.stack || e);
    });
  return newGoalId;
};

export const getGoal = async (goalId: string) => {
  const goal: GoalItem[] = await db.goalsCollection.where("id").equals(goalId).toArray();
  return goal.length > 0 ? goal[0] : null;
};

export const getChildrenGoals = async (parentGoalId: string) => {
  const childrenGoals: GoalItem[] = await db.goalsCollection
    .where("parentGoalId")
    .equals(parentGoalId)
    .sortBy("createdAt");
  childrenGoals.reverse();
  const sortedGoals = await sortGoalsByProps(childrenGoals);
  return sortedGoals;
};

export const getAllGoals = async (includeArchived = "false") => {
  const allGoals = await db.goalsCollection.where("archived").equals(includeArchived).toArray();
  allGoals.reverse();
  return allGoals;
};

export const checkMagicGoal = async () => {
  const goal = await db.goalsCollection.where("title").equals("magic").toArray();
  return !!(goal && goal.length > 0);
};

export const getActiveGoals = async (includeArchived = "false") => {
  const activeGoals: GoalItem[] = await db.goalsCollection
    .where("parentGoalId")
    .equals("root")
    .and((goal) => (includeArchived === "true" ? true : goal.parentGoalId === "root"))
    .sortBy("createdAt");
  activeGoals.reverse();
  const sortedGoals = await sortGoalsByProps(activeGoals);
  return sortedGoals;
};

export const updateGoal = async (id: string, changes: object) => {
  db.transaction("rw", db.goalsCollection, async () => {
    await db.goalsCollection.update(id, changes).then((updated) => updated);
  }).catch((e) => {
    console.log(e.stack || e);
  });
};

export const archiveGoal = async (goal: GoalItem) => {
  db.transaction("rw", db.goalsCollection, async () => {
    await db.goalsCollection.update(goal.id, { archived: "true" });
  });
  if (goal.parentGoalId !== "root" && goal.typeOfGoal !== "shared") {
    const parentGoal = await getGoal(goal.parentGoalId);
    db.transaction("rw", db.goalsCollection, async () => {
      await db.goalsCollection.update(goal.parentGoalId, {
        sublist: parentGoal?.sublist.filter((ele) => ele !== goal.id),
      });
    });
  }
};

export const archiveChildrenGoals = async (id: string) => {
  const childrenGoals = await getChildrenGoals(id);
  if (childrenGoals) {
    childrenGoals.forEach(async (goal: GoalItem) => {
      await archiveChildrenGoals(goal.id);
      await archiveGoal(goal);
    });
  }
};

export const archiveUserGoal = async (goal: GoalItem) => {
  await archiveChildrenGoals(goal.id);
  await archiveGoal(goal);
};

export const unarchiveGoal = async (goal: GoalItem) => {
  db.transaction("rw", db.goalsCollection, async () => {
    await db.goalsCollection.update(goal.id, { archived: "false" });
  });
  if (goal.parentGoalId !== "root" && goal.typeOfGoal !== "shared") {
    const parentGoal = await getGoal(goal.parentGoalId);
    db.transaction("rw", db.goalsCollection, async () => {
      await db.goalsCollection.update(goal.parentGoalId, { sublist: [...parentGoal.sublist, goal.id] });
    });
  }
};

export const unarchiveChildrenGoals = async (id: string) => {
  const childrenGoals = await getChildrenGoals(id);
  if (childrenGoals) {
    childrenGoals.forEach(async (goal: GoalItem) => {
      await unarchiveChildrenGoals(goal.id);
      await unarchiveGoal(goal);
    });
  }
};

export const unarchiveUserGoal = async (goal: GoalItem) => {
  await unarchiveChildrenGoals(goal.id);
  await unarchiveGoal(goal);
};

export const removeGoal = async (goal: GoalItem) => {
  await deleteHintItem(goal.id);
  await Promise.allSettled([
    db.goalsCollection.delete(goal.id).catch((err) => console.log("failed to delete", err)),
    addDeletedGoal(goal),
  ]);
};

export const removeChildrenGoals = async (parentGoalId: string) => {
  const childrenGoals = await getChildrenGoals(parentGoalId);
  if (childrenGoals.length === 0) {
    return;
  }
  childrenGoals.forEach((goal) => {
    removeChildrenGoals(goal.id);
    removeGoal(goal);
  });
};

export const shareMyGoalAnonymously = async (goal: GoalItem, parent: string) => {
  const shareableGoal = {
    method: "shareMessage",
    parentTitle: parent,
    goal: {
      title: goal.title,
      duration: goal.duration,
      habit: goal.habit,
      start: goal.start?.toString(),
      on: goal.on,
      timeBudget: goal.timeBudget,
      due: goal.due?.toString(),
      afterTime: goal.afterTime,
      beforeTime: goal.beforeTime,
      createdAt: goal.createdAt,
      goalColor: goal.goalColor,
      language: goal.language,
      link: goal.link,
    },
  };
  const res = await shareGoal(shareableGoal);
  return res;
};

export const getHintsFromAPI = async (goal: GoalItem) => {
  let parentGoalTitle = "root";
  let parentGoalHint = false;

  if (goal.parentGoalId !== "root") {
    const parentGoal = await getGoal(goal.parentGoalId);
    parentGoalTitle = parentGoal?.title || "";
    parentGoalHint = (await getGoalHintItem(goal.parentGoalId))?.hint || false;
  }

  const { title, duration } = goal;

  const requestBody: IHintRequestBody = {
    method: "getHints",
    installId: getInstallId(),
    goal: { title, duration: duration !== null ? duration : undefined },
  };

  if (goal.parentGoalId !== "root" && parentGoalHint) {
    requestBody.parentTitle = parentGoalTitle;
  }

  const res = await createGetHintsRequest(requestBody);
  return res.response;
};

export const updateSharedStatusOfGoal = async (id: string, relId: string, name: string) => {
  db.transaction("rw", db.goalsCollection, async () => {
    await db.goalsCollection
      .where("id")
      .equals(id)
      .modify((obj: GoalItem) => {
        if (!obj.participants.find((ele) => ele.relId === relId)) {
          obj.participants.push({ relId, name, type: "sharer", following: true });
        }
      });
  }).catch((e) => {
    console.log(e.stack || e);
  });
};

export const followContactOnGoal = async (id: string, participant: IParticipant) => {
  console.log(id, participant);
  db.transaction("rw", db.goalsCollection, async () => {
    await db.goalsCollection
      .where("id")
      .equals(id)
      .modify((obj: GoalItem) => {
        obj.participants = [...obj.participants.filter((ele) => ele.relId !== participant.relId), participant];
      });
  }).catch((e) => {
    console.log(e.stack || e);
  });
};

export const getParticipantsOfGoals = async (ids: string[]) => {
  const goals = await db.goalsCollection
    .where("id")
    .anyOf(...ids)
    .toArray();
  return goals.flatMap((goal) => goal.participants.map((participant) => ({ sub: participant, rootGoalId: goal.id })));
};

// export const convertSharedGoalToColab = async (id: string, accepted = true) => {
//   db.transaction("rw", db.goalsCollection, async () => {
//     await db.goalsCollection
//       .where("id")
//       .equals(id)
//       .modify((obj: GoalItem) => {
//         if (accepted) {
//           obj.collaboration.collaborators.push(obj.shared.contacts[0]);
//           obj.typeOfGoal = "collaboration";
//           obj.shared = getDefaultValueOfShared();
//         } else {
//           obj.shared.conversionRequests = getDefaultValueOfShared().conversionRequests;
//         }
//       });
//   }).catch((e) => {
//     console.log(e.stack || e);
//   });
// };

export const notifyNewColabRequest = async (id: string, relId: string) => {
  db.transaction("rw", db.goalsCollection, async () => {
    await db.goalsCollection
      .where("id")
      .equals(id)
      .modify((obj: GoalItem) => {
        obj.shared.conversionRequests = { status: true, senders: [relId] };
      });
  }).catch((e) => {
    console.log(e.stack || e);
  });
};

// export const changeNewUpdatesStatus = async (newUpdates: boolean, goalId: string) => {
//   db.transaction("rw", db.goalsCollection, async () => {
//     await db.goalsCollection
//       .where("id")
//       .equals(goalId)
//       .modify(async (obj: GoalItem) => {
//         obj.collaboration = {
//           ...obj.collaboration,
//           newUpdates,
//           allowed: false,
//         };
//       });
//   }).catch((e) => {
//     console.log(e.stack || e, goalId);
//   });
// };

export const removeGoalWithChildrens = async (goal: GoalItem) => {
  await removeChildrenGoals(goal.id);
  await removeGoal(goal);
  if (goal.parentGoalId !== "root") {
    getGoal(goal.parentGoalId).then(async (parentGoal: GoalItem) => {
      const parentGoalSublist = parentGoal.sublist;
      const childGoalIndex = parentGoalSublist.indexOf(goal.id);
      if (childGoalIndex !== -1) {
        parentGoalSublist.splice(childGoalIndex, 1);
      }
      await updateGoal(parentGoal.id, { sublist: parentGoalSublist });
    });
  }
};

export const getAllLevelGoalsOfId = async (id: string, resetSharedStatus = false) => {
  const goalsAcc: GoalItem[] = [];

  const processGoalAndChildren = async (goalId: string) => {
    const goal = await getGoal(goalId);
    if (!goal) return;

    goalsAcc.push(resetSharedStatus ? { ...goal, participants: [] } : goal);
    const childrenGoals = await getChildrenGoals(goalId);
    await Promise.all(childrenGoals.map((childGoal) => processGoalAndChildren(childGoal.id)));
  };

  await processGoalAndChildren(id);

  console.log(goalsAcc);
  return goalsAcc;
};
