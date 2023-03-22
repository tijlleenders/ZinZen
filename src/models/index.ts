import { db } from "./db";
import type { IFeelingItem } from "./FeelingItem";

export const backupData = async () => {
  await Promise.all([
    db.contactsCollection.toArray(),
    db.feelingsCollection.toArray(),
    db.goalsCollection.toArray(),
    db.inboxCollection.toArray(),
    db.outboxCollection.toArray(),
    db.pubSubCollection.toArray(),
    db.publicGroupsCollection.toArray(),
    db.sharedWMCollection.toArray()
  ]).then((data) => {
    const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ZinzenBackup.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }).catch((error) => {
    console.error(error);
  });
};

export const restoreData = async (e) => {
  const reader = new FileReader();
  reader.readAsText(e.target.files[0]);
  reader.onload = () => {
    const data = JSON.parse(reader.result);
    Promise.all([
      db.contactsCollection.bulkPut(data[0]),
      db.feelingsCollection.bulkPut(data[1]),
      db.goalsCollection.bulkPut(data[2]),
      db.inboxCollection.bulkPut(data[3]),
      db.outboxCollection.bulkPut(data[4]),
      db.pubSubCollection.bulkPut(data[5]),
      db.publicGroupsCollection.bulkPut(data[6]),
      db.sharedWMCollection.bulkPut(data[7])
    ]).then(() => {
      console.log("Data imported successfully!");
    }).catch((error) => {
      console.error(error);
    });
  };
};

export { db, IFeelingItem };
