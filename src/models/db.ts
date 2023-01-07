import Dexie, { Table } from "dexie";
import { IFeelingItem } from "./FeelingItem";
import { GoalItem } from "./GoalItem";
import ContactItem from "./ContactItem";
import { OutboxItem } from "./OutboxItem";

export class FeelingsDB extends Dexie {
  feelingsCollection!: Table<IFeelingItem, number>;

  goalsCollection!: Table<GoalItem, number>;

  contactsCollection!: Table<ContactItem, number>;

  outboxCollection!: Table<OutboxItem, number>;

  constructor() {
    super("ZinZenDB");
    this.version(1).stores({
      feelingsCollection: "++id, content, category, date, note",
      goalsCollection:
      "id, title, duration, sublist, repeat, start, due, afterTime, beforeTime, createdAt, parentGoalId, archived, goalColor, language, link, collaboration, shared",
      contactsCollection: "id, name, collaborativeGoals, sharedGoals, relId, accepted, createdAt",
      outboxCollection: "++id, relId, goalId, subgoals, updates, deleted, completed, anyUpdates"
    });
  }
}

export const db = new FeelingsDB();
