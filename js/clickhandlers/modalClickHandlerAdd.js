'use strict'

$("#myModal").on("keyup", "#inputCommand", function (e) {
    if (e.which === 13) {
        if ($(this).val().length == 0) return;

        addSomething($(this).val())

        $(this).removeAttr("disabled")
        $(this).val("").focus()
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

    let newGoal = {
        id: newGoalId,
        title: title,
        parentId: parentId,
        status: status,
        start: (new Date()).toISOString(),
        duration: duration,
        commands: commands,
        tags: ["1"]
    }
    goals.insert(newGoal)

    let newRelationship = {
        id: uudiv4(),
        parent: parentId,
        child: newGoalId
    }
    relationships.insert(newRelationship)

    $("#inputCommand").val("")
    let ellipse = ""
    if (title.length > 8) {
        ellipse = "..."
    }

    updateChildrenFor(parentId)

    $("#inputCommand").attr("placeholder", "Added " + title.substr(0, 8) + ellipse + "! Something else?")
    $("#inputCommand").focus()
}

$("#myModal").on("click", "#modal-add-a-goal-button", function () {
    addSomething()
})

$("#myModal").on("click", "#delete-a-goal-button", function () {
    console.log("delet clicked")
    let idToDelete = $("#myModal").data('idx')
    console.log("idx:", idToDelete)
    deleteGoal(idToDelete)
})

$("#myModal").on("click", "#save-a-goal-button", function () {
    let title = $("#inputCommand").val()
    console.log("saving ", title)
    let idToSave = $("#myModal").data('idx')
    console.log("idx:", idToSave)
    let commands = [[...$("#inputCommand").data('inputCommand').commands].join(',')]
    if (idToSave != undefined) {
        let props = goals.by('id', idToSave)
        props.title = [title]
        props.commands = commands
        goals.update(props)

        $("#inputCommand").val("")
        let ellipse = ""
        if (title.length > 8) {
            ellipse = "..."
        }
        $("#inputCommand").attr("placeholder", "Added " + title.substr(0, 8) + ellipse + "! Something else?")
        $("#inputCommand").focus()
    }
})

function deleteGoal(id) {
    let goal = goals.by('id', id)
    if (goal != undefined) {
        goals.remove(goal) //local remove
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