'use strict'

$("#myModal").on("click", "#quick-set-today-button", function() {
    console.log("Finish today clicked")
    let now = new dayjs()
    let endOfTodayISO = now.endOf('day').toISOString()
    var messageJson = {
        action: "command",
        command: "upsertGoal",
        goalId: $("#myModal").data("idx"),
        finish: endOfTodayISO
    }
    send(JSON.stringify(messageJson))
});

$("#myModal").on("click", "#quick-set-tomorrow-button", function() {
    console.log("Finish tomorrow clicked")
    let now = new dayjs()
    let endOfTomorrowISO = now.add(1, 'day').endOf('day').toISOString()
    var messageJson = {
        action: "command",
        command: "upsertGoal",
        goalId: $("#myModal").data("idx"),
        finish: endOfTomorrowISO
    }
    send(JSON.stringify(messageJson))
});

$("#myModal").on("click", "#quick-set-next-week-button", function() {
    console.log("Finish next week clicked")
    let now = new dayjs()
    let endOfNextWeekISO = now.add(1, 'week').endOf('week').toISOString()
    var messageJson = {
        action: "command",
        command: "upsertGoal",
        goalId: $("#myModal").data("idx"),
        finish: endOfNextWeekISO
    }
    send(JSON.stringify(messageJson))
});

$("#myModal").on("click", "#quick-set-next-month-button", function() {
    console.log("Finish next month clicked")
    let now = new dayjs()
    let endOfNextMonthISO = now.add(1, 'month').endOf('month').toISOString()
    var messageJson = {
        action: "command",
        command: "upsertGoal",
        goalId: $("#myModal").data("idx"),
        finish: endOfNextMonthISO
    }
    send(JSON.stringify(messageJson))
});

$("#myModal").on("click", "#quick-set-custom-button", function() {
    console.log("Finish custom clicked")
    let now = new dayjs()
    let endOfTodayISO = now.add(1, 'hour').toISOString()
    var messageJson = {
        action: "command",
        command: "upsertGoal",
        goalId: $("#myModal").data("idx"),
        finish: endOfTodayISO
    }
    send(JSON.stringify(messageJson))
});

$("#myModal").on("click", "#delete-schedule", function() {
    console.log("delete clicked")
    $("#modal-status").data("status", "deleted")
    updateStatusUI()
});

$("#myModal").on("click", "#done-schedule", function() {
    $("#modal-status").data("status", "done")
    updateStatusUI()
});

$("#myModal").on("click", "#promised-schedule", function() {
    console.log("promised-schedule clicked")
    $("#modal-status").data("status", "promised")
    updateStatusUI()
});

$("#myModal").on("click", "#maybe-schedule", function() {
    console.log("maybe-schedule clicked")
    $("#modal-status").data("status", "maybe")
    updateStatusUI()
});

$("#myModal").on("click", "#add-week-button", function() {
    var duration = parseInt($("#modal-duration").data("duration"), 10)
    duration += 3600 * 24 * 7
    $("#modal-duration").data("duration", duration)
    updateDurationUI()
        //Todo: batch all add/remove clicks in a single function
    let goalId = $("#myModal").data("idx")
    let upsertGoal = {
        action: "command",
        command: "upsertGoal",
        goalId: goalId,
        duration: duration
    }
    send(JSON.stringify(upsertGoal))
})

$("#myModal").on("click", "#add-day-button", function() {
    var duration = parseInt($("#modal-duration").data("duration"), 10)
    duration += 3600 * 24
    $("#modal-duration").data("duration", duration)
    updateDurationUI()
        //Todo: batch all add/remove clicks in a single function
    let goalId = $("#myModal").data("idx")
    let upsertGoal = {
        action: "command",
        command: "upsertGoal",
        goalId: goalId,
        duration: duration
    }
    send(JSON.stringify(upsertGoal))
})

$("#myModal").on("click", "#add-hour-button", function() {
    var duration = parseInt($("#modal-duration").data("duration"), 10)
    duration += 3600
    $("#modal-duration").data("duration", duration)
    updateDurationUI()
        //Todo: batch all add/remove clicks in a single function
    let goalId = $("#myModal").data("idx")
    let upsertGoal = {
        action: "command",
        command: "upsertGoal",
        goalId: goalId,
        duration: duration
    }
    send(JSON.stringify(upsertGoal))
})

