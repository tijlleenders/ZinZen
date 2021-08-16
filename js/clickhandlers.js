'use strict'

var inputClickCounter = 0;

$("#main-login").click(function() {
    redirectUserAgentToAuthorizeEndpoint()
})

$("#create-account").click(function() {
    redirectUserAgentToSignupEndpoint()
})

$("#main-about").click(function() {
    $("#main-info-about-details").removeClass('d-none')
    $("#main-info-privacy-details").addClass('d-none')
    $("#main-info-terms-details").addClass('d-none')
})

$("#main-privacy").click(function() {
    $("#main-info-privacy-details").removeClass('d-none')
    $("#main-info-about-details").addClass('d-none')
    $("#main-info-terms-details").addClass('d-none')
})

$("#main-terms").click(function() {
    $("#main-info-privacy-details").addClass('d-none')
    $("#main-info-about-details").addClass('d-none')
    $("#main-info-terms-details").removeClass('d-none')
})

$("#main-donate").click(function() {
    window.open('https://www.gofundme.com/f/deliver-purpose-with-an-app-for-keeping-promises/donate', '_blank');
    $("#main-about").click()
})

$("#main-roadmap").click(function() {
    window.open('https://zinzen.me/?profile=tijl.leenders&listId=fcbd9d74-2a52-9336-316c-e044a1c000c2', '_blank');
    $("#main-about").click()
})

$("#5m-outlined").click(function() {
    $("#duration-buttons").data("defaultDuration", 300)
});

$("#15m-outlined").click(function() {
    $("#duration-buttons").data("defaultDuration", 900)
});

$("#1h-outlined").click(function() {
    $("#duration-buttons").data("defaultDuration", 3600)
});

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

$("#commandCancel").click(function() {
    $("#commandCancel").removeClass("octicon-show");
    $("#inputCommand").val("")
});

$("#inputCommand").focus(function() {
    inputClickCounter = 0
});

$("#inputCommand").click(function() {
    console.log("inputClickCounter:", ++inputClickCounter)
});

function navigateToHome() {
    console.log(Date.now());
    $("#main-promised").empty();
    send(
        '{"action":"read","readRequestType":"allSubsFor","parentId":""}'
    );
    if (!mobileAndTabletCheck()) {
        $("#inputCommand").focus()
    }
}

$("#top-settings").click(function() {
    if (publicOrPrivate == undefined ||
        publicOrPrivate == "public") {
        location.href = "https://ZinZen.me"
    } else {
        openSettingsModal()
            //Todo: if main-promised hasClass d-none set calendar button active else set promised button active
    }
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
    if (!mobileAndTabletCheck()) {
        $("#inputCommand").focus()
    }
})

$("#top-calendar").click(function() {
    send('{"action":"read","readRequestType":"play"}')
    $("#breadcrumb").addClass("d-none")
    $("#main-play").removeClass("d-none")
    $("#main-search").addClass("d-none")
    $("#main-promised").addClass("d-none")
})

