import { db } from '@models';
import { getJustDate } from '@src/utils';

export const resetDatabase = () => db.transaction('rw', db.feelingItems, async () => {
  await Promise.all(db.tables.map((table) => table.clear()));
});

export const addFeeling = (feelingName : string, feelingCategory : string) => {
  const currentDate = getJustDate(new Date());
  db.transaction('rw', db.feelingsCollection, async () => {
    await db
      .feelingsCollection
      .add({ content: feelingName, date: currentDate, category: feelingCategory });
  }).catch((e) => {
    console.log(e.stack || e);
  });
};

export const removeFeeling = (feelingId) => {
  db.transaction('rw', db.feelingsCollection, async () => {
    await db.feelingsCollection.delete(feelingId);
  }).catch((e) => {
    console.log(e.stack || e);
  });
};

export const getAllFeelings = async () => {
  const allFeelings = await db.feelingsCollection.toArray();
  console.log(allFeelings);
  return allFeelings;
};

export const getFeelingsOnDate = async (date) => {
  db.transaction('rw', db.feelingsCollection, async () => {
    const feelingsList = await db.feelingsCollection.where('date').equals(date);
    return feelingsList;
  }).catch((e) => {
    console.log(e.stack || e);
  });
};

export const getFeelingsBetweenDates = async (startDate, endDate) => {
  db.transaction('rw', db.feelingsCollection, async () => {
    const feelingsList = await db.feelingsCollection.where('date').between(startDate, endDate);
    return feelingsList;
  });
};
