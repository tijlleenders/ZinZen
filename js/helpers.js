'use strict'

function openMainMailModal() {
    emptyModal()
    $("#modal-header-content").html('<h4 class="modal-title">1990\'s style inbox</h4>')
    $("#modal-body").html('\
  <div class="row">\
  <div class="col">\
    <div id="modal-inbox">\
      This <b>inbox</b> shows messages that don\'t belong in goal-specific mailboxes.<br />\
      There should be very few messages here as they require context switching.<br />\
      <br />\
      <b>Want this?</b> You can! <b><a\
          href="https://www.gofundme.com/f/deliver-purpose-with-an-app-for-keeping-promises/donate"><br />Fund\
          it.</a></b>\
      ( Set TIP to <b>"Other - 0%"</b> )<br />\
    </div>\
  </div>\
</div>')
    $("#myModal").modal("show");
}


function updateModalAddUI() {
    let inputCommand = $("#inputCommand").data('inputCommand')
    console.log("refreshing for inputCommand:", inputCommand)

    let newInputCommand = parseCommand(inputCommand)
    console.log("newInputcommand:", newInputCommand)
    $("#inputCommand").data('inputCommand', newInputCommand)
    $("#inputCommand").val(newInputCommand.title)
    $("#inputCommand").focus()
    //when to change modal title??

    let selectedCommands = ``
    newInputCommand.commands.forEach(command => {
        selectedCommands += '<span class="badge bg-secondary m-1 selected-command">' + command + '</span>'
    });
    $("#selected-commands").html(selectedCommands)

    let suggestedCommands = `Suggested commands: `
    newInputCommand.suggestedCommands.forEach(suggestion => {
        suggestedCommands += '<button type="button" class="btn btn-outline-secondary btn-sm m-1 command-suggestion">' + suggestion + '</button>'
    });
    $("#suggested-commands").html(suggestedCommands)

    let suggestedWords = `Suggested words: `
    newInputCommand.suggestedWords.forEach(suggestion => {
        suggestedWords += '<button type="button" class="btn btn-outline-secondary btn-sm m-1 word-suggestion">' + suggestion + '</button>'
    });
    $("#suggested-words").html(suggestedWords)
}

function updateModalUI() {
    switch ($("#myModal").data("modalType")) {
        case "add":
            updateModalAddUI()
            break;
        default:
            console.log("modalType to render UI for not recognized")
    }
}

function openModal(id, modalType) {
    console.log("inside openModal...")
    if (
        $("#myModal").data("idx") == id &&
        $("#myModal").hasClass('in') // is it showing?
    ) {
        console.log("openModal called for " + modalType + " modal with id " + id + " - but modal already open")
        return //without refresh?
    }
    emptyModal()
    $("#myModal").data("modalType", modalType)
    $("#myModal").data("idx", id)

    console.log("modalType:", modalType)
    switch (modalType) {
        case "add":
            setSkeletonHTMLForAdd(id)
            updateModalUI()
            break;
        default:
            console.log("modalType " + modalType + " not found")
            break;
    }
    if (id != "") {
        send('{"action":"read","readRequestType":"specificNode","nodeId":"' + id + '"}') //will fill the modal upon response - if applicable
    }
    $("#myModal").modal("show")
}

function emptyModal() {
    $("#myModal").data("modalType", "")
    $("#modal-header-content").html('<h4 class="modal-title">...</h4>')
    $("#modal-body").empty()
    $("#modal-footer-content").empty()
    $("#myModal").data("idx", "")
}

function updateSettingsUI() {
    console.log("updating settings...")
    updateScreenMode()
}

function updateScreenMode() {
    if (document.documentElement.getAttribute("data-theme") != settings.screenMode[0]) {
        document.documentElement.setAttribute("data-theme", settings.screenMode[0])
    }
}

function setSkeletonHTMLForAdd(id) {
    console.log("inside setSkeletonHTMLForAdd...")
    let headerHTML = `<h4 class="modal-title">Add or search</h4>`
    $("#modal-header-content").html(headerHTML)
    let bodyHTML = `
    <div class="row my-2" id="input-row">
      <div class="col">
     `
    bodyHTML += `
    <div class="">
        <div class="m-1">
            <input class="form-control" type="text" id="inputCommand" placeholder="Type something..." name="command" required autofocus>
        </div>
    </div>
    </div>
    </div>
    `
    bodyHTML += `    
    <div class="row mt-2" id="selected-row">
      <div class="col">
        <div class="" id="selected-commands">
        </div>
      </div>
    </div>
    <div class="row mt-2" id="add-row">
      <div class=" col m-1">
        <button type="button" class="btn btn-outline-primary" id="modal-add-a-goal-button">Add</button>
      </div>
    </div>  
    <div class="row mt-2 d-none" id="save-row">
      <div class="col m-1">
        <button type="button" class="btn btn-outline-primary" id="save-a-goal-button">Save</button>
      </div>
      <div class="col m-1">
        <button type="button" class="btn btn-outline-primary" id="delete-a-goal-button">Delete</button>
      </div>
    </div>    
    </div>
    <div class="row mt-2" id="suggested-commands-row">
      <div class="col">
        <div class="" id="suggested-commands">
        </div>        
      </div>
    </div>
    `
    bodyHTML += `    
    <div class="row mt-2" id="suggested-words-row">
      <div class="col">
        <div class="" id="suggested-words">
        </div>
      </div>
    </div>
    `
    $("#modal-body").html(bodyHTML)
    let inputCommand = {
        title: '',
        commands: [],
        commandPressed: [],
        wordPressed: [],
        suggestedCommands: [],
        suggestedWords: []
    }
    let list = lists.by('id', id)
    console.log("list:", list)
    if (list != undefined) {
        inputCommand.title = list.title[0]
        $("#add-row").addClass('d-none') //custom workaround because can't change text of button inside modal somehow
        $("#save-row").removeClass('d-none')
        let headerHTML = `<h4 class="modal-title">Editing: ` + list.title[0].substring(0, 5) + `...</h4>`
        $("#modal-header-content").html(headerHTML)
    }

    $("#inputCommand").data('inputCommand', inputCommand)
    $("#myModal").on('shown.bs.modal', function () {
        $("#inputCommand").focus();
    });
}