$("#promised-img-modal").click(function() {
    $("#promised-img-modal").removeClass("semi-transparent")
        //logic
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

$("#main-promised").on("contextmenu", ".goal", function(event) {
    let nodeId = getNodeId(event)
    $("#carousel-item-2-" + nodeId.slice(-36)).toggleClass('active')
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

$("#main-promised").on("click", ".goal", function(event) {
    event.stopPropagation();
    console.log(Date.now());
    let nodeId = getNodeId(event)
    let selectedGoal = nodeId.slice(-36);
    if (nodeId != "") {
        if ($("#" + nodeId).hasClass("title") ||
            $("#" + nodeId).hasClass("title-text") ||
            nodeId.substring(0, 8) == "subtext-" ||
            nodeId.substring(0, 12) == "subtext-col-") {
            // todo: zoom in animation
            $("#title-" + selectedGoal).removeClass("title-highlight");
            $("#goal-buttons-row-" + selectedGoal).removeClass("row-highlight");
            console.log("title clicked on goal ", selectedGoal);
            send(
                '{"action":"read","readRequestType":"allSubsFor","parentId":"' +
                selectedGoal +
                '"}'
            );
            if (!mobileAndTabletCheck()) {
                $("#inputCommand").focus()
            }
        }
        if (nodeId.substring(0, 11) == "delete-col-" ||
            nodeId.substring(0, 12) == "delete-icon-") {
            let deleteGoal = {
                action: "command",
                command: "deleteGoal",
                goalId: selectedGoal
            }
            send(JSON.stringify(deleteGoal))
            $("#" + selectedGoal).removeClass('jello-vertical-animation') //if any
            $("#" + selectedGoal).addClass('swirl-out-bck-animation')
            $("#" + selectedGoal).one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
                $(this).remove();
            });
        }
        if (nodeId.substring(0, 11) == "finish-col-" ||
            nodeId.substring(0, 12) == "finish-icon-") {
            openModal(selectedGoal, "finish")
        }
        if (nodeId.substring(0, 17) == "visibilities-col-" ||
            nodeId.substring(0, 18) == "visibilities-icon-") {
            openModal(selectedGoal, "visibilities")
        }
        if ($("#" + nodeId).hasClass("todo-circle") ||
            $("#" + nodeId).hasClass("circle-col") ||
            nodeId.substring(0, 11) == "circle-col-" ||
            nodeId.substring(0, 11) == "svg-circle-") {
            var status = $(this).data("status")
            switch (status) {
                case "promised":
                    status = "done"
                    break;
                case "done":
                    status = "never"
                    break;
                case "maybe":
                    status = "done"
                    break;
                case "never": //Todo: if goal has duration or due date: set to promised
                    status = "maybe"
                    break;
                default:
                    console.log("error not handling status in click on todo-circle")
                    break;
            }
            $("#modal-status").data("status", status) //necessary for fast/consistant UI update
            if (publicOrPrivate == 'public') {
                $("#subtext-" + nodeId.slice(-36)).append('<br />Suggested owner to set status to ' + status)
            }
            var messageJson = {
                action: "command",
                command: "upsertGoal",
                goalId: selectedGoal,
                status: status
            }
            send(JSON.stringify(messageJson))
        }

        if ($("#" + nodeId).hasClass("parent-link")) {
            $("#main-promised").empty();
            send(
                '{"action":"read","readRequestType":"allSubsFor","parentId":"' +
                selectedGoal +
                '"}'
            );
            if (!mobileAndTabletCheck()) {
                $("#inputCommand").focus()
            }
        }
        if ($("#" + nodeId).hasClass("collaboration")) {
            openModal(selectedGoal, "collaboration")
        }
        if ($("#" + nodeId).hasClass("due")) {
            openModal(selectedGoal, "due")
        }
        if ($("#" + nodeId).hasClass("mood")) {
            openModal(selectedGoal, "mood")
        }
        if ($("#" + nodeId).hasClass("connect")) {
            openModal(selectedGoal, "connect")
        }
        if ($("#" + nodeId).hasClass("notes")) {
            openModal(selectedGoal, "notes")
        }
        if ($("#" + nodeId).hasClass("workflow")) {
            openModal(selectedGoal, "workflow")
        }
        if ($("#" + nodeId).hasClass("image")) {
            openModal(selectedGoal, "image")
        }
        if ($("#" + nodeId).hasClass("link")) {
            openModal(selectedGoal, "link")
        }
        if ($("#" + nodeId).hasClass("location")) {
            openModal(selectedGoal, "location")
        }
        if ($("#" + nodeId).hasClass("budget")) {
            openModal(selectedGoal, "budget")
        }
        if ($("#" + nodeId).hasClass("duration")) {
            openModal(selectedGoal, "duration")
        }
        if ($("#" + nodeId).hasClass("tags")) {
            openModal(selectedGoal, "tags")
        }
        if ($("#" + nodeId).hasClass("mail")) {
            openModal(selectedGoal, "mail")
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

function addSomething(title) {
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
}

$("#move-a-goal-button").click(function(e) {
    $("#main-promised").sortable("enable")
})

$("#add-a-goal-button").click(function() {
    let title = $("#inputCommand").val()
    if (title.length != 0) {
        addSomething(title)
    }

    $("#inputCommand").val("").focus()
})

$("#inputCommand").on("keyup", function(e) {
    if (e.which === 13) {
        if ($(this).val().length == 0) return;

        addSomething($(this).val())

        $(this).removeAttr("disabled")
        $(this).val("").focus()
    }
});