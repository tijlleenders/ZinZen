'use strict'

$("#myModal").on("keyup", "#inputCommand", function(e) {
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
    let title = $("#inputCommand").val()
    let status = "maybe"

    let duration = $("#duration-buttons").data("defaultDuration")
    if (duration == undefined) {
        duration = 0
    }

    let upsertGoal = {
        action: "command",
        command: "upsertGoal",
        title: title,
        parentId: parentId,
        status: status,
        start: (new Date()).toISOString(),
        duration: duration
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

$("#myModal").on("click", "#add-a-goal-button", function() {
    addSomething()
})

$("#myModal").on("click", "#save-a-goal-button", function() {
    let title = $("#inputCommand").val()
    console.log("saving ", title)
    let idToSave = $("#myModal").data('idx')
    console.log("idx:", idToSave)
    if (idToSave != undefined) {
        let props = lists.by('id', idToSave)
        props.title = [title]
        lists.update(props)
        let upsertGoal = {
            action: "command",
            command: "upsertGoal",
            title: title
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

$("#myModal").on("click", ".command-suggestion", function(e) {
    console.log("handling command-suggestion pressed")
    let inputCommand = $("#inputCommand").data('inputCommand')
    inputCommand.commandPressed = [e.currentTarget.innerText]
    $("#inputCommand").data('inputCommand', inputCommand)
    updateModalUI()
})

$("#myModal").on("click", ".word-suggestion", function(e) {
    console.log("handling word-suggestion pressed")
    let inputCommand = $("#inputCommand").data('inputCommand')
    inputCommand.wordPressed = [e.currentTarget.innerText]
    $("#inputCommand").data('inputCommand', inputCommand)
    updateModalUI()
})

$("#myModal").on("click", ".selected-command", function(e) {
    console.log("handling selected-command pressed")
    let inputCommand = $("#inputCommand").data('inputCommand')
    inputCommand.commands.splice(inputCommand.commands.indexOf(e.currentTarget.innerText), 1)
    $("#inputCommand").data('inputCommand', inputCommand)
    updateModalUI()
})