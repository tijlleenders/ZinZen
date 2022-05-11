import { db } from '@models';

export const resetDatabase = () => db.transaction('rw', db.goalItems, async () => {
  await Promise.all(db.tables.map((table) => table.clear()));
});

export const addGoal = (goalDetails :{
  title: string,
  duration: string,
  repeat: string,
  start: Date,
  finish: Date,
  createdAt: Date}) => {
  db.transaction('rw', db.goalsCollection, async () => {
    await db
      .goalsCollection
      .add(goalDetails);
  }).catch((e) => {
    console.log(e.stack || e);
  });
};

export const removeFeeling = (goalId) => {
  db.transaction('rw', db.goalsCollection, async () => {
    await db.goalsCollection.delete(goalId);
  }).catch((e) => {
    console.log(e.stack || e);
  });
};

export const getAllGoals = async () => {
  const allGoals = await db.goalsCollection.toArray();
  console.log(allGoals);
  return allGoals;
};

export const getGoalsOnDate = async (date) => {
  db.transaction('rw', db.goalsCollection, async () => {
    const goalsList = await db.goalsCollection.where('start').equals(date);
    return goalsList;
  }).catch((e) => {
    console.log(e.stack || e);
  });
};
