'use strict'

$("#myModal").on("keyup", "#inputCommand", function (e) {
    if (e.which === 13) {
        if ($(this).val().length == 0) return;

        addSomething($(this).val())
        $("#myModal").modal('hide')
    }

    let goalId = $("#myModal").data("idx")
    let getSuggestions = {
        action: "read",
        command: "getSuggestions",
        input: $("#inputCommand").val(),
        goalId: goalId
    }
    // send(JSON.stringify(getSuggestions))

    let inputCommand = $("#inputCommand").data('inputCommand')
    inputCommand.title = $("#inputCommand").val()
    $("#inputCommand").data('inputCommand', inputCommand)
    updateModalAddUI()
});

function addSomething() {
    console.log("inside addSomething...")
    let title = $("#inputCommand").val()
    console.log("title:", title)
    let status = "maybe"
    let commands = [...$("#inputCommand").data('inputCommand').commands]
    let duration = 0

    let newGoalId = uuidv4()

    let tags = ["1"]
    let parent = goals.find({ id: parentId })[0]
    if (parent.label == "person") {
        let randomTag = Math.floor(Math.random() * 10) + 1
        tags = [randomTag.toString()]
    } else {
        tags = parent.tags
    }

    let newGoal = {
        id: newGoalId,
        title: title,
        parentId: parentId,
        status: status,
        start: (new Date()).toISOString(),
        duration: duration,
        commands: commands,
        tags: tags,
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

    $("#inputCommand").val("")
    let ellipse = ""
    if (title.length > 8) {
        ellipse = "..."
    }

    updateUIChildrenFor(parentId)

    $("#inputCommand").attr("placeholder", "Added " + title.substr(0, 8) + ellipse + "! Something else?")
    $("#inputCommand").focus()
}

$("#myModal").on("click", "#modal-add-a-goal-button", function () {
    addSomething()
    $("#myModal").modal('hide')
})

$("#myModal").on("paste", "#inputCommand", function (e) {
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
    let title = $("#inputCommand").val()
    console.log("saving ", title)
    let idToSave = $("#myModal").data('idx')
    console.log("idx:", idToSave)
    let commands = [...$("#inputCommand").data('inputCommand').commands].join(',')
    if (idToSave != undefined) {
        let goal = goals.find({ id: idToSave })[0]
        if (goal.label == "goal") {
            goal.title = title
            goal.commands = commands
            goals.update(goal)

            $("#inputCommand").val("")
            let ellipse = ""
            if (title.length > 8) {
                ellipse = "..."
            }
            $("#inputCommand").attr("placeholder", "Added " + title.substr(0, 8) + ellipse + "! Something else?")
            $("#inputCommand").focus()
        } else {
            $("#inputCommand").attr("placeholder", "Can only edit your own goals. Something else?")
            $("#inputCommand").focus()
        }
    }
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
    let inputCommand = $("#inputCommand").data('inputCommand')
    inputCommand.wordPressed = [e.currentTarget.innerText]
    $("#inputCommand").data('inputCommand', inputCommand)
    updateModalUI()
})

$("#myModal").on("click", ".selected-command", function (e) {
    console.log("handling selected-command pressed")
    let inputCommand = $("#inputCommand").data('inputCommand')
    inputCommand.commands.delete(e.currentTarget.innerText)
    $("#inputCommand").data('inputCommand', inputCommand)
    updateModalUI()
})