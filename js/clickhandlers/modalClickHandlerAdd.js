'use strict'

$("#myModal").on("keyup", "#inputCommand", function(e) {
    console.log("key pressed:", $("#inputCommand").val())
    let goalId = $("#myModal").data("idx")
    let getSuggestions = {
        action: "read",
        command: "getSuggestions",
        input: $("#inputCommand").val(),
        goalId: goalId
    }
    send(JSON.stringify(getSuggestions))
    if (e.which === 13) {
        if ($(this).val().length == 0) return;

        addSomething($(this).val())

        $(this).removeAttr("disabled")
        $(this).val("").focus()
    }
});

function addSomething() {
    let title = $("#inputCommand").val()
    let status = "maybe"

    let duration = $("#duration-buttons").data("defaultDuration")
    if (duration == undefined) {
        duration = 0
    }

    let parentId = ""
    if ($("#breadcrumb").data("goals") != undefined && $("#breadcrumb").data("goals").length != 0) {
        parentId = ($("#breadcrumb").data("goals"))[$("#breadcrumb").data("goals").length - 1].id
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