$("#myModal").on("click", "#add-minute-button", function() {
    var duration = parseInt($("#modal-duration").data("duration"), 10)
    duration += 60
    $("#modal-duration").data("duration", duration)
    updateDurationUI()
        //Todo: batch all add/remove clicks in a single function
    let goalId = $("#myModal").data("idx")
    let upsertGoal = {
        action: "command",
        command: "upsertGoal",
        goalId: goalId,
        duration: duration
    }
    send(JSON.stringify(upsertGoal))
})

$("#myModal").on("click", "#add-second-button", function() {
    var duration = parseInt($("#modal-duration").data("duration"), 10)
    duration += 1
    $("#modal-duration").data("duration", duration)
    updateDurationUI()
        //Todo: batch all add/remove clicks in a single function
    let goalId = $("#myModal").data("idx")
    let upsertGoal = {
        action: "command",
        command: "upsertGoal",
        goalId: goalId,
        duration: duration
    }
    send(JSON.stringify(upsertGoal))
})

$("#myModal").on("click", "#remove-week-button", function() {
    var duration = parseInt($("#modal-duration").data("duration"), 10)
    duration -= 3600 * 24 * 7
    if (duration < 0) {
        duration = 0
    }
    $("#modal-duration").data("duration", duration)
    updateDurationUI()
        //Todo: batch all add/remove clicks in a single function
    let goalId = $("#myModal").data("idx")
    let upsertGoal = {
        action: "command",
        command: "upsertGoal",
        goalId: goalId,
        duration: duration
    }
    send(JSON.stringify(upsertGoal))
})

$("#myModal").on("click", "#remove-day-button", function() {
    var duration = parseInt($("#modal-duration").data("duration"), 10)
    duration -= 3600 * 24
    if (duration < 0) {
        duration = 0
    }
    $("#modal-duration").data("duration", duration)
    updateDurationUI()
        //Todo: batch all add/remove clicks in a single function
    let goalId = $("#myModal").data("idx")
    let upsertGoal = {
        action: "command",
        command: "upsertGoal",
        goalId: goalId,
        duration: duration
    }
    send(JSON.stringify(upsertGoal))
})

$("#myModal").on("click", "#remove-hour-button", function() {
    var duration = parseInt($("#modal-duration").data("duration"), 10)
    duration -= 3600
    if (duration < 0) {
        duration = 0
    }
    $("#modal-duration").data("duration", duration)
    updateDurationUI()
        //Todo: batch all add/remove clicks in a single function
    let goalId = $("#myModal").data("idx")
    let upsertGoal = {
        action: "command",
        command: "upsertGoal",
        goalId: goalId,
        duration: duration
    }
    send(JSON.stringify(upsertGoal))
})

$("#myModal").on("click", "#remove-minute-button", function() {
    var duration = parseInt($("#modal-duration").data("duration"), 10)
    duration -= 60
    if (duration < 0) {
        duration = 0
    }
    $("#modal-duration").data("duration", duration)
    updateDurationUI()
        //Todo: batch all add/remove clicks in a single function
    let goalId = $("#myModal").data("idx")
    let upsertGoal = {
        action: "command",
        command: "upsertGoal",
        goalId: goalId,
        duration: duration
    }
    send(JSON.stringify(upsertGoal))
})

$("#myModal").on("click", "#remove-second-button", function() {
    var duration = parseInt($("#modal-duration").data("duration"), 10)
    duration -= 1
    if (duration < 0) {
        duration = 0
    }
    $("#modal-duration").data("duration", duration)
    updateDurationUI()
        //Todo: batch all add/remove clicks in a single function
    let goalId = $("#myModal").data("idx")
    let upsertGoal = {
        action: "command",
        command: "upsertGoal",
        goalId: goalId,
        duration: duration
    }
    send(JSON.stringify(upsertGoal))
})

