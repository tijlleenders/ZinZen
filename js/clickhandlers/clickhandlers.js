'use strict'

var inputClickCounter = 0;

$("#modal-header-close").click(function () {
    $("#myModal").modal("hide");
});

$("#modal-footer-close").click(function () {
    $("#myModal").modal("hide");
});

$("#top-settings").click(function () {
    $("#breadcrumb").removeClass("d-none")
    $("#main-play").addClass("d-none")
    $("#main-promised").removeClass("d-none")
    $("#main-quote-row").addClass("d-none")
    $("#main-explore-row").addClass("d-none")
    goTo("______________________________ZinZen")
})

$("#top-goals").click(function () {
    $("#breadcrumb").removeClass("d-none")
    $("#main-play").addClass("d-none")
    $("#main-promised").removeClass("d-none")
    goTo(sessionId)
})

$("#top-calendar").click(function () {
    $("#breadcrumb").addClass("d-none")
    generateCalendarHTML()
    $("#main-play").removeClass("d-none")
    $("#main-promised").addClass("d-none")
    $("#main-quote-row").addClass("d-none")
})

$("#top-inbox").click(function () {
    openMainMailModal()
})

$("#top-explore").click(function () {
    $("#breadcrumb").removeClass("d-none")
    $("#main-play").addClass("d-none")
    $("#main-promised").removeClass("d-none")
    $("#main-quote-row").addClass("d-none")
    goTo("_________________________suggestions")
})


$("#breadcrumb").on("click", ".breadcrumb-button", function (event) {
    event.stopPropagation();
    console.log("id:", event.target.id)
    let prefix = event.target.id.split("-")[0]
    goTo(event.target.id.substring(prefix.length + 1))
})

$("#main-promised").on("contextmenu", ".goal", function (event) {
    let nodeId = getNodeId(event)
    openModal(nodeId.slice(-36), "add")
    return false //returning false blocks context menu
})

function getNodeId(event) {
    // console.log('event:', event)
    var nodeId = "";
    if (event.target.id.length != undefined && event.target.id != "") {
        nodeId = event.target.id;
    } else {
        //element without id clicked, should be an icon, bubble up to icons container
        var parents = $(event.target).parentsUntil(".icons");
        if (parents.length == 0) {
            nodeId = event.target.parentNode.id
        } else {
            nodeId = parents[parents.length - 1].id;
        }
    }
    console.log("nodeId:", nodeId);
    return nodeId
}

$("#main-promised").on("mousedown", ".circle-col", function (event) {
    console.log("event mousedown", event)
    let nodeId = getNodeId(event)
    console.log("nodeId", nodeId)
    sortableStartX = parseInt(event.clientX)
    sortableStartY = parseInt(event.clientY)
    console.log("sortableStartX:", sortableStartX)
    console.log("sortableStartY:", sortableStartY)
})

$("#main-promised").on("mouseup", ".circle-col", function (event) {
    console.log("event mouseup", event)
    let nodeId = getNodeId(event)
    console.log("nodeId", nodeId)
    sortableEndX = parseInt(event.clientX)
    sortableEndY = parseInt(event.clientY)
    console.log("sortableEndX:", sortableEndX)
    console.log("sortableEndY:", sortableEndY)
    if (Math.abs(sortableEndX - sortableStartX) <= 10 &&
        Math.abs(sortableEndY - sortableStartY) <= 10) {
        console.log("clicked!")
        changeStatus(nodeId.slice(-36))
    }
    if (Math.abs(sortableEndX - sortableStartX) > 50 &&
        Math.abs(sortableEndY - sortableStartY) <= 30) {
        openModal(nodeId.slice(-36), "add")
    }
})

$("#main-promised").on("sortupdate", function (event, ui) {
    updatePriority()
});

function changeStatus(id) {
    let currentStatus = $("#" + id).data("status")
    let toBeStatus = currentStatus
    switch (currentStatus) {
        case "promised":
            toBeStatus = "done"
            break;
        case "done":
            toBeStatus = "never"
            break;
        case "maybe":
            toBeStatus = "done"
            break;
        case "never": //Todo: if goal has duration or due date: set to promised
            toBeStatus = "maybe"
            break;
        default:
            console.log("error not handling status in click on todo-circle")
            break;
    }

    //fast update before confirmation from backend
    let goal = goals.find({ id: id })[0]
    goal.status = toBeStatus
    goals.update(goal)
    $("#" + id).html(generateGoalHTML(goal))
}

