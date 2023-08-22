/* eslint-disable no-param-reassign */
import Dexie, { Table } from "dexie";
import { IFeelingItem } from "./FeelingItem";
import { GoalItem } from "./GoalItem";
import ContactItem from "./ContactItem";
import { OutboxItem } from "./OutboxItem";
import { PubSubItem } from "./PubSubItem";
import { InboxItem } from "./InboxItem";
import { PublicGroupItem } from "./PublicGroupItem";
import { TaskItem } from "./TaskItem";
import { GCustomItem } from "./GCustomItem";
import { DumpboxItem } from "./DumpboxItem";

export const dexieVersion = 7;

localStorage.setItem("dexieVersion", `${dexieVersion}`);

export class ZinZenDB extends Dexie {
  feelingsCollection!: Table<IFeelingItem, number>;

  goalsCollection!: Table<GoalItem, string>;

  contactsCollection!: Table<ContactItem, number>;

  sharedWMCollection!: Table<GoalItem, string>;

  outboxCollection!: Table<OutboxItem, number>;

  pubSubCollection!: Table<PubSubItem, string>;

  inboxCollection!: Table<InboxItem, string>;

  publicGroupsCollection!: Table<PublicGroupItem, string>;

  taskCollection!: Table<TaskItem, string>;

  customizationCollection!: Table<GCustomItem, number>;

  dumpboxCollection!: Table<DumpboxItem, string>;

  constructor() {
    super("ZinZenDB");
    this.version(dexieVersion)
      .stores({
        feelingsCollection: "++id, content, category, date, note",
        goalsCollection:
          "id, title, duration, sublist, habit, on, start, due, afterTime, beforeTime, createdAt, parentGoalId, archived, goalColor, language, link, collaboration, shared, rootGoalId, timeBudget, typeOfGoal",
        sharedWMCollection:
          "id, title, duration, sublist, repeat, start, due, afterTime, beforeTime, createdAt, parentGoalId, archived, goalColor, language, link, collaboration, shared, rootGoalId, timeBudget, typeOfGoal",
        contactsCollection: "id, name, collaborativeGoals, sharedGoals, relId, accepted, createdAt",
        outboxCollection: "++id, relId, goalId, subgoals, updates, deleted, completed, anyUpdates",
        inboxCollection: "id, goalChanges",
        pubSubCollection: "id, subscribers",
        publicGroupsCollection: "id, title, polls, language, groupColor, createdAt",
        taskCollection:
          "id, goalId, title, hoursSpent, completedTodayIds, lastCompleted, lastForget, blockedSlots, forgotToday, completedToday",
        customizationCollection: "++id, goalId, posIndex",
        dumpboxCollection: "id, key, value",
      })
      .upgrade((trans) => {
        const goalsCollection = trans.table("goalsCollection");
        goalsCollection.toCollection().modify((goal: GoalItem) => {
          if (goal.on === "weekends") {
            goal.on = ["Saturday", "Sunday"];
          } else {
            goal.on = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
          }
          if (goal.habit !== "weekly") {
            goal.habit = null;
          }
          goal.timeBudget = {
            perDay: goal.timeBudget?.period === "day" ? `${goal.timeBudget?.duration}` : null,
            perWeek: goal.timeBudget?.period === "week" ? `${goal.timeBudget?.duration}` : null,
          };
        });
        const taskCollection = trans.table("taskCollection");
        taskCollection.toCollection().modify((task: TaskItem) => {
          task.blockedSlots = [];
          task.forgotToday = [];
          task.completedToday = 0;
          task.completedTodayIds = [];
        });
      });
  }
}

export const db = new ZinZenDB();