function generateSlotHTML(element) {
    console.log("inside generateSlotHTML...")
    var slotId = element.id

    console.log("element for slotId ", slotId + ":" + element)

    //Todo: handle case for array of tags
    var tag = element.tags
    let cardStyle = "card" + tag
    let status = "maybe"
    let goalId = element.goalId
    var title = element.title
    var begin = new dayjs.utc(element.begin)
    var end = new dayjs.utc(element.end)
    let sequenceNumberHTML = ""
    if (element.scheduledInTotal > 1) {
        sequenceNumberHTML = "(" + element.scheduledSequenceNumber + "/" + element.scheduledInTotal + ") "
    }

    let slotSvg = getGoalSvg(status, "play-" + slotId)

    let html = '\
<div class="row slot card mb-2 ' + cardStyle + ' shadow-sm" id="slot-' +
        slotId +
        '" data-status="' + status + '"\
        data-goal-id="' + goalId + '"\
        data-begin="' + element.begin + '"\
        data-end="' + element.end + '">\
        <div class="col nopadding text-truncate icons d-flex flex-row align-items-center" id="slot-col-' +
        slotId +
        '">\
        <div class="row nopadding"><div class="col nopadding d-flex flex-column" id="col-begin-end-' + slotId + '" >' +
        '<div class="mx-2 begin-time" id="begin-' + slotId + '" >' + begin.tz(dayjs.tz.guess()).format('HH:mm') + '</div>' +
        '<div class="mx-2 end-time" id="end-' + slotId + '" >' + end.tz(dayjs.tz.guess()).format('HH:mm') + '</div>' +
        '</div></div>' +
        '<div class="mx-2" id="slot-title-' + slotId + '">' + title + '</div>' +
        '<div class="mx-2">' + sequenceNumberHTML + '</div>' +
        '\
        </div>\
    </div>\
  </div>\
</div>'
    return html
}

function generateEffortHTML(element) {
    console.log("inside generateEffortHTML...")
    var effortId = element.id

    console.log("element for effortId ", effortId + ":" + element)

    //Todo: handle case for array of tags
    var tag = element.goalTags
    let cardStyle = "card" + tag
    let status = "maybe"
    let goalId = element.goalId
    var title = element.goalTitle
    var begin = new dayjs.utc(element.begin)
    var end = new dayjs.utc(element.end)
    let sequenceNumberHTML = ""
    if (element.scheduledInTotal > 1) {
        sequenceNumberHTML = "(" + element.scheduledSequenceNumber + "/" + element.scheduledInTotal + ") "
    }

    let html = '\
<div class="row effort card mb-2 ' + cardStyle + ' shadow-sm" id="effort-' +
        effortId +
        '" data-status="' + status + '"\
      data-goal-id="' + goalId + '"\
      data-begin="' + element.begin + '"\
      data-end="' + element.end + '">\
      <div class="col nopadding text-truncate icons d-flex flex-row align-items-center" id="effort-col-' +
        effortId +
        '">\
      <div class="row nopadding"><div class="col nopadding d-flex flex-column" id="col-begin-end-' + effortId + '" >' +
        '<div class="mx-2 begin-time" id="begin-' + effortId + '" >' + begin.tz(dayjs.tz.guess()).format('HH:mm') + '</div>' +
        '<div class="mx-2 end-time" id="end-' + effortId + '" >' + end.tz(dayjs.tz.guess()).format('HH:mm') + '</div>' +
        '</div></div>' +
        '<div class="mx-2 text-decoration-line-through" id="effort-title-' + effortId + '">' + title + '</div>' +
        '<div class="mx-2">' + sequenceNumberHTML + '</div>' +
        '\
      </div>\
  </div>\
</div>\
</div>'
    return html
}

function getGoalSvg(status, id) {
    let goalSvg
    switch (status) {
        case "done":
            goalSvg = '<svg id="svg-circle-' + id + '" class="icons" xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24">\
        <path stroke="#959595" fill="#959595" stroke-width="1"\
          d="M17.28 9.28a.75.75 0 00-1.06-1.06l-5.97 5.97-2.47-2.47a.75.75 0 00-1.06 1.06l3 3a.75.75 0 001.06 0l6.5-6.5z" />\
        <path stroke="#959595" fill-rule="evenodd" fill="none" stroke-width="2"\
          d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1z" />\
        </svg>'
            break;

        case "promised":
            goalSvg = '<svg id="svg-circle-' + id + '" class="icons" xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24">\
        <path stroke="#959595" fill="none" stroke-width="2"\
          d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1z" />\
        </svg>'
            break;

        case "maybe":
            goalSvg = '<svg id="svg-circle-' + id + '" class="icons" xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24">\
        <path stroke="#959595" fill="none" stroke-width="2" stroke-dasharray="2.47"\
          d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1z" />\
        </svg>'
            break;

        case "never":
            goalSvg = '<svg id="svg-circle-' + id + '" class="icons" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36">\
      <path stroke="#959595" fill="#959595" d="M9.036 7.976a.75.75 0 00-1.06 1.06L10.939 12l-2.963 2.963a.75.75 0 101.06 1.06L12 13.06l2.963 2.964a.75.75 0 001.061-1.06L13.061 12l2.963-2.964a.75.75 0 10-1.06-1.06L12 10.939 9.036 7.976z">\
      </path><path stroke="#959595" fill-rule="evenodd" fill="none" stroke-width="2"\
      d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1z" />\
      </svg>'
            break;

        default:
            console.log("getGoalSvg status not handled.")
            break;
    }
    return goalSvg
}

