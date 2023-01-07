import { TaskFilter } from "./TaskFilter";

const t0 = {
  taskid: "0",
  goalid: "1",
  title: "dentist",
  duration: 1,
  start: "2023-01-05T10:00:00",
  deadline: "2023-01-05T11:00:00",
  goalColor: "blue",
  parentGoalId: "1",
};

const t1 = {
  taskid: "1",
  goalid: "2",
  title: "shopping",
  duration: 1,
  start: "2023-01-06T10:00:00",
  deadline: "2023-01-06T11:00:00",
  goalColor: "blue",
  parentGoalId: "2",
};

const t2 = {
  taskid: "2",
  goalid: "3",
  title: "exercise",
  duration: 1,
  start: "2023-01-07T10:00:00",
  deadline: "2023-01-07T11:00:00",
  goalColor: "blue",
  parentGoalId: "3",
};

const t3 = {
  taskid: "3",
  goalid: "4",
  title: "gym",
  duration: 1,
  start: "2023-01-08T10:00:00",
  deadline: "2023-01-08T11:00:00",
  goalColor: "blue",
  parentGoalId: "4",
};

const t4 = {
  taskid: "4",
  goalid: "5",
  title: "water plants",
  duration: 1,
  start: "2023-01-09T10:00:00",
  deadline: "2023-01-09T11:00:00",
  goalColor: "blue",
  parentGoalId: "5",
};

const t5 = {
  taskid: "5",
  goalid: "6",
  title: "read",
  duration: 1,
  start: "2023-01-10T10:00:00",
  deadline: "2023-01-10T11:00:00",
  goalColor: "blue",
  parentGoalId: "5",
};

const t6 = {
  taskid: "6",
  goalid: "7",
  title: "swim",
  duration: 1,
  start: "2023-01-11T10:00:00",
  deadline: "2023-01-11T11:00:00",
  goalColor: "blue",
  parentGoalId: "6",
};

const t7 = {
  taskid: "7",
  goalid: "8",
  title: "cook",
  duration: 1,
  start: "2023-01-11T10:00:00",
  deadline: "2023-01-11T11:00:00",
  goalColor: "blue",
  parentGoalId: "7",
};

const t8 = {
  taskid: "7",
  goalid: "8",
  title: "write book",
  duration: 1,
  start: "2023-01-11T10:00:00",
  deadline: "2023-01-11T11:00:00",
  goalColor: "blue",
  parentGoalId: "8",
};

const myTasks = [t0, t1, t2, t3, t4, t5, t6, t7, t8];

describe("TaskFilter", () => {
  test("filters today tasks", () => {
    expect(TaskFilter(myTasks, 0)).toEqual([t0]);
  });

  test("filters one day from today tasks", () => {
    expect(TaskFilter(myTasks, 1)).toEqual([t1]);
  });

  test("filters two days from today tasks", () => {
    expect(TaskFilter(myTasks, 2)).toEqual([t2]);
  });

  test("filters three days from today tasks", () => {
    expect(TaskFilter(myTasks, 3)).toEqual([t3]);
  });

  test("filters four days from today tasks", () => {
    expect(TaskFilter(myTasks, 4)).toEqual([t4]);
  });

  test("filters five days from today tasks", () => {
    expect(TaskFilter(myTasks, 5)).toEqual([t5]);
  });

  test("filters six days from today tasks", () => {
    expect(TaskFilter(myTasks, 6)).toEqual([t6, t7, t8]);
  });

});
