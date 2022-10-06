import Dexie, { Table } from "dexie";
import { IFeelingItem } from "./FeelingItem";
import { GoalItem } from "./GoalItem";
import ContactItem from "./ContactItem";

export class FeelingsDB extends Dexie {
  feelingsCollection!: Table<IFeelingItem, number>;

  goalsCollection!: Table<GoalItem, number>;

  contactsCollection!: Table<ContactItem, number>;

  constructor() {
    super("ZinZenDB");
    this.version(1).stores({
      feelingsCollection: "++id, content, category, date, note",
      goalsCollection:
      "++id, title, duration, sublist, repeat, start, finish, createdAt, status, parentGoalId, goalColor",
      contactsCollection: "++id, name, relationshipId, createdAt",
    });
  }
}

export const db = new FeelingsDB();
