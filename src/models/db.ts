/* eslint-disable no-param-reassign */
import Dexie, { Table } from "dexie";
import { IFeelingItem } from "./FeelingItem";
import { GoalItem } from "./GoalItem";
import ContactItem from "./ContactItem";
import { InboxItem } from "./InboxItem";
import { TaskItem } from "./TaskItem";
import { GCustomItem } from "./GCustomItem";
import { DumpboxItem } from "./DumpboxItem";
import { PartnerItem } from "./PartnerItem";

export const dexieVersion = 11;

const currentVersion = localStorage.getItem("dexieVersion") || dexieVersion;
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

  partnersCollection!: Table<PartnerItem, string>;

  constructor() {
    super("ZinZenDB");
    this.version(dexieVersion)
      .stores({
        feelingsCollection: "++id, content, category, date, note",
        goalsCollection:
          "id, title, duration, sublist, habit, on, start, due, afterTime, beforeTime, createdAt, parentGoalId, archived, goalColor, language, link, rootGoalId, timeBudget, typeOfGoal",
        sharedWMCollection:
          "id, title, duration, sublist, repeat, start, due, afterTime, beforeTime, createdAt, parentGoalId, archived, goalColor, language, link, rootGoalId, timeBudget, typeOfGoal",
        contactsCollection: "id, name, collaborativeGoals, sharedGoals, relId, accepted, createdAt",
        outboxCollection: null,
        inboxCollection: "id, goalChanges",
        pubSubCollection: "id, subscribers",
        publicGroupsCollection: null,
        taskCollection:
          "id, goalId, title, hoursSpent, completedTodayIds, lastCompleted, lastForget, blockedSlots, forgotToday, completedToday",
        customizationCollection: "++id, goalId, posIndex",
        dumpboxCollection: "id, key, value",
        partnersCollection: "++id, relId, name, goals",
      })
      .upgrade((trans) => {
        console.log("🚀 ~ file: db.ts:63 ~ ZinZenDB ~ .upgrade ~ this.verno:", currentVersion);
        if (currentVersion < 9) {
          console.log("processing updates for 9th version");
          const goalsCollection = trans.table("goalsCollection");
          goalsCollection.toCollection().modify((goal: GoalItem) => {
            if (goal.on === "weekends") {
              goal.on = ["Sat", "Sun"];
            } else {
              goal.on = ["Mon", "Tue", "Wed", "Thu", "Fri"];
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
        }
        if (currentVersion < 10) {
          console.log("processing updates for 10th version");
          const sharedWMCollection = trans.table("sharedWMCollection");
          const partnersCollection = trans.table("partnersCollection");
          partnersCollection.clear();
          sharedWMCollection.clear();

          const goalsCollection = trans.table("goalsCollection");
          goalsCollection.toCollection().modify((goal: GoalItem) => {
            delete goal.shared;
            delete goal.collaboration;
            goal.participants = [];
          });
        }
      });
  }
}

export const db = new ZinZenDB();
