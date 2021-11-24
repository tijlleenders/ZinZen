'use strict'

var inputClickCounter = 0;

$("#modal-header-close").click(function () {
    $("#myModal").modal("hide");
});

$("#modal-footer-close").click(function () {
    $("#myModal").modal("hide");
});

$("#addButton").click(function () {
    let parent = goals.find({ id: parentId })[0]
    if (parent.label == "goal") {
        addAGoal()
    }
    if (parent.label == "feeling") {
        addAFeeling()
    }
});

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

function goTo(id) {
    console.log("inside goTo... with id", id)
    // todo: zoom in animation
    let goal = goals.find({ id: id })[0]
    if (goal == undefined) {
        console.error("can't find goal with id:", id)
        return
    }

    switch (goal.label) {
        case "person":
        case "setting":
        case "suggestion":
        case "feeling":
        case "goal":
            $("#main-promised").empty()
            $("#main-quote").addClass('d-none')
            parentId = id
            updateUIChildrenFor(id)
            updateBreadcrumbUI()
            break;

        case "setting-action":
        case "action":
            switch (goal.function) {
                case "openURLs()":
                    openURLs(goal.urls)
                    return
                    break;
                case "setScreenModeDark()":
                    setScreenModeDark()
                    return
                    break;
                case "setScreenModeLight()":
                    setScreenModeLight()
                    return
                    break;
                case "logOut()":
                    logOut()
                    return
                    break;
                case "setLanguageTo('en')":
                    setLanguageTo('en')
                    return
                    break;
                case "setLanguageTo('nl')":
                    setLanguageTo('nl')
                    return
                    break;
                case "resetRepository()":
                    resetRepository()
                    break;
                default:
                    console.log("function not recognized:", goal.function)
                    return
                    break;
            }
            return
            break;

        default:
            console.error("can't handle goal label:", goal.label)
    }
}

function changeStatus(id) {
    if (relationships.find({ parentId: id })[0] != undefined) {
        goTo(id)
    }
    let goal = goals.find({ id: id })[0]
    let currentStatus = goal.status
    let toBeStatus = goal.status
    switch (currentStatus) {
        case "action":
        case "link":
        case "setting":
        case "add":
        case "folder":
            goTo(id)
            break;
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

    goal.status = toBeStatus
    goals.update(goal)
    $("#" + id).html(generateGoalHTML(goal))
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
        goTo(selectedGoalId)
    } else {
        console.log("error in #goals.on(click)!");
    }
})

function addAGoal() {
    openModal("", "add")
}

function addAFeeling() {
    openModal("", "moment")
}