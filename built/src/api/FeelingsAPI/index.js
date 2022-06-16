"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFeelingNote = exports.addFeelingNote = exports.addFeeling = exports.getFeelingsBetweenDates = exports.getFeelingsOnDate = exports.getAllFeelings = exports.removeFeeling = exports.resetDatabase = exports.getFeeling = void 0;
const _models_1 = require("@models");
const utils_1 = require("@src/utils");
const getFeeling = async (feelingId) => {
    _models_1.db.transaction("rw", _models_1.db.feelingsCollection, async () => {
        const feeling = await _models_1.db.feelingsCollection.get(feelingId);
        return feeling;
    }).catch((e) => {
        console.log(e.stack || e);
    });
};
exports.getFeeling = getFeeling;
const resetDatabase = () => _models_1.db.transaction("rw", _models_1.db.feelingsCollection, async () => {
    await Promise.all(_models_1.db.tables.map((table) => table.clear()));
});
exports.resetDatabase = resetDatabase;
const removeFeeling = (feelingId) => {
    _models_1.db.transaction("rw", _models_1.db.feelingsCollection, async () => {
        await _models_1.db.feelingsCollection.delete(feelingId);
    }).catch((e) => {
        console.log(e.stack || e);
    });
};
exports.removeFeeling = removeFeeling;
const getAllFeelings = async () => {
    const allFeelings = await _models_1.db.feelingsCollection.toArray();
    return allFeelings;
};
exports.getAllFeelings = getAllFeelings;
const getFeelingsOnDate = async (date) => {
    let feelingsList = [];
    await _models_1.db
        .transaction("rw", _models_1.db.feelingsCollection, async () => {
        feelingsList = await _models_1.db.feelingsCollection.where("date").equals(date).toArray();
    })
        .catch((e) => {
        console.log(e.stack || e);
    });
    return feelingsList;
};
exports.getFeelingsOnDate = getFeelingsOnDate;
const getFeelingsBetweenDates = async (startDate, endDate) => {
    _models_1.db.transaction("rw", _models_1.db.feelingsCollection, async () => {
        const feelingsList = await _models_1.db.feelingsCollection.where("date").between(startDate, endDate);
        return feelingsList;
    });
};
exports.getFeelingsBetweenDates = getFeelingsBetweenDates;
const addFeeling = async (feelingName, feelingCategory, feelingDate) => {
    // const currentDate = getJustDate(new Date());
    const feelingDateFormatted = (0, utils_1.getJustDate)(feelingDate);
    const currentDateFeelings = await (0, exports.getFeelingsOnDate)(feelingDate);
    const checkFeelings = (feeling) => feeling.content === feelingName;
    if (currentDateFeelings.some(checkFeelings)) {
        return;
    }
    _models_1.db.transaction("rw", _models_1.db.feelingsCollection, async () => {
        await _models_1.db.feelingsCollection.add({ content: feelingName, date: feelingDateFormatted, category: feelingCategory });
    }).catch((e) => {
        console.log(e.stack || e);
    });
};
exports.addFeeling = addFeeling;
const addFeelingNote = async (feelingId, InputNote) => {
    const feeling = await _models_1.db.feelingsCollection.get(feelingId);
    const updatedFeeling = { ...feeling, note: InputNote };
    let updatedFeelingsList;
    await _models_1.db
        .transaction("rw", _models_1.db.feelingsCollection, async () => {
        await _models_1.db.feelingsCollection.put(updatedFeeling);
        updatedFeelingsList = await (0, exports.getAllFeelings)();
    })
        .catch((e) => {
        console.log(e.stack || e);
    });
    return updatedFeelingsList;
};
exports.addFeelingNote = addFeelingNote;
const removeFeelingNote = async (feelingId) => {
    const feeling = await _models_1.db.feelingsCollection.get(feelingId);
    delete feeling?.note;
    let updatedFeelingsList;
    await _models_1.db
        .transaction("rw", _models_1.db.feelingsCollection, async () => {
        await _models_1.db.feelingsCollection.put(feeling);
        updatedFeelingsList = await (0, exports.getAllFeelings)();
    })
        .catch((e) => {
        console.log(e.stack || e);
    });
    return updatedFeelingsList;
};
exports.removeFeelingNote = removeFeelingNote;
