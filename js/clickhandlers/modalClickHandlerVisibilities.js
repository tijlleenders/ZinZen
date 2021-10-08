'use strict'

$("#myModal").on("click", "#dont-share-anonymously", function () {
    console.log("dont-share-anonymously")
    let goalId = $("#myModal").data("idx")
    console.log("id:", goalId)
    let upsertGoal = {
        action: "command",
        command: "upsertGoal",
        goalId: goalId,
        shareAnonymously: "dontShareAnonymously"
    }
    console.log(upsertGoal)
    send(JSON.stringify(upsertGoal))
});

$("#myModal").on("click", "#share-anonymously", function () {
    console.log("share-anonymously")
    let goalId = $("#myModal").data("idx")
    console.log("id:", goalId)
    let upsertGoal = {
        action: "command",
        command: "upsertGoal",
        goalId: goalId,
        shareAnonymously: "shareAnonymously"
    }
    console.log(upsertGoal)
    send(JSON.stringify(upsertGoal))
});

$("#myModal").on("click", "#dont-share-publicly", function () {
    console.log("dont-share-publicly")
    let goalId = $("#myModal").data("idx")
    console.log("id:", goalId)
    let upsertGoal = {
        action: "command",
        command: "upsertGoal",
        goalId: goalId,
        sharePublicly: "dontSharePublicly"
    }
    console.log(upsertGoal)
    send(JSON.stringify(upsertGoal))
});

$("#myModal").on("click", "#share-publicly", function () {
    console.log("share-publicly")
    let goalId = $("#myModal").data("idx")
    console.log("id:", goalId)
    let upsertGoal = {
        action: "command",
        command: "upsertGoal",
        goalId: goalId,
        sharePublicly: "sharePublicly"
    }
    console.log(upsertGoal)
    send(JSON.stringify(upsertGoal))
});

$("#myModal").on("click", "#dont-share-selectively", function () {
    console.log("dont-share-selectively")
    let goalId = $("#myModal").data("idx")
    console.log("id:", goalId)
    let upsertGoal = {
        action: "command",
        command: "upsertGoal",
        goalId: goalId,
        shareSelectively: []
    }
    console.log(upsertGoal)
    send(JSON.stringify(upsertGoal))
});

$("#myModal").on("click", "#share-selectively", function () {
    console.log("share-selectively")
    let goalId = $("#myModal").data("idx")
    console.log("id:", goalId)
    let upsertGoal = {
        action: "command",
        command: "upsertGoal",
        goalId: goalId,
        shareSelectively: []
    }
    console.log(upsertGoal)
    send(JSON.stringify(upsertGoal))
});