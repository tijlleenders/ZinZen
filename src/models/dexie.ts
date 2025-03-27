/* eslint-disable no-param-reassign */
import { Transaction } from "dexie";
import { GoalItem } from "./GoalItem";
import { HintItem } from "./HintItem";
import { TaskItem } from "./TaskItem";

export const dbStoreSchema = {
  feelingsCollection: "++id, content, category, date, note",
  goalsCollection:
    "id, category, title, duration, sublist, habit, on, start, due, afterTime, beforeTime, createdAt, parentGoalId, archived, participants, goalColor, language, link, notificationGoalId, isShared, timeBudget, typeOfGoal, timestamp",
  sharedWMCollection:
    "id, category, title, duration, sublist, repeat, start, due, afterTime, beforeTime, createdAt, parentGoalId, participants, archived, goalColor, language, link, notificationGoalId, isShared, timeBudget, typeOfGoal",
  contactsCollection: "id, name, relId, accepted, goalsToBeShared, createdAt, type",
  outboxCollection: null,
  inboxCollection: "id, goalChanges",
  pubSubCollection: "id, subscribers",
  publicGroupsCollection: null,
  taskCollection:
    "id, goalId, title, hoursSpent, completedTodayIds, lastCompleted, lastSkipped, blockedSlots, skippedToday, completedToday",
  customizationCollection: "++id, goalId, posIndex",
  dumpboxCollection: null,
  partnersCollection: null,
  goalTrashCollection:
    "id, category, deletedAt, title, duration, sublist, habit, on, start, due, afterTime, beforeTime, createdAt, parentGoalId, archived, participants, goalColor, language, link, notificationGoalId, timeBudget, typeOfGoal",
  hintsCollection: "id, hintOptionEnabled, availableGoalHints, lastCheckedDate, nextCheckDate",
  impossibleGoalsCollection: "goalId, goalTitle",
  schedulerOutputCacheCollection: "id, key, value",
  taskHistoryCollection: "++id, goalId, eventType, eventTime, scheduledStart, scheduledEnd, duration",
  tasksDoneTodayCollection: null,
};
export const syncVersion = (transaction: Transaction, currentVersion: number) => {
  if (currentVersion < 9) {
    console.log("processing updates for 9th version");
    const goalsCollection = transaction.table("goalsCollection");
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
    const taskCollection = transaction.table("taskCollection");
    taskCollection.toCollection().modify((task: TaskItem) => {
      task.blockedSlots = [];
    });
  }
  if (currentVersion < 12) {
    console.log("processing updates for 12th version");
    const sharedWMCollection = transaction.table("sharedWMCollection");
    sharedWMCollection.clear();

    const goalsCollection = transaction.table("goalsCollection");
    goalsCollection.toCollection().modify((goal) => {
      delete goal.shared;
      delete goal.collaboration;
      goal.participants = [];
    });
  }
  if (currentVersion < 13) {
    console.log("processing updates for 13th version");
    const sharedWMCollection = transaction.table("sharedWMCollection");
    const goalsCollection = transaction.table("goalsCollection");
    sharedWMCollection.toCollection().modify((goal: GoalItem) => {
      goal.participants = goal.participants.map((ele) => ({ ...ele, following: true }));
    });
    goalsCollection.toCollection().modify((goal: GoalItem) => {
      goal.participants = goal.participants.map((ele) => ({ ...ele, following: true }));
    });
  }
  if (currentVersion < 14) {
    console.log("processing updates for 14th version");
    const contactsCollection = transaction.table("contactsCollection");
    contactsCollection.toCollection().modify((contact) => {
      delete contact.collaborativeGoals;
      delete contact.sharedGoals;
    });
  }
  if (currentVersion < 16) {
    console.log("processing updates for 16th version");
    const sharedWMCollection = transaction.table("sharedWMCollection");
    const goalsCollection = transaction.table("goalsCollection");
    sharedWMCollection.toCollection().modify((goal: GoalItem) => {
      goal.newUpdates = false;
    });
    goalsCollection.toCollection().modify((goal: GoalItem) => {
      goal.newUpdates = false;
    });
  }
  if (currentVersion < 17) {
    const contactsCollection = transaction.table("contactsCollection");
    contactsCollection.toCollection().modify((contact) => {
      contact.goalsToBeShared = [];
    });
  }
  if (currentVersion < 19) {
    console.log("processing updates for 19th version");
    transaction
      .table("sharedWMCollection")
      .toCollection()
      .modify((goal: GoalItem) => {
        goal.category = goal.afterTime || goal.beforeTime ? "Budget" : goal.duration ? "Standard" : "Cluster";
      });
    transaction
      .table("goalsCollection")
      .toCollection()
      .modify((goal: GoalItem) => {
        goal.category = goal.afterTime || goal.beforeTime ? "Budget" : goal.duration ? "Standard" : "Cluster";
      });
    transaction
      .table("goalTrashCollection")
      .toCollection()
      .modify((goal: GoalItem) => {
        goal.category = goal.afterTime || goal.beforeTime ? "Budget" : goal.duration ? "Standard" : "Cluster";
      });
  }
  if (currentVersion < 18) {
    const hintsCollection = transaction.table("hintsCollection");
    hintsCollection.toCollection().modify((hint) => {
      hint.goalHints = [];
    });
  }
  if (currentVersion < 19) {
    console.log("processing updates for 19th version");
    transaction
      .table("sharedWMCollection")
      .toCollection()
      .modify((goal: GoalItem) => {
        goal.category = goal.afterTime || goal.beforeTime ? "Budget" : goal.duration ? "Standard" : "Cluster";
      });
    transaction
      .table("goalsCollection")
      .toCollection()
      .modify((goal: GoalItem) => {
        goal.category = goal.afterTime || goal.beforeTime ? "Budget" : goal.duration ? "Standard" : "Cluster";
      });
    transaction
      .table("goalTrashCollection")
      .toCollection()
      .modify((goal: GoalItem) => {
        goal.category = goal.afterTime || goal.beforeTime ? "Budget" : goal.duration ? "Standard" : "Cluster";
      });
  }
  if (currentVersion < 20) {
    console.log("processing updates for 20th version");
    const hintsCollection = transaction.table("hintsCollection");
    hintsCollection.toCollection().modify((hint: HintItem) => {
      hint.nextCheckDate = new Date().toISOString();
      hint.lastCheckedDate = new Date().toISOString();
    });
  }
  if (currentVersion < 21) {
    console.log("processing updates for 20th version");
    const taskCollection = transaction.table("taskCollection");
    taskCollection.toCollection().modify((task) => {
      task.completedTodayTimings = [];
    });
  }
  if (currentVersion < 22) {
    console.log("processing updates for 22th version");
    const taskCollection = transaction.table("taskCollection");
    taskCollection.toCollection().modify((task) => {
      delete task.completedTodayTimings;
    });
  }
  if (currentVersion < 23) {
    console.log("processing updates for 23th version");
    const taskCollection = transaction.table("taskCollection");
    taskCollection.toCollection().modify((task) => {
      delete task.completedTodayIds;
      delete task.completedToday;
      delete task.lastCompleted;
      delete task.lastSkipped;
      delete task.hoursSpent;
      delete task.skippedToday;
    });
  }
  if (currentVersion < 24) {
    console.log("processing updates for 24th version");
    const taskHistoryCollection = transaction.table("taskHistoryCollection");
    taskHistoryCollection.toCollection().modify((taskHistory) => {
      delete taskHistory.taskId;
    });
  }
  if (currentVersion < 25) {
    console.log("processing updates for 25th version");
    const goalsCollection = transaction.table("goalsCollection");
    goalsCollection.toCollection().modify((goal) => {
      if (goal.rootGoalId !== undefined) {
        goal.notificationGoalId = goal.rootGoalId;
        delete goal.rootGoalId;
      }
    });

    const sharedWMCollection = transaction.table("sharedWMCollection");
    sharedWMCollection.toCollection().modify((goal) => {
      if (goal.rootGoalId !== undefined) {
        goal.notificationGoalId = goal.rootGoalId;
        delete goal.rootGoalId;
      }
    });

    const goalTrashCollection = transaction.table("goalTrashCollection");
    goalTrashCollection.toCollection().modify((goal) => {
      if (goal.rootGoalId !== undefined) {
        goal.notificationGoalId = goal.rootGoalId;
        delete goal.rootGoalId;
      }
    });
  }
};