function generateGoalHTML(id) {
    let properties = $("#" + id).data("properties")

    // console.log("generating goal HTML for properties:", properties)

    let goalId = properties.id
    var tag = properties.tags[0]
    let cardStyle = "card" + tag
    $("#" + goalId).addClass(cardStyle) //Todo: What does this do? remove...?

    let status = properties.status[0]
    $("#" + goalId).data("status", status) //Todo: remove if occurences replaced by properties.get("status")[0]

    let titleIcon = ""
    if (properties.url != undefined) {
        titleIcon = "🔗 "
    }
    let directParents = properties.directParents
    let subCountDone = parseInt(properties.subCountDone)
    let subCountTotal = parseInt(properties.subCountMaybe) + parseInt(properties.subCountPromised) + parseInt(properties.subCountDone)
    let finish = ""
    if (properties.finish && properties.finish[0] != "") {
        finish = properties.finish[0]
    }

    let visibilities = 'Private'
    if (properties.shareAnonymously && properties.shareAnonymously[0] == "shareAnonymously") {
        visibilities = 'Anonymous'
    }

    if (properties.sharePublicly && properties.sharePublicly[0] == "sharePublicly") {
        visibilities = 'Public'
    }

    var title = titleIcon + properties.title[0]
    var duration = properties.duration[0]
    let durationString = formatDuration(duration).short
    let durationTransparency = ""
    if (durationString == "0m") {
        durationTransparency = "semi-transparent"
    }

    //Todo: 18 subs (18h 20m)... First due x, last due x
    let subTitle = ''
    if (subCountTotal > 0) {
        subTitle += subCountDone + "/"
        subTitle += subCountTotal + " sub"
        if (subCountTotal > 1) {
            subTitle += 's'
        }
    } else {
        if (durationString != "0m") {
            subTitle += durationString
        }
        subTitle += '&zwnj;'
        if (finish != "") {
            let localTimeLeft = dayjs().to(new dayjs(finish))
            let dueStatus = 'Due'
            if (status == 'done') {
                dueStatus = 'Completed, was due'
            }
            subTitle += ' ' + dueStatus + ' ' + localTimeLeft
        }

    }
    if (properties.subTitle && properties.subTitle[0] != "") {
        subTitle += '<br />' + properties.subTitle[0]
    }


    let goalSvg = getGoalSvg(status, goalId)


    let parentRowAndColHTML = ''
    if (directParents.length != 0) {
        // console.log("directParents for " + goalId + ":" + directParents)
        parentRowAndColHTML += '<div class="row" id="goal-parents-row-' +
            goalId +
            '">\
      <div class="col text-end" id="goal-parents-' +
            goalId +
            '">\
    '
        if (directParents.length > 1) {
            directParents.forEach(function (parentId, index) {
                // console.log("getting parent for id:", parentId)
                let parent = lists.by('id', parentId)
                // console.log("parent:", parent)
                if (parent != undefined) {
                    parentRowAndColHTML += '<div class="parent-link" id="parent-link-' + parentId + '">' + parent.title[0] + "</div>"
                }
            })
        }
        parentRowAndColHTML += '</div></div>'
    }

    let tagHTML = ''
    //only set tag icon if top level goal
    if (directParents.length == 0) {
        tagHTML = '\
    <div class="tags mx-1" id="tags-' +
            goalId +
            '">\
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M2.5 7.775V2.75a.25.25 0 01.25-.25h5.025a.25.25 0 01.177.073l6.25 6.25a.25.25 0 010 .354l-5.025 5.025a.25.25 0 01-.354 0l-6.25-6.25a.25.25 0 01-.073-.177zm-1.5 0V2.75C1 1.784 1.784 1 2.75 1h5.025c.464 0 .91.184 1.238.513l6.25 6.25a1.75 1.75 0 010 2.474l-5.026 5.026a1.75 1.75 0 01-2.474 0l-6.25-6.25A1.75 1.75 0 011 7.775zM6 5a1 1 0 100 2 1 1 0 000-2z"/></svg>\
          </div>'
    }

    let returnHTML = `
          <div class="col-2 circle-col d-flex align-items-center align-text-center" id="circle-col-` + goalId + `">
            <div class="mr-3 todo-circle" id="todo-circle-` + goalId + `">` + goalSvg + `</div>
          </div>
          <div class="col-10">
            ` + parentRowAndColHTML + `            
            <div class="row" id="goal-title-row-` + goalId + `">
              <div class="col d-flex">
                <div class="title d-flex icons" id="title-` + goalId + `">              
                  <div class="me-auto d-inline-block text-truncate title-text" id="title-text-` + goalId + `">` + title + `</div>
                </div>
              </div>
            </div>
            <div class="row" id="subtext-row-` + goalId + `">
              <div class="col d-flex align-self-center" id="subtext-col-` + goalId + `">
                <div class="icons sub-title" id="subtext-` + goalId + `">` + subTitle + `</div>
              </div>
            </div>
          </div>
      `

    return returnHTML
}