function goTo(id) {
    // console.log("inside goTo... with id", id)
    // todo: zoom in animation
    $("#main-promised").empty()
    parentId = id
    let parent = goals.find({ id: parentId })[0]
    if (parent == undefined) {
        console.error("can't find parent with id:", id)
    } else {
        updateUIChildrenFor(parent.id)
        updateBreadcrumbUI()
    }
}

$("#mmain-play").on("click", ".slot", function (event) {
    console.log(Date.now());
    let nodeId = getNodeId(event)
    let selectedSlotId = nodeId.slice(-36);
    console.log("Slot click:", selectedSlotId)
    let goalId = $("#slot-" + selectedSlotId).data("goal-id")
    let beginISO = $("#slot-" + selectedSlotId).data("begin")
    let endISO = $("#slot-" + selectedSlotId).data("end")
    let completeSlot = {
        action: "command",
        command: "completeSlot",
        goalId: goalId,
        beginISO: beginISO,
        endISO: endISO
    }
    goalsLastModifiedEpochMs = new dayjs.utc().valueOf()
    send(JSON.stringify(completeSlot))
    $("#slot-title-" + selectedSlotId).addClass("text-decoration-line-through")
})


$("#main-promised").on("click", ".goal", function (event) {
    console.log(Date.now());
    let nodeId = getNodeId(event)
    let selectedGoalId = nodeId.slice(-36);
    if (nodeId != "") {
        let properties = goals.find({ id: selectedGoalId })[0]
        console.log("properties:", properties)
        if (properties.commands != undefined && properties.commands.length != 0) {
            console.log("Commands!")
            if (properties.commands.split(',').includes('setting')) {
                goToSetting(selectedGoalId)
                return
            }
            if (properties.commands.split(',').includes('WebLink')) {
                window.open(properties.url[0], '_blank')
                return
            }
            goTo(selectedGoalId)
            return
        }
        if ($("#" + nodeId).hasClass("title") ||
            $("#" + nodeId).hasClass("title-text") ||
            nodeId.substring(0, 8) == "subtext-" ||
            nodeId.substring(0, 12) == "subtext-col-") {
            goTo(selectedGoalId)
        }
        if ($("#" + nodeId).hasClass("parent-link")) {
            goTo(selectedGoalId)
        }
        if (nodeId.substring(0, 11) == "delete-col-" ||
            nodeId.substring(0, 12) == "delete-icon-") {
            deleteGoalAndExclusiveDescendants(selectedGoalId)
        }
        if (nodeId.substring(0, 11) == "finish-col-" ||
            nodeId.substring(0, 12) == "finish-icon-") {
            openModal(selectedGoalId, "schedule")
        }
        if ($("#" + nodeId).hasClass("due")) {
            openModal(selectedGoalId, "schedule")
        }
        if ($("#" + nodeId).hasClass("duration")) {
            openModal(selectedGoalId, "schedule")
        }
        if (nodeId.substring(0, 17) == "visibilities-col-" ||
            nodeId.substring(0, 18) == "visibilities-icon-") {
            openModal(selectedGoalId, "visibilities")
        }
    } else {
        console.log("error in #goals.on(click)!");
    }
})

//TODO: keep this? Now only using card:hover
$("#main-promised").on("mouseover", ".goal", function (event) {
    var target = event.target.id;
    var id = "";
    if (target == "") {
        if ($(event.target).parents(".goal").attr("id").length > 0) {
            id = $(event.target).parents(".goal").attr("id").slice(-36);
        }
    } else {
        id = target.slice(-36);
    }
    //do something to hover programmatically
});

//TODO: keep this? Now only using card:hover
$("#main-promised").on("mouseout", ".goal", function (event) {
    var target = event.target.id;
    var id = "";
    if (target == "") {
        if ($(event.target).parents(".goal").attr("id").length > 0) {
            id = $(event.target).parents(".goal").attr("id").slice(-36);
        }
    } else {
        id = target.slice(-36);
    }
    //do something to hover programmatically
});

$("#add-a-goal-button").click(function () {
    openModal("", "add")
})