$("#myModal").on("click", ".daytimeDay", function(e) {
    let timesOfDaysPrefArray = $("#modal-timesOfDaysPref").data("timesOfDaysPrefArray")
    let dayOffset = e.currentTarget.id.split("-")[1]
    console.log("timesOfDaysPrefArray:", timesOfDaysPrefArray)
    console.log("dayOffset:", dayOffset)
    dayOffset = parseInt(dayOffset, 10)
    if (
        timesOfDaysPrefArray[1 + dayOffset] == 1 &&
        timesOfDaysPrefArray[2 + dayOffset] == 1 &&
        timesOfDaysPrefArray[3 + dayOffset] == 1
    ) {
        timesOfDaysPrefArray[0 + dayOffset] = 0
        timesOfDaysPrefArray[1 + dayOffset] = 0
        timesOfDaysPrefArray[2 + dayOffset] = 0
        timesOfDaysPrefArray[3 + dayOffset] = 0
    } else {
        timesOfDaysPrefArray[0 + dayOffset] = 0
        timesOfDaysPrefArray[1 + dayOffset] = 1
        timesOfDaysPrefArray[2 + dayOffset] = 1
        timesOfDaysPrefArray[3 + dayOffset] = 1
    }
    $("#modal-timesOfDaysPref").data("timesOfDaysPrefArray", timesOfDaysPrefArray)
    updatetimesOfDaysPrefUI()
    sendTimesOfDaysPrefUpdate()
})

$("#myModal").on("click", ".daytimeTimeOfDay", function(e) {
    let timesOfDaysPrefArray = $("#modal-timesOfDaysPref").data("timesOfDaysPrefArray")
    let timeOfDayOffset = e.currentTarget.id.split("-")[1]
    console.log("timesOfDaysPrefArray in click:", timesOfDaysPrefArray)
    console.log("timeOfDayOffset:", timeOfDayOffset)
    timeOfDayOffset = parseInt(timeOfDayOffset, 10)
    if (
        timesOfDaysPrefArray[0 + timeOfDayOffset] == 1 &&
        timesOfDaysPrefArray[4 + timeOfDayOffset] == 1 &&
        timesOfDaysPrefArray[8 + timeOfDayOffset] == 1 &&
        timesOfDaysPrefArray[12 + timeOfDayOffset] == 1 &&
        timesOfDaysPrefArray[16 + timeOfDayOffset] == 1 &&
        timesOfDaysPrefArray[20 + timeOfDayOffset] == 1 &&
        timesOfDaysPrefArray[24 + timeOfDayOffset] == 1
    ) {
        timesOfDaysPrefArray[0 + timeOfDayOffset] = 0
        timesOfDaysPrefArray[4 + timeOfDayOffset] = 0
        timesOfDaysPrefArray[8 + timeOfDayOffset] = 0
        timesOfDaysPrefArray[12 + timeOfDayOffset] = 0
        timesOfDaysPrefArray[16 + timeOfDayOffset] = 0
        timesOfDaysPrefArray[20 + timeOfDayOffset] = 0
        timesOfDaysPrefArray[24 + timeOfDayOffset] = 0
    } else {
        timesOfDaysPrefArray[0 + timeOfDayOffset] = 1
        timesOfDaysPrefArray[4 + timeOfDayOffset] = 1
        timesOfDaysPrefArray[8 + timeOfDayOffset] = 1
        timesOfDaysPrefArray[12 + timeOfDayOffset] = 1
        timesOfDaysPrefArray[16 + timeOfDayOffset] = 1
        timesOfDaysPrefArray[20 + timeOfDayOffset] = 1
        timesOfDaysPrefArray[24 + timeOfDayOffset] = 1
    }
    $("#modal-timesOfDaysPref").data("timesOfDaysPrefArray", timesOfDaysPrefArray)
    updatetimesOfDaysPrefUI()
    sendTimesOfDaysPrefUpdate()
})

$("#myModal").on("click", ".daytime", function(e) {
    let daytimeIndex = e.currentTarget.id.split("-")[1]
    console.log("daytimeIndex:", daytimeIndex)
    let timesOfDaysPrefArray = $("#modal-timesOfDaysPref").data("timesOfDaysPrefArray")
    timesOfDaysPrefArray[daytimeIndex] == 0 ? timesOfDaysPrefArray[daytimeIndex] = 1 : timesOfDaysPrefArray[daytimeIndex] = 0
    $("#modal-timesOfDaysPref").data("timesOfDaysPrefArray", timesOfDaysPrefArray)
    updatetimesOfDaysPrefUI()
    sendTimesOfDaysPrefUpdate()
})

