/* eslint-disable no-param-reassign */
import Dexie, { Table } from "dexie";
import { IFeelingItem } from "./FeelingItem";
import { GoalItem } from "./GoalItem";
import ContactItem from "./ContactItem";
import { InboxItem } from "./InboxItem";
import { TaskItem } from "./TaskItem";
import { GCustomItem } from "./GCustomItem";
import { DumpboxItem } from "./DumpboxItem";
import { TrashItem } from "./TrashItem";
import { HintItem } from "./HintItem";
import { ImpossibleGoalItem } from "./ImpossibleGoalItem";
import { dbStoreSchema, syncVersion } from "./dexie";

export const dexieVersion = 21;

const currentVersion = Number(localStorage.getItem("dexieVersion") || dexieVersion);
localStorage.setItem("dexieVersion", `${dexieVersion}`);

export class ZinZenDB extends Dexie {
  feelingsCollection!: Table<IFeelingItem, number>;

  goalsCollection!: Table<GoalItem, string>;

  contactsCollection!: Table<ContactItem, number>;

  sharedWMCollection!: Table<GoalItem, string>;

  inboxCollection!: Table<InboxItem, string>;

  taskCollection!: Table<TaskItem, string>;

  customizationCollection!: Table<GCustomItem, number>;

  dumpboxCollection!: Table<DumpboxItem, string>;

  goalTrashCollection!: Table<TrashItem, string>;

  hintsCollection!: Table<HintItem, string>;

  impossibleGoalsCollection!: Table<ImpossibleGoalItem, string>;

  constructor() {
    super("ZinZenDB");
    this.version(dexieVersion)
      .stores(dbStoreSchema)
      .upgrade((db) => {
        console.log("🚀 ~ file: db.ts:63 ~ ZinZenDB ~ .upgrade ~ this.verno:", currentVersion);
        syncVersion(db, currentVersion);
      });
  }
}

export const db = new ZinZenDB();
