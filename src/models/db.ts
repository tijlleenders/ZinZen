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

export const dexieVersion = 19;

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
      .stores({
        feelingsCollection: "++id, content, category, date, note",
        goalsCollection:
          "id, category, title, duration, sublist, habit, on, start, due, afterTime, beforeTime, createdAt, parentGoalId, archived, participants, goalColor, language, link, rootGoalId, timeBudget, typeOfGoal",
        sharedWMCollection:
          "id, category, title, duration, sublist, repeat, start, due, afterTime, beforeTime, createdAt, parentGoalId, participants, archived, goalColor, language, link, rootGoalId, timeBudget, typeOfGoal",
        contactsCollection: "id, name, relId, accepted, goalsToBeShared, createdAt, type",
        outboxCollection: null,
        inboxCollection: "id, goalChanges",
        pubSubCollection: "id, subscribers",
        publicGroupsCollection: null,
        taskCollection:
          "id, goalId, title, hoursSpent, completedTodayIds, lastCompleted, lastForget, blockedSlots, forgotToday, completedToday",
        customizationCollection: "++id, goalId, posIndex",
        dumpboxCollection: "id, key, value",
        partnersCollection: null,
        goalTrashCollection:
          "id, category, deletedAt, title, duration, sublist, habit, on, start, due, afterTime, beforeTime, createdAt, parentGoalId, archived, participants, goalColor, language, link, rootGoalId, timeBudget, typeOfGoal",
        hintsCollection: "id, hint",
        impossibleGoalsCollection: "goalId, goalTitle",
      })
      .upgrade((trans) => {
        console.log("🚀 ~ file: db.ts:63 ~ ZinZenDB ~ .upgrade ~ this.verno:", currentVersion);
        if (currentVersion < 9) {
          console.log("processing updates for 9th version");
          const goalsCollection = trans.table("goalsCollection");
          goalsCollection.toCollection().modify((goal) => {
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
        if (currentVersion < 12) {
          console.log("processing updates for 12th version");
          const sharedWMCollection = trans.table("sharedWMCollection");
          sharedWMCollection.clear();

          const goalsCollection = trans.table("goalsCollection");
          goalsCollection.toCollection().modify((goal) => {
            delete goal.shared;
            delete goal.collaboration;
            goal.participants = [];
          });
        }
        if (currentVersion < 13) {
          console.log("processing updates for 13th version");
          const sharedWMCollection = trans.table("sharedWMCollection");
          const goalsCollection = trans.table("goalsCollection");
          sharedWMCollection.toCollection().modify((goal: GoalItem) => {
            goal.participants = goal.participants.map((ele) => ({ ...ele, following: true }));
          });
          goalsCollection.toCollection().modify((goal: GoalItem) => {
            goal.participants = goal.participants.map((ele) => ({ ...ele, following: true }));
          });
        }
        if (currentVersion < 14) {
          console.log("processing updates for 14th version");
          const contactsCollection = trans.table("contactsCollection");
          contactsCollection.toCollection().modify((contact) => {
            delete contact.collaborativeGoals;
            delete contact.sharedGoals;
          });
        }
        if (currentVersion < 16) {
          console.log("processing updates for 16th version");
          const sharedWMCollection = trans.table("sharedWMCollection");
          const goalsCollection = trans.table("goalsCollection");
          sharedWMCollection.toCollection().modify((goal: GoalItem) => {
            goal.newUpdates = false;
          });
          goalsCollection.toCollection().modify((goal: GoalItem) => {
            goal.newUpdates = false;
          });
        }
        if (currentVersion < 17) {
          const contactsCollection = trans.table("contactsCollection");
          contactsCollection.toCollection().modify((contact) => {
            contact.goalsToBeShared = [];
          });
        }
        if (currentVersion < 19) {
          console.log("processing updates for 19th version");
          trans
            .table("sharedWMCollection")
            .toCollection()
            .modify((goal: GoalItem) => {
              goal.category = goal.afterTime || goal.beforeTime ? "Budget" : goal.duration ? "Standard" : "Cluster";
            });
          trans
            .table("goalsCollection")
            .toCollection()
            .modify((goal: GoalItem) => {
              goal.category = goal.afterTime || goal.beforeTime ? "Budget" : goal.duration ? "Standard" : "Cluster";
            });
          trans
            .table("goalTrashCollection")
            .toCollection()
            .modify((goal: GoalItem) => {
              goal.category = goal.afterTime || goal.beforeTime ? "Budget" : goal.duration ? "Standard" : "Cluster";
            });
        }
      });
  }
}

export const db = new ZinZenDB();
