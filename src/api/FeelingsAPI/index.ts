import { db, IFeelingItem } from '@models';
import { getJustDate } from '@src/utils';

export const getFeeling = async (feelingId: number) => {
  db.transaction('rw', db.feelingsCollection, async () => {
    const feeling = await db.feelingsCollection.get(feelingId);
    return feeling;
  }).catch((e) => {
    console.log(e.stack || e);
  });
};

export const resetDatabase = () => db.transaction('rw', db.feelingsCollection, async () => {
  await Promise.all(db.tables.map((table) => table.clear()));
});

export const removeFeeling = (feelingId: number) => {
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

export const getFeelingsOnDate = async (date: Date) => {
  let feelingsList: IFeelingItem[] = [];
  await db.transaction('rw', db.feelingsCollection, async () => {
    feelingsList = await db.feelingsCollection.where('date').equals(date).toArray();
  }).catch((e) => {
    console.log(e.stack || e);
  });
  return feelingsList;
};

export const getFeelingsBetweenDates = async (startDate: Date, endDate: Date) => {
  db.transaction('rw', db.feelingsCollection, async () => {
    const feelingsList = await db.feelingsCollection.where('date').between(startDate, endDate);
    return feelingsList;
  });
};

export const addFeeling = async (feelingName: string, feelingCategory: string, feelingDate: Date) => {
  // const currentDate = getJustDate(new Date());
  const feelingDateFormatted = getJustDate(feelingDate);
  const currentDateFeelings = await getFeelingsOnDate(feelingDate);
  const checkFeelings = (feeling: IFeelingItem) => feeling.content === feelingName;
  if (currentDateFeelings.some(checkFeelings)) { return; }
  db.transaction('rw', db.feelingsCollection, async () => {
    await db
      .feelingsCollection
      .add({ content: feelingName, date: feelingDateFormatted, category: feelingCategory });
  }).catch((e) => {
    console.log(e.stack || e);
  });
};

export const addFeelingNote = async(feelingId: number, InputNote: string) => {
  const feeling = await db.feelingsCollection.get(feelingId);
  const updatedFeeling = {...feeling, note: InputNote};
  db.transaction('rw', db.feelingsCollection, async () => {
    await db.feelingsCollection.put(updatedFeeling);
  }).catch((e) => {
    console.log(e.stack || e);
  });
};

export const removeFeelingNote = async(feelingId: number) => {
  let feeling = await db.feelingsCollection.get(feelingId);
  delete feeling?.note;
  db.transaction('rw', db.feelingsCollection, async () => {
    await db.feelingsCollection.put(feeling!);
  }).catch((e) => {
    console.log(e.stack || e);
  });
};