$("#myModal").on("click", "#add-min-per-slot-button-area", function(e) { //Todo: Fringe case: minPerSlot should move minPerWeek up if minPerWeek * 24h < minPerSlot
    console.log("clicked:", e.currentTarget.id)
    let minPerSlot = $("#modal-budget-per-slot").data("minSize")
    minPerSlot += 15 * 60
    let maxPerSlot = $("#modal-budget-per-slot").data("maxSize")
    if (maxPerSlot < minPerSlot) {
        maxPerSlot = minPerSlot
        $("#modal-budget-per-slot").data("maxSize", maxPerSlot)
    }
    $("#modal-budget-per-slot").data("minSize", minPerSlot)
    updateTimePerSlotUI()
    sendScheduleRequest()
})

$("#myModal").on("click", "#remove-min-per-slot-button-area", function(e) {
    console.log("clicked:", e.currentTarget.id)
    let minPerSlot = $("#modal-budget-per-slot").data("minSize")
    minPerSlot -= 15 * 60
    let maxPerSlot = $("#modal-budget-per-slot").data("maxSize")
    if (minPerSlot < 0) {
        minPerSlot = 0
    }
    $("#modal-budget-per-slot").data("minSize", minPerSlot)
    updateTimePerSlotUI()
    sendScheduleRequest()
})

$("#myModal").on("click", "#add-max-per-slot-button-area", function(e) { //Todo: Fringe case: maxPerSlot should move maxPerDay down to 1 if maxPerSlot > 24h
    console.log("clicked:", e.currentTarget.id)
    let maxPerSlot = $("#modal-budget-per-slot").data("maxSize")
    maxPerSlot += 15 * 60
    let minPerSlot = $("#modal-budget-per-slot").data("minSize")
    $("#modal-budget-per-slot").data("maxSize", maxPerSlot)
    updateTimePerSlotUI()
    sendScheduleRequest()
})

$("#myModal").on("click", "#remove-max-per-slot-button-area", function(e) {
    console.log("clicked:", e.currentTarget.id)
    let maxPerSlot = $("#modal-budget-per-slot").data("maxSize")
    maxPerSlot -= 15 * 60
    let minPerSlot = $("#modal-budget-per-slot").data("minSize")
    if (maxPerSlot < 15 * 60) {
        maxPerSlot = 15 * 60
    }
    if (maxPerSlot < minPerSlot) {
        minPerSlot = maxPerSlot
    }
    $("#modal-budget-per-slot").data("minSize", minPerSlot)
    $("#modal-budget-per-slot").data("maxSize", maxPerSlot)
    updateTimePerSlotUI()
    sendScheduleRequest()
})

$("#myModal").on("click", "#add-min-per-day-button-area", function(e) { //Todo: Fringe case: minPerSlot should move minPerWeek up if minPerWeek * 24h < minPerSlot
    console.log("clicked:", e.currentTarget.id)
    let minTimesPerDay = $("#modal-budget-per-day").data("minTimesPerDay")
    minTimesPerDay += 1
    let maxTimesPerDay = $("#modal-budget-per-day").data("maxTimesPerDay")
    if (maxTimesPerDay < minTimesPerDay) {
        maxTimesPerDay = minTimesPerDay
        $("#modal-budget-per-day").data("maxTimesPerDay", maxTimesPerDay)
    }
    $("#modal-budget-per-day").data("minTimesPerDay", minTimesPerDay)
    updateTimePerDayUI()
    sendScheduleRequest()
})

$("#myModal").on("click", "#remove-min-per-day-button-area", function(e) {
    console.log("clicked:", e.currentTarget.id)
    let minTimesPerDay = $("#modal-budget-per-day").data("minTimesPerDay")
    minTimesPerDay -= 1
    if (minTimesPerDay < 0) {
        minTimesPerDay = 0
    }
    $("#modal-budget-per-day").data("minTimesPerDay", minTimesPerDay)
    updateTimePerDayUI()
    sendScheduleRequest()
})

