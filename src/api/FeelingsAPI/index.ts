import { db } from '@models';
import { getJustDate } from '@src/utils';

export const resetDatabase = () => db.transaction('rw', db.feelingsCollection, async () => {
  await Promise.all(db.tables.map((table) => table.clear()));
});

export const removeFeeling = (feelingId) => {
  db.transaction('rw', db.feelingsCollection, async () => {
    await db.feelingsCollection.delete(feelingId);
  }).catch((e) => {
    console.log(e.stack || e);
  });
};

export const getAllFeelings = async () => {
  const allFeelings = await db.feelingsCollection.toArray();
  return allFeelings;
};

export const getFeelingsOnDate = async (date) => {
  let feelingsList = [];
  await db.transaction('rw', db.feelingsCollection, async () => {
    feelingsList = await db.feelingsCollection.where('date').equals(date).toArray();
  }).catch((e) => {
    console.log(e.stack || e);
  });
  return feelingsList;
};

export const getFeelingsBetweenDates = async (startDate, endDate) => {
  db.transaction('rw', db.feelingsCollection, async () => {
    const feelingsList = await db.feelingsCollection.where('date').between(startDate, endDate);
    return feelingsList;
  });
};

export const addFeeling = async (feelingName : string, feelingCategory : string) => {
  const currentDate = getJustDate(new Date());
  const currentDateFeelings = await getFeelingsOnDate(currentDate);
  const checkFeelings = (feeling) => feeling.content === feelingName;
  if (currentDateFeelings.some(checkFeelings)) { return; }
  db.transaction('rw', db.feelingsCollection, async () => {
    await db
      .feelingsCollection
      .add({ content: feelingName, date: currentDate, category: feelingCategory });
  }).catch((e) => {
    console.log(e.stack || e);
  });
};