function reviver(key, value) {
    if (typeof value === 'object' && value !== null) {
        if (value.dataType === 'Map') {
            return new Map(value.value);
        }
    }
    return value;
}

function replacer(key, value) {
    if (value instanceof Map) {
        return {
            dataType: 'Map',
            value: Array.from(value.entries()), // or with spread: value: [...value]
        };
    } else {
        return value;
    }
}

function formatDuration(duration) {
    var result = {}

    if (duration == undefined || duration < 0) {
        result.weeks = "0w"
        result.days = "0d"
        result.hours = "0h"
        result.minutes = "0m"
        result.seconds = "0s"
        result.short = "no duration"
    }
    duration = Math.abs(duration)
    var weeks = Math.floor(duration / (3600 * 24 * 7))
    var days = Math.floor((duration - weeks * 3600 * 24 * 7) / (3600 * 24))
    var hours = Math.floor((duration - weeks * 3600 * 24 * 7 - days * 3600 * 24) / 3600)
    var minutes = Math.floor((duration - weeks * 3600 * 24 * 7 - days * 3600 * 24 - hours * 3600) / 60)
    var seconds = Math.floor(duration % 60)

    result.weeks = weeks + "w"
    result.days = days + "d"
    result.hours = hours + "h"
    result.minutes = minutes + "m"
    result.seconds = seconds + "s"

    result.short = ""
    if (weeks > 0) {
        if (days > 0 &&
            weeks == 1) {
            result.short = weeks + "w " + days + "d"
        } else {
            result.short = weeks + "w"
        }
        return result
    }
    if (days > 0) {
        if (hours > 0) {
            result.short = days + "d " + hours + "h"
        } else {
            result.short = days + "d"
        }
        return result
    }
    if (hours > 0) {
        if (minutes > 0) {
            result.short = hours + "h " + minutes + "m"
        } else {
            result.short = hours + "h"
        }
        return result
    }
    if (minutes >= 0) {
        if (seconds > 0) {
            result.short = minutes + "m " + seconds + "s"
        } else {
            result.short = minutes + "m"
        }
        return result
    }

    return result
}

function updateBreadcrumbUI() {
    console.log("inside updateBreadcrumbUI...")
    let parent = lists.by('id', parentId)
    console.log("updating breadcrumb for parent:", parent)
    let breadcrumbHTML = ''
    if (parent.breadCrumb.length > 0) {
        if (parent.breadCrumb[0].name == undefined) {
            parent.breadCrumb.reverse()
        }
        console.log("parent breadCrumb:", parent.breadCrumb)
        parent.breadCrumb.forEach(crumb => {
            switch (crumb.label) {
                case "person":
                    breadcrumbHTML += '<button type="button" class="breadcrumb-button btn btn-outline-secondary btn-sm" id="breadcrumbGoal-' + crumb.id + '">' + crumb.name[0] + '</button>'
                    break;
                case "settings-root":
                    breadcrumbHTML += '<button type="button" class="breadcrumb-button btn btn-outline-secondary btn-sm" id="breadcrumbGoal-' + crumb.id + '">' + crumb.title[0] + '</button>'
                    break;
                default:
                    breadcrumbHTML += '><button type="button" class="breadcrumb-button btn btn-outline-secondary btn-sm" id="breadcrumbGoal-' + crumb.id + '">' + crumb.title[0] + '</button>'
            }
        })
        $("#breadcrumb").html(breadcrumbHTML)
        $("#breadcrumbGoal-" + parent.breadCrumb[parent.breadCrumb.length - 1].id).addClass('active')
    } else {
        breadcrumbHTML += '<button type="button" class="breadcrumb-button btn btn-outline-secondary btn-sm" id="breadcrumbGoal-' + parent.id + '">' + parent.name + '</button>'
        $("#breadcrumb").html(breadcrumbHTML)
    }
}

var commands = [
    'Email',
    'WebLink',
    'PhoneNumber',
    'Contact',
    'ShareWith',
    'SharePublic',
    'ShareAnonymous',
    'SuggestTo',
    'Goto',
    'GoUp',
    'CopyTo',
    'CopyAllTo',
    'MoveTo',
    'MoveAllTo',
    'RepeatsEvery',
    'Today',
    'Tomorrow',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
    'This',
    'Next',
    'Who',
    'FinishesOnOrBefore',
    'StartsAtOrAfter',
    'Until',
    'Emotion',
    'Notes',
    'WaitFor',
    'DependsOn',
    'Language',
    'https://'
];

