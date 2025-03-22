/* eslint-disable no-param-reassign */
import Dexie, { Table } from "dexie";
import { LocalStorageKeys } from "@src/constants/localStorageKeys";
import { IFeelingItem } from "./FeelingItem";
import { GoalItem } from "./GoalItem";
import ContactItem from "./ContactItem";
import { InboxItem } from "./InboxItem";
import { TaskItem } from "./TaskItem";
import { GCustomItem } from "./GCustomItem";
import { SchedulerOutputCacheItem } from "./SchedulerOutputCacheItem";
import { TrashItem } from "./TrashItem";
import { HintItem } from "./HintItem";
import { ImpossibleGoalItem } from "./ImpossibleGoalItem";
import { dbStoreSchema, syncVersion } from "./dexie";
import { TaskHistoryItem } from "./TaskHistoryItem";
import { TasksDoneTodayItem } from "./TasksDoneTodayItem";

export const dexieVersion = 24;

const currentVersion = Number(localStorage.getItem(LocalStorageKeys.DEXIE_VERSION) || dexieVersion);
localStorage.setItem(LocalStorageKeys.DEXIE_VERSION, `${dexieVersion}`);

export class ZinZenDB extends Dexie {
  feelingsCollection!: Table<IFeelingItem, number>;

  goalsCollection!: Table<GoalItem, string>;

  contactsCollection!: Table<ContactItem, string>;

  sharedWMCollection!: Table<GoalItem, string>;

  inboxCollection!: Table<InboxItem, string>;

  taskCollection!: Table<TaskItem, string>;

  customizationCollection!: Table<GCustomItem, number>;

  schedulerOutputCacheCollection!: Table<SchedulerOutputCacheItem, string>;

  goalTrashCollection!: Table<TrashItem, string>;

  hintsCollection!: Table<HintItem, string>;

  impossibleGoalsCollection!: Table<ImpossibleGoalItem, string>;

  taskHistoryCollection!: Table<TaskHistoryItem, string>;

  tasksDoneTodayCollection!: Table<TasksDoneTodayItem, string>;

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
