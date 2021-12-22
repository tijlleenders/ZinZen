'use strict'

$("#myModal").on("keyup", "#inputGoal", function (e) {
    if (e.which === 13) {
        if ($(this).val().length == 0) return;
        saveGoal()
    }

    let goalId = $("#myModal").data("idx")
    let getSuggestions = {
        action: "read",
        command: "getSuggestions",
        input: $("#inputGoal").val(),
        goalId: goalId
    }
    // send(JSON.stringify(getSuggestions))

    let inputGoal = $("#inputGoal").data('inputGoal')
    inputGoal.title = $("#inputGoal").val()
    inputGoal.title = inputGoal.title.replace("  ", " ")
    $("#inputGoal").data('inputGoal', inputGoal)
    let newInputGoal = parseInputGoal(inputGoal)
    console.log("newInputGoal:", JSON.stringify(newInputGoal))
    $("#inputGoal").data('inputGoal', newInputGoal)
    updateModalAddUI(newInputGoal)
});

$("#myModal").on("click", "#modal-add-a-goal-button", function () {
    saveGoal()
})

$("#myModal").on("click", "#modal-cancel-button", function () {
    $("#myModal").modal('hide')
})

$("#myModal").on("click", "#add-subgoal-button", function () {
    parentId = $("#inputGoal").data('inputGoal').id
    openModal("", "add")
})

$("#myModal").on("paste", "#inputGoal", function (e) {
    var pastedData = e.originalEvent.clipboardData.getData('text');
    console.log("pastedData:", pastedData)
});

function saveGoal() {
    console.log("Inside saveGoal()...")
    let inputGoal = $("#inputGoal").data('inputGoal')
    let goalToSave = goals.find({ "id": inputGoal.id })
    console.log("List of existing goals with that id:"), goalToSave
    if (goalToSave.length == 0) {
        console.log("Inserting...")
        goalToSave = inputGoal
        goalToSave.label = "goal"
        delete goalToSave.$loki
        delete goalToSave.meta
        delete goalToSave.suggestedCommands
        delete goalToSave.suggestedWords

        goals.insert(goalToSave)
        let relationshipToSave = {
            parentId: parentId,
            childId: goalToSave.id,
            priority: 0
        }
        relationships.insert(relationshipToSave)
        $("#main-promised").empty()
        updateUIChildrenFor(parentId)
        updatePriority()

    } else {
        console.log("Updating...")
        goalToSave = inputGoal
        delete goalToSave.suggestedCommands
        delete goalToSave.suggestedWords
        delete goalToSave.recalculateCalendar

        if (goalToSave.label == "goal" && goalToSave.owner != "ZinZen") {
            goals.update(goalToSave)
        } else {
            $("#inputGoal").attr("placeholder", "Can only edit your own goals. Something else?")
            $("#inputGoal").focus()
        }
        $("#main-promised").empty()
        updateUIChildrenFor(parentId)
        //Todo: after upserting goal, remove + re-insert all relations to reflect any possible updates
    }

    tasks.clear() //Copy all since removing collection and then renaming the other one doesn't work
    tempTasks.data.forEach(task => {
        delete task.$loki
        delete task.meta
        tasks.insert(JSON.parse(JSON.stringify(task)))
    })
    taskRelations.clear() //Copy all since removing collection and then renaming the other one doesn't work
    tempTaskRelations.data.forEach(taskRelation => {
        delete taskRelation.$loki
        delete taskRelation.meta
        taskRelations.insert(JSON.parse(JSON.stringify(taskRelation)))
    })
    slots.clear()
    calendar.slots.forEach(slot => {
        slots.insert(slot)
    })
    goTo(parentId)
    $("#myModal").modal('hide')
}

$("#myModal").on("click", "#save-a-goal-button", function () {
    saveGoal()
})

function getAllDescendantsFor(id) {
    let descendants = []
    descendants[0] = []
    descendants[0].push(id)
    for (let level = 0; level < MAX_LEVELS; level++) {
        descendants[level + 1] = []
        descendants[level].forEach(id => {
            let subList = relationships.find({ parentId: id })
            if (subList != undefined) {
                subList.forEach(result => {
                    descendants[level + 1].push(result.childId)
                })
            }
        })
    }
    console.log("descendants:", descendants)
    let result = []
    for (let level = 0; level < MAX_LEVELS; level++) {
        result = result.concat(descendants[level])
    }
    console.log("result:", result)
    return result
}

function deleteIfOrphaned(idList) {
    console.log("inside deleteIfOrphaned(idList)")
    console.log("idList:", idList)
    idList.forEach(id => {
        let parentsFound = relationships.find({ childId: id })
        if (parentsFound.length == 0) {
            console.log("deleting id:", id)
            goals.findAndRemove({ id: id })
        }
    })
}

function deleteGoalAndExclusiveDescendants(id) {
    let goal = goals.find({ id: id })[0]
    if (goal != undefined) {
        //Todo: need transaction to remove all sub-goals
        let descendantIds = getAllDescendantsFor(id)
        descendantIds.forEach(id => {
            relationships.findAndRemove({ parentId: id })
        })
        deleteIfOrphaned(descendantIds)
        goals.findAndRemove({ id: id })
        relationships.findAndRemove({ childId: id })
    } else {
        console.error("Goal to delete not found for id:", id)
        return
    }
    $("#myModal").modal('hide')
    $("#" + id).removeClass('jello-vertical-animation') //if any
    $("#" + id).addClass('swirl-out-bck-animation')
    $("#" + id).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
        $("#" + id).remove();
        updateUIChildrenFor(parentId)
    });
}

$("#myModal").on("click", ".command-suggestion", function (e) {
    console.log("handling command-suggestion pressed")
    handleCommandPressed(e.currentTarget.innerText) //updateModalUI doesn't know if calendar should recalculate so done in command add/delete function
    updateModalAddUI($("#inputGoal").data('inputGoal'))
})

$("#myModal").on("click", ".word-suggestion", function (e) {
    console.log("handling word-suggestion pressed")
    let inputGoal = $("#inputGoal").data('inputGoal')
    inputGoal.wordPressed = [e.currentTarget.innerText]
    $("#inputGoal").data('inputGoal', inputGoal)
    updateModalUI()
})

$("#myModal").on("click", ".selected-command", function (e) {
    console.log("handling selected-command pressed")
    let inputGoal = $("#inputGoal").data('inputGoal')
    let command = e.currentTarget.innerText.split(" ")[0]
    switch (command) {
        case "at":
            delete inputGoal.at
            inputGoal.recalculateCalendar = true
            break;
        case "duration":
            delete inputGoal.durationString
            inputGoal.recalculateCalendar = true
            break;
        case "start":
            delete inputGoal.startStringsArray
            inputGoal.recalculateCalendar = true
            break;
        case "finish":
            delete inputGoal.finishStringsArray
            inputGoal.recalculateCalendar = true
            break;
        case "repeat":
            delete inputGoal.repeatString
            inputGoal.recalculateCalendar = true
            break;
        default:
            console.error("no handler for command:", command)
    }

    $("#inputGoal").data('inputGoal', inputGoal)
    updateModalUI()

})