function loadSettings() {
    lists.insert({
        "id": "____________________________settings",
        "breadCrumb": [{
            "id": "____________________________settings",
            "label": "settings-root",
            "title": [
                "Settings"
            ]
        }],
        "label": "settings-root",
        "title": [
            "Settings"
        ],
        "owner": "ZinZen",
        "subCountMaybe": "3",
        "subCountPromised": "0",
        "subCountDone": "0",
        "subCountNever": "0",
        "status": ["maybe"],
        "duration": "0",
        "createdDT": [
            "2021-08-12T15:24:06.702Z"
        ],
        "start": "2021-08-12T15:24:05.136Z",
        "tags": [
            "4"
        ],
        "updatedDT": [
            "2021-08-12T15:24:03.602Z",
            "2021-08-12T15:24:06.702Z"
        ],
        "commands": ["setting"],
        "statusSort": 1,
        "timeZone": "Europe/Amsterdam",
        "directParents": [],
        "directChildren": [
            "_______________________________legal",
            "_________install-on-phone-or-desktop",
            "______________________________donate",
            "________________________________blog",
            "_______________________________about",
            "_____________________my-app-settings"
        ]
    })
    lists.insert({
        "id": "_______________________________legal",
        "label": "setting",
        "title": [
            "Legal"
        ],
        "owner": "ZinZen",
        "subCountMaybe": "3",
        "subCountPromised": "0",
        "subCountDone": "0",
        "subCountNever": "0",
        "status": ["maybe"],
        "duration": "0",
        "createdDT": [
            "2021-08-12T15:24:06.702Z"
        ],
        "start": "2021-08-12T15:24:05.136Z",
        "tags": [
            "4"
        ],
        "updatedDT": [
            "2021-08-12T15:24:03.602Z",
            "2021-08-12T15:24:06.702Z"
        ],
        "commands": ["setting"],
        "statusSort": 1,
        "timeZone": "Europe/Amsterdam",
        "directParents": ["____________________________settings"],
        "directChildren": [
            "_____________________________Privacy",
            "____________________terms-of-service",
            "________open-source-acknowledgements"
        ]
    })
    lists.insert({
        "id": "_________install-on-phone-or-desktop",
        "label": "setting",
        "title": [
            "Install on phone or desktop"
        ],
        "owner": "ZinZen",
        "subCountMaybe": "3",
        "subCountPromised": "0",
        "subCountDone": "0",
        "subCountNever": "0",
        "status": ["maybe"],
        "duration": "0",
        "createdDT": [
            "2021-08-12T15:24:06.702Z"
        ],
        "start": "2021-08-12T15:24:05.136Z",
        "tags": [
            "4"
        ],
        "updatedDT": [
            "2021-08-12T15:24:03.602Z",
            "2021-08-12T15:24:06.702Z"
        ],
        "commands": ["setting"],
        "statusSort": 1,
        "timeZone": "Europe/Amsterdam",
        "directParents": ["____________________________settings"],
        "directChildren": [
            "_________________install-on-computer",
            "__________________install-on-android",
            "___________________install-on-iphone"
        ]
    })
    lists.insert({
        "id": "______________________________donate",
        "label": "setting",
        "title": [
            "Donate"
        ],
        "owner": "ZinZen",
        "subCountMaybe": "0",
        "subCountPromised": "0",
        "subCountDone": "0",
        "subCountNever": "0",
        "status": ["maybe"],
        "duration": "0",
        "createdDT": [
            "2021-08-12T15:24:06.702Z"
        ],
        "start": "2021-08-12T15:24:05.136Z",
        "tags": [
            "4"
        ],
        "updatedDT": [
            "2021-08-12T15:24:03.602Z",
            "2021-08-12T15:24:06.702Z"
        ],
        "commands": ["setting"],
        "url": ["https://www.gofundme.com/f/deliver-purpose-with-an-app-for-keeping-promises/donate"],
        "statusSort": 1,
        "timeZone": "Europe/Amsterdam",
        "directParents": ["____________________________settings"],
        "directChildren": []
    })
    lists.insert({
        "id": "________________________________blog",
        "label": "setting",
        "title": [
            "Blog"
        ],
        "owner": "ZinZen",
        "subCountMaybe": "0",
        "subCountPromised": "0",
        "subCountDone": "0",
        "subCountNever": "0",
        "status": ["maybe"],
        "duration": "0",
        "createdDT": [
            "2021-08-12T15:24:06.702Z"
        ],
        "start": "2021-08-12T15:24:05.136Z",
        "tags": [
            "4"
        ],
        "updatedDT": [
            "2021-08-12T15:24:03.602Z",
            "2021-08-12T15:24:06.702Z"
        ],
        "commands": ["setting"],
        "url": ["https://blog.ZinZen.me"],
        "statusSort": 1,
        "timeZone": "Europe/Amsterdam",
        "directParents": ["____________________________settings"],
        "directChildren": []
    })
    lists.insert({
        "id": "_______________________________about",
        "label": "setting",
        "title": [
            "About"
        ],
        "owner": "ZinZen",
        "subCountMaybe": "0",
        "subCountPromised": "0",
        "subCountDone": "0",
        "subCountNever": "0",
        "status": ["maybe"],
        "duration": "0",
        "createdDT": [
            "2021-08-12T15:24:06.702Z"
        ],
        "start": "2021-08-12T15:24:05.136Z",
        "tags": [
            "4"
        ],
        "updatedDT": [
            "2021-08-12T15:24:03.602Z",
            "2021-08-12T15:24:06.702Z"
        ],
        "commands": ["setting"],
        "url": ["https://ZinZen.me/about.html"],
        "statusSort": 1,
        "timeZone": "Europe/Amsterdam",
        "directParents": ["____________________________settings"],
        "directChildren": []
    })
    lists.insert({
        "id": "_____________________my-app-settings",
        "label": "setting",
        "title": [
            "My app settings"
        ],
        "owner": "ZinZen",
        "subCountMaybe": "3",
        "subCountPromised": "0",
        "subCountDone": "0",
        "subCountNever": "0",
        "status": ["maybe"],
        "duration": "0",
        "createdDT": [
            "2021-08-12T15:24:06.702Z"
        ],
        "start": "2021-08-12T15:24:05.136Z",
        "tags": [
            "4"
        ],
        "updatedDT": [
            "2021-08-12T15:24:03.602Z",
            "2021-08-12T15:24:06.702Z"
        ],
        "commands": ["setting"],
        "statusSort": 1,
        "timeZone": "Europe/Amsterdam",
        "directParents": ["____________________________settings"],
        "directChildren": [
            "_______________________look-and-feel",
            "_________________________danger-zone",
            "____________________________language",
            "_____________________________log-out"
        ]
    })
    lists.insert({
        "id": "_____________________________Privacy",
        "label": "setting",
        "title": [
            "Privacy statement"
        ],
        "owner": "ZinZen",
        "subCountMaybe": "0",
        "subCountPromised": "0",
        "subCountDone": "0",
        "subCountNever": "0",
        "status": ["maybe"],
        "duration": "0",
        "createdDT": [
            "2021-08-12T15:24:06.702Z"
        ],
        "start": "2021-08-12T15:24:05.136Z",
        "tags": [
            "4"
        ],
        "updatedDT": [
            "2021-08-12T15:24:03.602Z",
            "2021-08-12T15:24:06.702Z"
        ],
        "commands": ["setting"],
        "url": ["https://ZinZen.me/privacy.html"],
        "statusSort": 1,
        "timeZone": "Europe/Amsterdam",
        "directParents": ["_______________________________legal"],
        "directChildren": []
    })
    lists.insert({
        "id": "____________________terms-of-service",
        "label": "setting",
        "title": [
            "Terms of service"
        ],
        "owner": "ZinZen",
        "subCountMaybe": "0",
        "subCountPromised": "0",
        "subCountDone": "0",
        "subCountNever": "0",
        "status": ["maybe"],
        "duration": "0",
        "createdDT": [
            "2021-08-12T15:24:06.702Z"
        ],
        "start": "2021-08-12T15:24:05.136Z",
        "tags": [
            "4"
        ],
        "updatedDT": [
            "2021-08-12T15:24:03.602Z",
            "2021-08-12T15:24:06.702Z"
        ],
        "commands": ["setting"],
        "url": ["https://ZinZen.me/terms.html"],
        "statusSort": 1,
        "timeZone": "Europe/Amsterdam",
        "directParents": ["_______________________________legal"],
        "directChildren": []
    })
    lists.insert({
        "id": "________open-source-acknowledgements",
        "label": "setting",
        "title": [
            "Open source acknowledgements"
        ],
        "owner": "ZinZen",
        "subCountMaybe": "0",
        "subCountPromised": "0",
        "subCountDone": "0",
        "subCountNever": "0",
        "status": ["maybe"],
        "duration": "0",
        "createdDT": [
            "2021-08-12T15:24:06.702Z"
        ],
        "start": "2021-08-12T15:24:05.136Z",
        "tags": [
            "4"
        ],
        "updatedDT": [
            "2021-08-12T15:24:03.602Z",
            "2021-08-12T15:24:06.702Z"
        ],
        "commands": ["setting"],
        "url": ["https://ZinZen.me/acknowledgements.html"],
        "statusSort": 1,
        "timeZone": "Europe/Amsterdam",
        "directParents": ["_______________________________legal"],
        "directChildren": []
    })

    lists.insert({
        "id": "_________________install-on-computer",
        "label": "setting",
        "title": [
            "Install on computer (Windows, Apple, Linux)"
        ],
        "owner": "ZinZen",
        "subCountMaybe": "0",
        "subCountPromised": "0",
        "subCountDone": "0",
        "subCountNever": "0",
        "status": ["maybe"],
        "duration": "0",
        "createdDT": [
            "2021-08-12T15:24:06.702Z"
        ],
        "start": "2021-08-12T15:24:05.136Z",
        "tags": [
            "4"
        ],
        "updatedDT": [
            "2021-08-12T15:24:03.602Z",
            "2021-08-12T15:24:06.702Z"
        ],
        "commands": ["setting"],
        "statusSort": 1,
        "timeZone": "Europe/Amsterdam",
        "directParents": ["_________install-on-phone-or-desktop"],
        "directChildren": []
    })

    lists.insert({
        "id": "__________________install-on-android",
        "label": "setting",
        "title": [
            "Install on android (Samsung, Xiaomi, other)"
        ],
        "owner": "ZinZen",
        "subCountMaybe": "0",
        "subCountPromised": "0",
        "subCountDone": "0",
        "subCountNever": "0",
        "status": ["maybe"],
        "duration": "0",
        "createdDT": [
            "2021-08-12T15:24:06.702Z"
        ],
        "start": "2021-08-12T15:24:05.136Z",
        "tags": [
            "4"
        ],
        "updatedDT": [
            "2021-08-12T15:24:03.602Z",
            "2021-08-12T15:24:06.702Z"
        ],
        "commands": ["setting"],
        "statusSort": 1,
        "timeZone": "Europe/Amsterdam",
        "directParents": ["_________install-on-phone-or-desktop"],
        "directChildren": []
    })

    lists.insert({
        "id": "___________________install-on-iphone",
        "label": "setting",
        "title": [
            "Install on iPhone (Apple)"
        ],
        "owner": "ZinZen",
        "subCountMaybe": "0",
        "subCountPromised": "0",
        "subCountDone": "0",
        "subCountNever": "0",
        "status": ["maybe"],
        "duration": "0",
        "createdDT": [
            "2021-08-12T15:24:06.702Z"
        ],
        "start": "2021-08-12T15:24:05.136Z",
        "tags": [
            "4"
        ],
        "updatedDT": [
            "2021-08-12T15:24:03.602Z",
            "2021-08-12T15:24:06.702Z"
        ],
        "commands": ["setting"],
        "statusSort": 1,
        "timeZone": "Europe/Amsterdam",
        "directParents": ["_________install-on-phone-or-desktop"],
        "directChildren": []
    })

    lists.insert({
        "id": "_______________________look-and-feel",
        "label": "setting",
        "title": [
            "Look and feel"
        ],
        "owner": "ZinZen",
        "subCountMaybe": "3",
        "subCountPromised": "0",
        "subCountDone": "0",
        "subCountNever": "0",
        "status": ["maybe"],
        "duration": "0",
        "createdDT": [
            "2021-08-12T15:24:06.702Z"
        ],
        "start": "2021-08-12T15:24:05.136Z",
        "tags": [
            "4"
        ],
        "updatedDT": [
            "2021-08-12T15:24:03.602Z",
            "2021-08-12T15:24:06.702Z"
        ],
        "commands": ["setting"],
        "statusSort": 1,
        "timeZone": "Europe/Amsterdam",
        "directParents": ["_____________________my-app-settings"],
        "directChildren": []
    })

    lists.insert({
        "id": "_________________________danger-zone",
        "label": "setting",
        "title": [
            "Danger zone"
        ],
        "owner": "ZinZen",
        "subCountMaybe": "1",
        "subCountPromised": "0",
        "subCountDone": "0",
        "subCountNever": "0",
        "status": ["maybe"],
        "duration": "0",
        "createdDT": [
            "2021-08-12T15:24:06.702Z"
        ],
        "start": "2021-08-12T15:24:05.136Z",
        "tags": [
            "4"
        ],
        "updatedDT": [
            "2021-08-12T15:24:03.602Z",
            "2021-08-12T15:24:06.702Z"
        ],
        "commands": ["setting"],
        "statusSort": 1,
        "timeZone": "Europe/Amsterdam",
        "directParents": ["_____________________my-app-settings"],
        "directChildren": []
    })

    lists.insert({
        "id": "____________________________language",
        "label": "setting",
        "title": [
            "Language"
        ],
        "owner": "ZinZen",
        "subCountMaybe": "1",
        "subCountPromised": "0",
        "subCountDone": "0",
        "subCountNever": "0",
        "status": ["maybe"],
        "duration": "0",
        "createdDT": [
            "2021-08-12T15:24:06.702Z"
        ],
        "start": "2021-08-12T15:24:05.136Z",
        "tags": [
            "4"
        ],
        "updatedDT": [
            "2021-08-12T15:24:03.602Z",
            "2021-08-12T15:24:06.702Z"
        ],
        "commands": ["setting"],
        "statusSort": 1,
        "timeZone": "Europe/Amsterdam",
        "directParents": ["_____________________my-app-settings"],
        "directChildren": []
    })

    lists.insert({
        "id": "_____________________________log-out",
        "label": "setting",
        "title": [
            "Log out"
        ],
        "owner": "ZinZen",
        "subCountMaybe": "0",
        "subCountPromised": "0",
        "subCountDone": "0",
        "subCountNever": "0",
        "status": ["maybe"],
        "duration": "0",
        "createdDT": [
            "2021-08-12T15:24:06.702Z"
        ],
        "start": "2021-08-12T15:24:05.136Z",
        "tags": [
            "4"
        ],
        "function": ["logOut()"],
        "updatedDT": [
            "2021-08-12T15:24:03.602Z",
            "2021-08-12T15:24:06.702Z"
        ],
        "commands": ["setting"],
        "statusSort": 1,
        "timeZone": "Europe/Amsterdam",
        "directParents": ["_____________________my-app-settings"],
        "directChildren": []
    })

}