$("#myModal").on("click", "#add-max-per-day-button-area", function(e) { //Todo: Fringe case: maxTimesPerDay should move maxPerDay down to 1 if maxTimesPerDay > 24h
    console.log("clicked:", e.currentTarget.id)
    let maxTimesPerDay = $("#modal-budget-per-day").data("maxTimesPerDay")
    maxTimesPerDay += 1
    $("#modal-budget-per-day").data("maxTimesPerDay", maxTimesPerDay)
    updateTimePerDayUI()
    sendScheduleRequest()
})

$("#myModal").on("click", "#remove-max-per-day-button-area", function(e) {
    console.log("clicked:", e.currentTarget.id)
    let maxTimesPerDay = $("#modal-budget-per-day").data("maxTimesPerDay")
    maxTimesPerDay -= 1
    let minTimesPerDay = $("#modal-budget-per-day").data("minTimesPerDay")
    if (maxTimesPerDay < 1) {
        maxTimesPerDay = 1
    }
    if (maxTimesPerDay < minTimesPerDay) {
        minTimesPerDay = maxTimesPerDay
    }
    $("#modal-budget-per-day").data("minTimesPerDay", minTimesPerDay)
    $("#modal-budget-per-day").data("maxTimesPerDay", maxTimesPerDay)
    updateTimePerDayUI()
    sendScheduleRequest()
})

$("#myModal").on("click", "#add-min-per-week-button-area", function(e) {
    console.log("clicked:", e.currentTarget.id)
    let minTimesPerWeek = $("#modal-budget-per-week").data("minTimesPerWeek")
    minTimesPerWeek += 1
    let maxTimesPerWeek = $("#modal-budget-per-week").data("maxTimesPerWeek")
    if (maxTimesPerWeek < minTimesPerWeek) {
        maxTimesPerWeek = minTimesPerWeek
        $("#modal-budget-per-week").data("maxTimesPerWeek", maxTimesPerWeek)
    }
    $("#modal-budget-per-week").data("minTimesPerWeek", minTimesPerWeek)
    updateTimePerWeekUI()
    sendScheduleRequest()
})

$("#myModal").on("click", "#remove-min-per-week-button-area", function(e) {
    console.log("clicked:", e.currentTarget.id)
    let minTimesPerWeek = $("#modal-budget-per-week").data("minTimesPerWeek")
    minTimesPerWeek -= 1
    if (minTimesPerWeek < 0) {
        minTimesPerWeek = 0
    }
    $("#modal-budget-per-week").data("minTimesPerWeek", minTimesPerWeek)
    updateTimePerWeekUI()
    sendScheduleRequest()
})

$("#myModal").on("click", "#add-max-per-week-button-area", function(e) { //Todo: Fringe case: maxTimesPerWeek should move maxPerDay down to 1 if maxTimesPerWeek > 24h
    console.log("clicked:", e.currentTarget.id)
    let maxTimesPerWeek = $("#modal-budget-per-week").data("maxTimesPerWeek")
    maxTimesPerWeek += 1
    $("#modal-budget-per-week").data("maxTimesPerWeek", maxTimesPerWeek)
    updateTimePerWeekUI()
    sendScheduleRequest()
})

$("#myModal").on("click", "#remove-max-per-week-button-area", function(e) {
    console.log("clicked:", e.currentTarget.id)
    let maxTimesPerWeek = $("#modal-budget-per-week").data("maxTimesPerWeek")
    maxTimesPerWeek -= 1
    let minTimesPerWeek = $("#modal-budget-per-week").data("minTimesPerWeek")
    if (maxTimesPerWeek < 1) {
        maxTimesPerWeek = 1
    }
    if (maxTimesPerWeek < minTimesPerWeek) {
        minTimesPerWeek = maxTimesPerWeek
    }
    $("#modal-budget-per-week").data("minTimesPerWeek", minTimesPerWeek)
    $("#modal-budget-per-week").data("maxTimesPerWeek", maxTimesPerWeek)
    updateTimePerWeekUI()
    sendScheduleRequest()
})