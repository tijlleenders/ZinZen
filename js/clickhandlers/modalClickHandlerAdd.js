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

    let newGoalId = uuidV4()

    let newGoal = {
        id: newGoalId,
        title: title,
        parentId: parentId,
        status: status,
        start: (new Date()).toISOString(),
        duration: duration,
        commands: commands
    }
    goals.insert(newGoal)

    let newRelationship = {
        id: uuidV4(),
        parent: parentId,
        child: newGoalId
    }
    relationships.insert(newRelationship)

    $("#inputCommand").val("")
    let ellipse = ""
    if (title.length > 8) {
        ellipse = "..."
    }
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
        let props = lists.by('id', idToSave)
        props.title = [title]
        props.commands = commands

        // Todo: update direct parents locally - remote is NOT yet handled by commandHandler as part of delete transaction
        // properties.directParents.forEach(directParentId => {
        //     let directParent = lists.by('id', directParentId)
        //     if (directParent != undefined) {
        //       directParent.directChildren.push(id)
        //       lists.update(directParent)
        //     }
        //   })

        lists.update(props)
        let upsertGoal = {
            action: "command",
            command: "upsertGoal",
            title: title,
            goalId: idToSave,
            commands: commands
        }
        send(JSON.stringify(upsertGoal))
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
    let deleteGoal = {
        action: "command",
        command: "deleteGoal",
        goalId: id
    }
    send(JSON.stringify(deleteGoal)) //remote remove

    // Todo: update direct parents locally - remote is handled by commandHandler as part of delete transaction
    // properties.directParents.forEach(directParentId => {
    //     let directParent = lists.by('id', directParentId)
    //     if (directParent != undefined) {
    //       directParent.directChildren.push(id)
    //       lists.update(directParent)
    //     }
    //   })

    let list = lists.by('id', id)
    if (list != undefined) {
        lists.remove(list) //local remove
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