function goToSetting(selectedGoalId) {
    console.log("inside goToSetting")
    let setting = lists.by('id', selectedGoalId)
    console.log("setting:", setting)
    if (setting.function != undefined) {
        switch (setting.function[0]) {
            case "logOut()":
                logOut()
                return
                break;
            default:
                console.log("function not recognized:", setting.function[0])
                return
                break;
        }
    }
    if (setting.url != undefined) {
        window.open(setting.url[0], '_blank')
    } else {
        goTo(selectedGoalId)
    }
}

function logOut() {
    console.log("log out")
    let redirectURL = "https://auth.zinzen.me/logout?response_type=code&client_id=" + _config.appClientId +
        "&redirect_uri=" + _config.redirectURI +
        "&state=" + sessionStorage.getItem("pkce_state") +
        "&scope=email+openid"
    sessionStorage.clear()
    location.href = redirectURL
}


let commandDict = {
    contact: ['Contact'],
    sharepublic: ['SharePublic'],
    shareanonymous: ['ShareAnonymous'],
    goup: ['GoUp'],
    up: ['GoUp'],
    today: ['Today'],
    tomorrow: ['Tomorrow'],
    monday: ['Monday'],
    tuesday: ['Tuesday'],
    wednesday: ['Wednesday'],
    thursday: ['Thursday'],
    friday: ['Friday'],
    saturday: ['Saturday'],
    who: ['Who'],
    sharewith: ['ShareWith:'],
    goto: ['Goto:'],
    copyto: ['CopyTo:'],
    copyallto: ['CopyAllTo:'],
    moveto: ['MoveTo:'],
    moveallto: ['MoveAllTo:'],
    repeatsevery: ['RepeatsEvery:'],
    suggestto: ['SuggestTo:'],
    this: ['This:'],
    next: ['Next:'],
    after: ['After:'],
    before: ['Before:'],
    finish: ['Finish:'],
    start: ['Start:'],
    emotion: ['Emotion:'],
    waitfor: ['WaitFor:'],
    dependson: ['DependsOn:'],
    language: ['Language:']
}

