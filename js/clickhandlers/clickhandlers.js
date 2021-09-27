'use strict'

var inputClickCounter = 0;


$("#collaboration-modal-title").on("click", ".btn", function(event) {
    var emailLine =
        '<li class="list-group-item">' +
        $("#collaboration-email-input").val() +
        " - status</li>";
    $("#collaboration-modal-list").prepend(emailLine);
    message =
        '{"action":"command","command":"suggestion.make","goalId":"' +
        $("#collaboration-modal-goal-id").val() +
        '","email":"' +
        $("#collaboration-email-input").val() +
        '"}';
    console.log(message);
    send(message);
    return false;
});

$("#modal-header-close").click(function() {
    $("#myModal").modal("hide");
});

$("#modal-footer-close").click(function() {
    $("#myModal").modal("hide");
});

$("#top-settings").click(function() {
    openModal("noId", "settings")
        //Todo: if main-promised hasClass d-none set calendar button active else set promised button active
    $("#main-promised").empty()
    $("#breadcrumb").data("top", settings.get("username"))
        //todo: remove unnecessary infor from settingsBreadCrumb
    let settingsBreadCrumb = [{
        "id": "settings-parent",
        "label": "goal",
        "properties": {
            "duration": [{
                "id": 193134762,
                "label": "duration",
                "value": "0",
                "key": "duration"
            }],
            "owner": [{
                "id": 1960584223,
                "label": "owner",
                "value": "fcbd9a58-bcd1-9ce2-c75a-1ca8282bd260",
                "key": "owner"
            }],
            "createdDT": [{
                "id": 109973027,
                "label": "createdDT",
                "value": "2021-08-11T10:12:32.256Z",
                "key": "createdDT"
            }],
            "statusSort": [{
                "id": 1051346709,
                "label": "statusSort",
                "value": 1,
                "key": "statusSort"
            }],
            "timesOfDaysPref": [{
                "id": -501317972,
                "label": "timesOfDaysPref",
                "value": "0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1",
                "key": "timesOfDaysPref"
            }],
            "start": [{
                "id": -198465520,
                "label": "start",
                "value": "2021-08-11T10:12:04.890Z",
                "key": "start"
            }],
            "timeZone": [{
                "id": -86468330,
                "label": "timeZone",
                "value": "Europe/Amsterdam",
                "key": "timeZone"
            }],
            "updatedDT": [{
                    "id": 29233606,
                    "label": "updatedDT",
                    "value": "2021-08-11T10:12:03.920Z",
                    "key": "updatedDT"
                },
                {
                    "id": 30101110,
                    "label": "updatedDT",
                    "value": "2021-08-11T10:12:32.256Z",
                    "key": "updatedDT"
                }
            ],
            "title": [{
                "id": -1808940905,
                "label": "title",
                "value": "Settings",
                "key": "title"
            }],
            "sharePublicly": [{
                "id": 399556518,
                "label": "sharePublicly",
                "value": "sharePublicly",
                "key": "sharePublicly"
            }],
            "tags": [{
                "id": -1919591829,
                "label": "tags",
                "value": "4",
                "key": "tags"
            }],
            "status": [{
                "id": -800784816,
                "label": "status",
                "value": "maybe",
                "key": "status"
            }]
        }
    }]
    $("#breadcrumb").data("goals", settingsBreadCrumb)
    updateBreadcrumbUI()

    let propertiesArrayString = getSettingsPropertiesFor("")
    let propertiesArray = JSON.parse(propertiesArrayString, reviver)
    propertiesArray.forEach(propertiesMap => {
        handleIncomingProperties(propertiesMap)
    });

})

$("#top-lists").click(function() {
    $("#breadcrumb").removeClass("d-none")
    $("#main-promised").removeClass("d-none")
    $("#main-play").addClass("d-none")
    $("#main-search").removeClass("d-none")
    $("#main-promised").empty();
    send(
        '{"action":"read","readRequestType":"allSubsFor","parentId":""}'
    );
})

$("#top-calendar").click(function() {
    send('{"action":"read","readRequestType":"play"}')
    $("#breadcrumb").addClass("d-none")
    $("#main-play").removeClass("d-none")
    $("#main-search").addClass("d-none")
    $("#main-promised").addClass("d-none")
})

