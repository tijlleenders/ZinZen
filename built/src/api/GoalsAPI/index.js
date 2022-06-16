"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateGoal = exports.getGoalsOnDate = exports.getAllGoals = exports.removeGoal = exports.addGoal = exports.resetDatabase = void 0;
const _models_1 = require("@models");
const utils_1 = require("@src/utils");
const resetDatabase = () => _models_1.db.transaction("rw", _models_1.db.goalsCollection, async () => {
    await Promise.all(_models_1.db.tables.map((table) => table.clear()));
});
exports.resetDatabase = resetDatabase;
const addGoal = (goalDetails) => {
    const currentDate = (0, utils_1.getJustDate)(new Date());
    const goals = { ...goalDetails, createdAt: currentDate };
    _models_1.db.transaction("rw", _models_1.db.goalsCollection, async () => {
        await _models_1.db.goalsCollection.add(goals);
    }).catch((e) => {
        console.log(e.stack || e);
    });
};
exports.addGoal = addGoal;
const removeGoal = (goalId) => {
    _models_1.db.transaction("rw", _models_1.db.goalsCollection, async () => {
        await _models_1.db.goalsCollection.delete(goalId);
    }).catch((e) => {
        console.log(e.stack || e);
    });
};
exports.removeGoal = removeGoal;
const getAllGoals = async () => {
    const allGoals = await _models_1.db.goalsCollection.toArray();
    return allGoals;
};
exports.getAllGoals = getAllGoals;
const getGoalsOnDate = async (date) => {
    _models_1.db.transaction("rw", _models_1.db.goalsCollection, async () => {
        const goalsList = await _models_1.db.goalsCollection.where("start").equals(date);
        return goalsList;
    }).catch((e) => {
        console.log(e.stack || e);
    });
};
exports.getGoalsOnDate = getGoalsOnDate;
const updateGoal = async (id, changes) => {
    _models_1.db.transaction("rw", _models_1.db.goalsCollection, async () => {
        await _models_1.db.goalsCollection.update(id, changes).then((updated) => updated);
    }).catch((e) => {
        console.log(e.stack || e);
    });
};
exports.updateGoal = updateGoal;
