import Dexie, { Table } from "dexie";
import { IFeelingItem } from "./FeelingItem";
import { GoalItem } from "./GoalItem";
import ContactItem from "./ContactItem";
import { DumpboxItem } from "./DumpboxItem";

export class FeelingsDB extends Dexie {
  feelingsCollection!: Table<IFeelingItem, number>;

  goalsCollection!: Table<GoalItem, number>;

  contactsCollection!: Table<ContactItem, number>;

  dumpboxCollection!: Table<DumpboxItem, number>;

  constructor() {
    super("ZinZenDB");
    this.version(1).stores({
      feelingsCollection: "++id, content, category, date, note",
      goalsCollection:
      "id, title, duration, sublist, repeat, start, due, afterTime, beforeTime, createdAt, parentGoalId, status, goalColor, language, link, collaboration, shared",
      contactsCollection: "id, name, collaborativeGoals, sharedGoals, relId, accepted, createdAt",
      dumpboxCollection: "++id, relId, goalId, subgoals, updatedGoals, deletedGoals"
    });
  }
}

export const db = new FeelingsDB();
