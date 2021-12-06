'use strict'

$("#myModal").on("keyup", "#inputGoal", function (e) {
    if (e.which === 13) {
        if ($(this).val().length == 0) return;

        addSomething($(this).val())
        $("#myModal").modal('hide')
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
    inputGoal.title[inputGoal.lang] = $("#inputGoal").val()
    inputGoal.title[inputGoal.lang] = inputGoal.title[inputGoal.lang].replace("  ", " ")
    $("#inputGoal").data('inputGoal', inputGoal)
    updateModalAddUI()
});

function addSomething() {
    console.log("inside addSomething...")
    let title = $("#inputGoal").val()
    console.log("title:", title)
    let status = "maybe"
    let commands = $("#inputGoal").data('inputGoal').commands
    let duration = 0

    let newGoalId = uuidv4()

    let colors = ["1"]
    let parent = goals.find({ id: parentId })[0]
    if (parent.label == "person") {
        let randomColor = Math.floor(Math.random() * 10) + 1
        colors = [randomColor.toString()]
    } else {
        colors = parent.colors
    }

    var titleObject = {}
    let lang = settings.find({ "setting": "language" })[0].value
    if (lang != undefined) {
        titleObject[lang] = title
    } else {
        throw ("can't find language setting")
    }

    let newGoal = {
        id: newGoalId,
        label: "goal",
        title: titleObject,
        parentId: parentId,
        status: status,
        start: (new Date()).toISOString(),
        duration: duration,
        commands: commands,
        colors: colors,
        priority: 1
    }

    let newRelationship = {
        parentId: parentId,
        childId: newGoalId
    }

    //store new state
    goals.insert(newGoal)
    relationships.insert(newRelationship)
    updatePriority()

    $("#inputGoal").val("")
    let ellipse = ""
    if (title.length > 8) {
        ellipse = "..."
    }

    updateUIChildrenFor(parentId)

    $("#inputGoal").attr("placeholder", "Added " + title.substr(0, 8) + ellipse + "! Something else?")
    $("#inputGoal").focus()
}

$("#myModal").on("click", "#modal-add-a-goal-button", function () {
    addSomething()
    $("#myModal").modal('hide')
})

$("#myModal").on("click", "#modal-cancel-button", function () {
    $("#myModal").modal('hide')
})

$("#myModal").on("paste", "#inputGoal", function (e) {
    var pastedData = e.originalEvent.clipboardData.getData('text');
    console.log("pastedData:", pastedData)
});

$("#myModal").on("click", "#delete-a-goal-button", function () {
    console.log("delete clicked")
    let idToDelete = $("#myModal").data('idx')
    console.log("idx:", idToDelete)
    deleteGoalAndExclusiveDescendants(idToDelete)
})

$("#myModal").on("click", "#save-a-goal-button", function () {
    let title = $("#inputGoal").val()
    console.log("saving ", title)
    let idToSave = $("#myModal").data('idx')
    console.log("idx:", idToSave)
    let goalToSave = $("#inputGoal").data('inputGoal')

    if (idToSave != "") {
        let goal = goals.find({ id: idToSave })[0]
        if (goal.label == "goal") {
            let lang = settings.find({ "setting": "language" })[0].value
            if (lang != undefined) {
                goal.title[lang] = title
            } else {
                console.log("different language than interface language set for title")
                console.log("using following language to save:", lang)
                goal.title[lang] = title
            }
            goals.update(goal)

        } else {
            $("#inputGoal").attr("placeholder", "Can only edit your own goals. Something else?")
            $("#inputGoal").focus()
        }
    } else {
        console.log("saving with new id")
        goalToSave.id = uuidv4()
        goals.insert(goalToSave)
        let relationshipToSave = {
            parentId: parentId,
            childId: goalToSave.id,
            priority: 0
        }
        relationships.insert(relationshipToSave)
    }

    updateUIChildrenFor(parentId)
    $("#myModal").modal('hide')
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
    });
}

$("#myModal").on("click", ".command-suggestion", function (e) {
    console.log("handling command-suggestion pressed")
    handleCommand(e.currentTarget.innerText)
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
        case "duration":
            delete inputGoal.durationString
            break;
        case "start":
            delete inputGoal.startStringsArray
            break;
        case "finish":
            delete inputGoal.finishStringsArray
            break;
        case "repeat":
            delete inputGoal.repeatString
            break;
        default:
            console.error("no handler for command:", command)
    }
    $("#inputGoal").data('inputGoal', inputGoal)
    updateModalUI()
})