$("#top-inbox").click(function() {
    alert('Inbox from the future coming soon...')
})

$("#top-explore").click(function() {
    alert('Crowdsourced machine-learned personal suggestions coming soon...')
})


$("#breadcrumb").on("click", ".breadcrumb-button", function(event) {
    event.stopPropagation();
    console.log("id:", event.target.id)
    let prefix = event.target.id.split("-")[0]
    let parentId = event.target.id.substring(prefix.length + 1)
    if (parentId == "me") {
        parentId = ""
    }
    $("main-promised").empty()
    send(
        '{"action":"read","readRequestType":"allSubsFor","parentId":"' +
        parentId +
        '"}'
    )
})

function toggleEditButtons(id) {
    $("#goal-buttons-row-" + id).toggleClass('d-none')
    $("#goal-title-row-" + id).toggleClass('d-none')
    $("#subtext-row-" + id).toggleClass('d-none')
}

$("#main-promised").on("contextmenu", ".goal", function(event) {
    let nodeId = getNodeId(event)
    toggleEditButtons(nodeId.slice(-36))
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

$("#main-promised").on("mousedown", ".circle-col", function(event) {
    console.log("event mousedown", event)
    let nodeId = getNodeId(event)
    console.log("nodeId", nodeId)
    startX = parseInt(event.clientX)
    startY = parseInt(event.clientY)
    console.log("startX:", startX)
    console.log("startY:", startY)
})

$("#main-promised").on("mouseup", ".circle-col", function(event) {
    console.log("event mouseup", event)
    let nodeId = getNodeId(event)
    console.log("nodeId", nodeId)
    endX = parseInt(event.clientX)
    endY = parseInt(event.clientY)
    console.log("endX:", endX)
    console.log("endY:", endY)
    if (Math.abs(endX - startX) <= 10 &&
        Math.abs(endY - startY) <= 10) {
        console.log("clicked!")
        changeStatus(nodeId.slice(-36))
    }
    if (Math.abs(endX - startX) > 50 &&
        Math.abs(endY - startY) <= 30) {
        console.log("swiped!")
        toggleEditButtons(nodeId.slice(-36))
    }
})

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
    let tempProps = $("#" + id).data("properties")
    tempProps.set("status", [toBeStatus])
    $("#" + id).html(generateGoalHTML(id))

    $("#modal-status").data("status", toBeStatus) //necessary for fast/consistant UI update
    if (publicOrPrivate == 'public') {
        $("#subtext-" + id).append('<br />Suggested owner to set status to ' + toBeStatus)
    }
    var messageJson = {
        action: "command",
        command: "upsertGoal",
        goalId: id,
        status: toBeStatus
    }
    send(JSON.stringify(messageJson))
}

function goTo(id) {
    // todo: zoom in animation

    send(
        '{"action":"read","readRequestType":"allSubsFor","parentId":"' +
        id +
        '"}'
    );
}

function deleteGoal(id) {
    let deleteGoal = {
        action: "command",
        command: "deleteGoal",
        goalId: id
    }
    send(JSON.stringify(deleteGoal))
    $("#" + id).removeClass('jello-vertical-animation') //if any
    $("#" + id).addClass('swirl-out-bck-animation')
    $("#" + id).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
        $("#" + id).remove();
    });
}

$("#mmain-play").on("click", ".slot", function(event) {
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


$("#main-promised").on("click", ".goal", function(event) {
    console.log(Date.now());
    let nodeId = getNodeId(event)
    let selectedGoalId = nodeId.slice(-36);
    if (nodeId != "") {
        console.log("properties:", $("#" + selectedGoalId).data("properties"))
        if ($("#" + selectedGoalId).data("properties").commands != undefined) {
            console.log("Commands!")
            if ($("#" + selectedGoalId).data("properties").commands[0] == 'setting') {
                goToSetting(selectedGoalId)
            }
            if ($("#" + selectedGoalId).data("properties").commands[0] == 'WebLink') {
                window.open($("#" + selectedGoalId).data("properties").url[0], '_blank')
            }
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
            deleteGoal(selectedGoalId)
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
$("#main-promised").on("mouseover", ".goal", function(event) {
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
$("#main-promised").on("mouseout", ".goal", function(event) {
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

$("#add-a-goal-button").click(function() {
    openModal("", "add")
})