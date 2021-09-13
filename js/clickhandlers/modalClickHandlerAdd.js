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