let wordDict = {
    www: ['www.', 'https://www.'],
    zz: ['ZinZen'],
    zinzen: ['ZinZen'],
    'https://': ['https://', 'https://www.'],
    pepper: ['🌶️'],
    spice: ['🌶️'],
    call: ['📞', '📱', '☎️']
}

function parseCommand(command) {
    if (getLastWord(command.title) == "") {
        return command
    }

    command.suggestedCommands = []
    let word = getLastWord(command.title).toLowerCase()

    if (command.commandPressed.length > 0) {
        parseCommandPressed(command)
        return command
    }

    if (command.wordPressed.length > 0) {
        parseWordPressed(command)
        return command
    }

    if (isURL(word)) {
        if (getLeftMatches('https://', command.commands).includes(getLastWord(command.title))) {
            //existing command already matches lastWord title so suggest nothing
        } else {
            command.suggestedCommands.push(getLastWord(command.title)) // don't use word as lowercased
        }
    }

    if (!isNaN(word)) {
        console.log("is int:", word)
        command.suggestedCommands.push(word + "...")
        command.suggestedCommands.push('Repeat ' + word + 'x')
        command.suggestedCommands.push('Takes ' + word + '...')
    }

    if (word.length > 3) {
        if (word.substr(word.length - 3) == "...") {
            console.log('multi command')
            let preWord = word.substr(0, word.length - 3)
            console.log("preword:", preWord)
            if (!isNaN(preWord)) {
                console.log("preWord is a number")
                console.log("pre-preWord:", getLastWord(command.title.substr(0, command.title.length - word.length)))
                command.suggestedCommands = command.suggestedCommands.concat(['days', 'hours', 'minutes', 'months', 'weeks', 'years'])
            }
        }
    }

    //if word is phone number, suggest command for that phone number unless already (active and same number)
    //if word is email, suggest command for that email unless already (active and same email)

    if (word.length > 0 && word.substr(word.length - 1, 1) == " ") {
        // we're at the start of typing a brand new command - or ready for saving
        // do a best-guess suggestion based on previous commands (if any)
        return command
    }

    console.log("suggestedCommands before:", command.suggestedCommands)
    command.suggestedCommands = command.suggestedCommands.concat(getSuggestionsFor(word, commandDict))
    command.suggestedWords = getSuggestionsFor(word, wordDict)

    return command
}

