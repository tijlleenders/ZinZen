import Dexie, { Table } from "dexie";
import { IFeelingItem } from "./FeelingItem";
import { GoalItem } from "./GoalItem";
import ContactItem from "./ContactItem";
import { OutboxItem } from "./OutboxItem";
import { PubSubItem } from "./PubSubItem";
import { InboxItem } from "./InboxItem";
import { PublicGroupItem } from "./PublicGroupItem";

export class ZinZenDB extends Dexie {
  feelingsCollection!: Table<IFeelingItem, number>;

  goalsCollection!: Table<GoalItem, string>;

  contactsCollection!: Table<ContactItem, number>;

  sharedWMCollection!: Table<GoalItem, string>;

  outboxCollection!: Table<OutboxItem, number>;

  pubSubCollection!: Table<PubSubItem, string>;

  inboxCollection!: Table<InboxItem, string>;

  publicGroupsCollection!: Table<PublicGroupItem, string>;

  constructor() {
    super("ZinZenDB");
    this.version(1).stores({
      feelingsCollection: "++id, content, category, date, note",
      goalsCollection: "id, title, duration, sublist, habit, on, start, due, afterTime, beforeTime, createdAt, parentGoalId, archived, goalColor, language, link, collaboration, shared, rootGoalId, timeBudget, typeOfGoal",
      sharedWMCollection: "id, title, duration, sublist, repeat, start, due, afterTime, beforeTime, createdAt, parentGoalId, archived, goalColor, language, link, collaboration, shared, rootGoalId, timeBudget, typeOfGoal",
      contactsCollection: "id, name, collaborativeGoals, sharedGoals, relId, accepted, createdAt",
      outboxCollection: "++id, relId, goalId, subgoals, updates, deleted, completed, anyUpdates",
      inboxCollection: "id, goalChanges",
      pubSubCollection: "id, subscribers",
      publicGroupsCollection: "id, title, polls, language, groupColor, createdAt"
    });
  }
}

export const db = new ZinZenDB();
