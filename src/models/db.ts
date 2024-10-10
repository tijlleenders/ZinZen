/* eslint-disable no-param-reassign */
import Dexie, { Table } from "dexie";
import { LocalStorageKeys } from "@src/constants/localStorageKeys";
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
    this.goalsCollection.hook("updating", (modfications: GoalItem) => {
      modfications.timestamp = Date.now();
      return modfications;
    });

    this.goalsCollection.hook("creating", (primKey, obj) => {
      obj.timestamp = Date.now();
    });
  }
}

export const db = new ZinZenDB();