function isURL(word) {
    if (word.length > 8 && (
        word.substr(0, 8) == "https://" ||
        word.substr(0, 2) == "www")) {
        return true
    }
    return false
}

function beautifyHTTPInTitle(command) {
    let newHTTPWord = command.commandPressed[0]
    newHTTPWord = newHTTPWord.substr(8)
    if (newHTTPWord.substr(newHTTPWord.length - 5) == ".html") {
        newHTTPWord = newHTTPWord.substr(0, newHTTPWord.length - 5)
    }
    command.title = command.title.replace(command.commandPressed[0], newHTTPWord)
}

function parseCommandPressed(command) {
    if (isURL(command.commandPressed[0])) {
        let existingURLs = getLeftMatches('https://', command.commands)
        console.log("found existing URLs:", existingURLs)
        existingURLs.forEach(match => { command.commands.splice(command.commands.indexOf(match), 1) })
        beautifyHTTPInTitle(command)
        command.commands.push(command.commandPressed[0])
        command.title += ' '
        command.commandPressed = []
        command.suggestedCommands = []
        return command
    }
    switch (command.commandPressed[0]) {
        case "dummy":
            break;
        case "Today":
            //save/replace as Date:... ?
            command.commands.push(command.commandPressed[0])
            break;
        case "Tomorrow":
            //save/replace as Date:... ?
            command.commands.push(command.commandPressed[0])
            break;
        default:
            let errorMessage = "Command " + command.commandPressed[0] + " not found..."
            throw new Error(errorMessage)
    }
    popLastWordInTitle(command)
    command.commandPressed = []
    command.suggestedCommands = []
    return command
}

function popLastWordInTitle(command) {
    let wordArray = command.title.split(' ')
    wordArray.pop()
    command.title = wordArray.join(' ')
    command.title += ' '
}

function parseWordPressed(command) {
    let wordArray = command.title.split(' ')
    wordArray.pop()
    command.title = wordArray.join(' ')
    if (wordArray.length > 0) {
        command.title += ' '
    }
    command.title += command.wordPressed
    if (command.wordPressed[0] != 'https://' &&
        command.wordPressed[0] != 'https://www.') {
        command.title += ' '
    }
    command.wordPressed = []
}

function getSuggestionsFor(word, dict) {
    let matchArray = getLeftMatches(word, Object.keys(dict))
    let result = []
    if (matchArray.length > 0) {
        console.log("left matches found:", matchArray)
        matchArray.forEach(match => {
            result = result.concat(dict[match])
        });
    }
    return [...new Set(result)] //make items in result array unique
}

function getLeftMatches(word, wordsArray) {
    let matches = wordsArray.filter(wordToMatchOn => wordToMatchOn.startsWith(word))
    return matches
}

function getPartialMatches(word, wordsArray) {
    let matches = []
    let matchLength = word.length

    let loopProtection = 0
    while (matchLength > 0 && loopProtection < 100) {
        let currentLengthMatches = wordsArray.filter(wordInArray => wordInArray.includes(word.substr(0, matchLength)))
        if (currentLengthMatches.length > 0) {
            //Todo make the matching letters bold with <b></b> - will render correctly in the button
            matches = matches.concat(currentLengthMatches)
            break
        }
        loopProtection++
        matchLength--
    }
    return matches
}

function getLastWord(title) {
    let wordsArray = title.split(" ")
    if (wordsArray[wordsArray.length - 1] == '') {
        wordsArray.pop()
    }
    if (wordsArray.length > 0) {
        return wordsArray[wordsArray.length - 1]
    } else {
        return ''
    }
}