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

    let parentsHTML = ``
    if (inputCommand.directParents != undefined) {
        inputCommand.directParents.forEach(parent => {
            let parentList = goals.by('id', parent)
            if (parentList.title != undefined && parentList.tags != undefined) {
                parentsHTML += '<span class="badge m-1 selected-parents" style="color: var(--foreground-color);background-color: var(--card' + parentList.tags[0] + ') !important;" id=modal-parent-' + parentList.id + '>' + parentList.title + '</span>'
            }
        })
    }
    $("#selected-parents").html(parentsHTML)

    let selectedCommands = ``
    newInputCommand.commands.forEach(command => {
        selectedCommands += '<span class="badge bg-secondary m-1 selected-command">' + command + '</span>'
    });
    $("#selected-commands").html(selectedCommands)

    let suggestedCommands = `Suggested commands: `
    newInputCommand.suggestedCommands.forEach(suggestionSet => {
        suggestionSet.forEach(suggestion => {
            suggestedCommands += '<button type="button" class="btn btn-outline-secondary btn-sm m-1 command-suggestion">' + suggestion + '</button>'
        })
    });
    $("#suggested-commands").html(suggestedCommands)

    let suggestedWords = `Suggested words: `
    newInputCommand.suggestedWords.forEach(suggestionSet => {
        suggestionSet.forEach(suggestion => {
            suggestedWords += '<button type="button" class="btn btn-outline-secondary btn-sm m-1 word-suggestion">' + suggestion + '</button>'
        })
    });
    $("#suggested-words").html(suggestedWords)
}

function updateModalUI() {
    switch ($("#myModal").data("modalType")) {
        case "add":
            updateModalAddUI()
            break;
        case "moment":

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
        case "moment":
            setSkeletonHTMLForMoment(id)
            updateModalUI()
            break;
        default:
            console.log("modalType " + modalType + " not found")
            break;
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
    if (document.documentElement.getAttribute("data-theme") != settings.find({ "setting": "screenMode" })[0].value) {
        document.documentElement.setAttribute("data-theme", settings.find({ "setting": "screenMode" })[0].value)
    }
}

function setSkeletonHTMLForMoment(id) {
    console.log("inside setSkeletonHTMLForMoment...")

    let bodyHTML = `
    <div class="row emo-title-row" id="emo-title-row">
        <div class="col">
            <h4 class="">Hoe voel je je nu?</h4>
        </div>
    </div>
    `

    bodyHTML += `    
    <div class="row" id="emo-buttons-row">
      <div class="col" id="emo-buttons-col">
        emo buttons
      </div>
    </div>`

    bodyHTML += `
    <div class="row mt-2 d-none" id="next-row">
      <div class="col m-1">
        <button type="button" class="btn btn-outline-primary" id="go-to-mind-button">Next</button>
      </div>
      <div class=" col m-1">
        <button type="button" class="btn btn-outline-primary" id="modal-cancel-button">Cancel</button>
      </div>      
    </div>    
    `
    $("#modal-body").html(bodyHTML)
    $("#myModal").on('shown.bs.modal', function () {

    });
}


function setSkeletonHTMLForAdd(id) {
    console.log("inside setSkeletonHTMLForAdd...")
    let headerHTML = `<h4 class="modal-title ms-3">Add or search</h4>`
    $("#modal-header-content").html(headerHTML)
    let bodyHTML = ``
    bodyHTML += `    
    <div class="row" id="parents-row">
      <div class="col">
        <div class="" id="selected-parents">
        </div>
      </div>
    </div>`
    bodyHTML += `
    <div class="row" id="input-row">
      <div class="col">
        <div class="m-1">
            <input class="form-control" type="text" id="inputCommand" placeholder="Type een doel..." name="command" required autofocus autocomplete="off">
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
      <div class=" col m-1">
        <button type="button" class="btn btn-outline-primary" id="modal-cancel-button">Cancel</button>
      </div>
    </div>  
    <div class="row mt-2 d-none" id="save-row">
      <div class="col m-1">
        <button type="button" class="btn btn-outline-primary" id="save-a-goal-button">Save</button>
      </div>
      <div class=" col m-1">
        <button type="button" class="btn btn-outline-primary" id="modal-cancel-button">Cancel</button>
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
        directParents: [],
        commands: new Set(),
        suggestedCommands: [],
        suggestedWords: []
    }
    let goal = goals.by('id', id)
    console.log("goals:", goal)
    if (goal != undefined) {
        inputCommand.title = goal.title
        if (goal.commands != undefined && goal.commands.length != 0) {
            inputCommand.commands = new Set(goal.commands.split(','))
        }
        if (goal.directParents != undefined) {
            inputCommand.directParents = goal.directParents
        }
        $("#add-row").addClass('d-none') //custom workaround because can't change text of button inside modal somehow
        $("#save-row").removeClass('d-none')
        let headerHTML = `<h4 class="modal-title">Editing: ` + goal.title.substring(0, 10) + `...</h4>`
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

        case "setting":
            goalSvg = '<svg id="svg-circle-' + id + '" class="icons" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36">\
            <path stroke="#959595" fill="#959595" fill-rule="evenodd" d="M7.875 2.292a.125.125 0 00-.032.018A7.24 7.24 0 004.75 8.25a7.247 7.247 0 003.654 6.297c.57.327.982.955.941 1.682v.002l-.317 6.058a.75.75 0 11-1.498-.078l.317-6.062v-.004c.006-.09-.047-.215-.188-.296A8.747 8.747 0 013.25 8.25a8.74 8.74 0 013.732-7.169 1.547 1.547 0 011.709-.064c.484.292.809.835.809 1.46v4.714a.25.25 0 00.119.213l2.25 1.385c.08.05.182.05.262 0l2.25-1.385a.25.25 0 00.119-.213V2.478c0-.626.325-1.169.81-1.461a1.547 1.547 0 011.708.064 8.74 8.74 0 013.732 7.17 8.747 8.747 0 01-4.41 7.598c-.14.081-.193.206-.188.296v.004l.318 6.062a.75.75 0 11-1.498.078l-.317-6.058v-.002c-.041-.727.37-1.355.94-1.682A7.247 7.247 0 0019.25 8.25a7.24 7.24 0 00-3.093-5.94.125.125 0 00-.032-.018l-.01-.001c-.003 0-.014 0-.031.01-.036.022-.084.079-.084.177V7.19a1.75 1.75 0 01-.833 1.49l-2.25 1.385a1.75 1.75 0 01-1.834 0l-2.25-1.384A1.75 1.75 0 018 7.192V2.477c0-.098-.048-.155-.084-.176a.062.062 0 00-.031-.011l-.01.001z">\
            </path></svg>'
            break;

        case "suggestion":
            goalSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36">\
            <path stroke="#959595" fill="#959595" d="M10.97 8.265a1.45 1.45 0 00-.487.57.75.75 0 01-1.341-.67c.2-.402.513-.826.997-1.148C10.627 6.69 11.244 6.5 12 6.5c.658 0 1.369.195 1.934.619a2.45 2.45 0 011.004 2.006c0 1.033-.513 1.72-1.027 2.215-.19.183-.399.358-.579.508l-.147.123a4.329 4.329 0 00-.435.409v1.37a.75.75 0 11-1.5 0v-1.473c0-.237.067-.504.247-.736.22-.28.486-.517.718-.714l.183-.153.001-.001c.172-.143.324-.27.47-.412.368-.355.569-.676.569-1.136a.953.953 0 00-.404-.806C12.766 8.118 12.384 8 12 8c-.494 0-.814.121-1.03.265zM13 17a1 1 0 11-2 0 1 1 0 012 0z">\
            </path>\
                <path stroke="#959595" fill="#959595" fill-rule="evenodd" d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zM2.5 12a9.5 9.5 0 1119 0 9.5 9.5 0 01-19 0z">\
            </path>\
            </svg>'
            break;


        default:
            console.log("getGoalSvg status not handled.")
            break;
    }
    return goalSvg
}

function generateGoalHTML(properties) {
    console.log("generating goal HTML for properties:", properties)

    let goalId = properties.id
    console.log("goalId", goalId)
    console.log("tags", properties.tags)
    let tag = properties.tags[0]
    let cardStyle = "card" + tag
    $("#" + goalId).addClass(cardStyle) //Todo: What does this do? remove...?

    let status = properties.status
    $("#" + goalId).data("status", status) //Todo: remove if occurences replaced by properties.get("status")[0]

    let titleIcon = ""
    if (properties.url != undefined) {
        titleIcon = "🔗 "
    }
    // let directParents = properties.directParents //Todo
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

    var title = titleIcon + properties.title
    if (properties.title[settings.find({ "setting": "language" })[0].value] != undefined) {
        title = titleIcon + properties.title[settings.find({ "setting": "language" })[0].value]
    }

    let duration = 0
    if (properties.duration != undefined) {
        duration = properties.duration[0]
    }
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
    if (properties.subTitle && properties.subTitle != "") {
        subTitle += '<br />' + properties.subTitle
    }


    let goalSvg = getGoalSvg(status, goalId)

    //Todo: add directParents from relationships
    let parentRowAndColHTML = ''
    // if (directParents.length != 0) {
    //     // console.log("directParents for " + goalId + ":" + directParents)
    //     parentRowAndColHTML += '<div class="row" id="goal-parents-row-' +
    //         goalId +
    //         '">\
    //   <div class="col text-end" id="goal-parents-' +
    //         goalId +
    //         '">\
    // '
    //     if (directParents.length > 1) {
    //         directParents.forEach(function (parentId, index) {
    //             // console.log("getting parent for id:", parentId)
    //             let parent = goals.by('id', parentId)
    //             // console.log("parent:", parent)
    //             if (parent != undefined) {
    //                 parentRowAndColHTML += '<div class="parent-link" id="parent-link-' + parentId + '">' + parent.title + "</div>"
    //             }
    //         })
    //     }
    //     parentRowAndColHTML += '</div></div>'
    // }

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

function calculateCalendarFor(goalJSON, numberOfDaysToReturn, startingDayISO) {
    let schedulerOutput = {
        "day_schedule_table": [{
            "dnum": 1,
            "hnum": 1,
            "id": 0,
            "seq": 4,
            "tseq": 8,
            "status": 3
        }, {
            "dnum": 1,
            "hnum": 2,
            "id": 0,
            "seq": 5,
            "tseq": 8,
            "status": 3
        }, {
            "dnum": 1,
            "hnum": 3,
            "id": 0,
            "seq": 6,
            "tseq": 8,
            "status": 3
        }, {
            "dnum": 1,
            "hnum": 4,
            "id": 0,
            "seq": 7,
            "tseq": 8,
            "status": 3
        }, {
            "dnum": 1,
            "hnum": 5,
            "id": 0,
            "seq": 8,
            "tseq": 8,
            "status": 3
        }, {
            "dnum": 1,
            "hnum": 21,
            "id": 0,
            "seq": 1,
            "tseq": 8,
            "status": 1
        }, {
            "dnum": 1,
            "hnum": 22,
            "id": 0,
            "seq": 2,
            "tseq": 8,
            "status": 1
        }, {
            "dnum": 1,
            "hnum": 23,
            "id": 0,
            "seq": 3,
            "tseq": 8,
            "status": 1
        }, {
            "dnum": 2,
            "hnum": 1,
            "id": 0,
            "seq": 4,
            "tseq": 8,
            "status": 1
        }, {
            "dnum": 2,
            "hnum": 2,
            "id": 0,
            "seq": 5,
            "tseq": 8,
            "status": 1
        }, {
            "dnum": 2,
            "hnum": 3,
            "id": 0,
            "seq": 6,
            "tseq": 8,
            "status": 1
        }, {
            "dnum": 2,
            "hnum": 4,
            "id": 0,
            "seq": 7,
            "tseq": 8,
            "status": 1
        }, {
            "dnum": 2,
            "hnum": 5,
            "id": 0,
            "seq": 8,
            "tseq": 8,
            "status": 1
        }, {
            "dnum": 2,
            "hnum": 21,
            "id": 0,
            "seq": 1,
            "tseq": 8,
            "status": 1
        }, {
            "dnum": 2,
            "hnum": 22,
            "id": 0,
            "seq": 2,
            "tseq": 8,
            "status": 1
        }, {
            "dnum": 2,
            "hnum": 23,
            "id": 0,
            "seq": 3,
            "tseq": 8,
            "status": 1
        }, {
            "dnum": 3,
            "hnum": 1,
            "id": 0,
            "seq": 4,
            "tseq": 8,
            "status": 1
        }, {
            "dnum": 3,
            "hnum": 2,
            "id": 0,
            "seq": 5,
            "tseq": 8,
            "status": 1
        }, {
            "dnum": 3,
            "hnum": 3,
            "id": 0,
            "seq": 6,
            "tseq": 8,
            "status": 1
        }, {
            "dnum": 3,
            "hnum": 4,
            "id": 0,
            "seq": 7,
            "tseq": 8,
            "status": 1
        }, {
            "dnum": 3,
            "hnum": 5,
            "id": 0,
            "seq": 8,
            "tseq": 8,
            "status": 1
        }, {
            "dnum": 3,
            "hnum": 21,
            "id": 0,
            "seq": 1,
            "tseq": 8,
            "status": 1
        }, {
            "dnum": 3,
            "hnum": 22,
            "id": 0,
            "seq": 2,
            "tseq": 8,
            "status": 1
        }, {
            "dnum": 3,
            "hnum": 23,
            "id": 0,
            "seq": 3,
            "tseq": 8,
            "status": 1
        }, {
            "dnum": 4,
            "hnum": 1,
            "id": 0,
            "seq": 4,
            "tseq": 8,
            "status": 1
        }, {
            "dnum": 4,
            "hnum": 2,
            "id": 0,
            "seq": 5,
            "tseq": 8,
            "status": 1
        }, {
            "dnum": 4,
            "hnum": 3,
            "id": 0,
            "seq": 6,
            "tseq": 8,
            "status": 1
        }, {
            "dnum": 4,
            "hnum": 4,
            "id": 0,
            "seq": 7,
            "tseq": 8,
            "status": 1
        }, {
            "dnum": 4,
            "hnum": 5,
            "id": 0,
            "seq": 8,
            "tseq": 8,
            "status": 1
        }, {
            "dnum": 4,
            "hnum": 21,
            "id": 0,
            "seq": 1,
            "tseq": 8,
            "status": 1
        }, {
            "dnum": 4,
            "hnum": 22,
            "id": 0,
            "seq": 2,
            "tseq": 8,
            "status": 1
        }, {
            "dnum": 4,
            "hnum": 23,
            "id": 0,
            "seq": 3,
            "tseq": 8,
            "status": 1
        }, {
            "dnum": 5,
            "hnum": 1,
            "id": 0,
            "seq": 4,
            "tseq": 8,
            "status": 1
        }, {
            "dnum": 5,
            "hnum": 2,
            "id": 0,
            "seq": 5,
            "tseq": 8,
            "status": 1
        }, {
            "dnum": 5,
            "hnum": 3,
            "id": 0,
            "seq": 6,
            "tseq": 8,
            "status": 1
        }, {
            "dnum": 5,
            "hnum": 4,
            "id": 0,
            "seq": 7,
            "tseq": 8,
            "status": 1
        }, {
            "dnum": 5,
            "hnum": 5,
            "id": 0,
            "seq": 8,
            "tseq": 8,
            "status": 1
        }, {
            "dnum": 5,
            "hnum": 21,
            "id": 0,
            "seq": 1,
            "tseq": 8,
            "status": 1
        }, {
            "dnum": 5,
            "hnum": 22,
            "id": 0,
            "seq": 2,
            "tseq": 8,
            "status": 1
        }, {
            "dnum": 5,
            "hnum": 23,
            "id": 0,
            "seq": 3,
            "tseq": 8,
            "status": 1
        }, {
            "dnum": 6,
            "hnum": 1,
            "id": 0,
            "seq": 4,
            "tseq": 8,
            "status": 1
        }, {
            "dnum": 6,
            "hnum": 2,
            "id": 0,
            "seq": 5,
            "tseq": 8,
            "status": 1
        }, {
            "dnum": 6,
            "hnum": 3,
            "id": 0,
            "seq": 6,
            "tseq": 8,
            "status": 1
        }, {
            "dnum": 6,
            "hnum": 4,
            "id": 0,
            "seq": 7,
            "tseq": 8,
            "status": 1
        }, {
            "dnum": 6,
            "hnum": 5,
            "id": 0,
            "seq": 8,
            "tseq": 8,
            "status": 1
        }, {
            "dnum": 6,
            "hnum": 21,
            "id": 0,
            "seq": 1,
            "tseq": 8,
            "status": 1
        }, {
            "dnum": 6,
            "hnum": 22,
            "id": 0,
            "seq": 2,
            "tseq": 8,
            "status": 1
        }, {
            "dnum": 6,
            "hnum": 23,
            "id": 0,
            "seq": 3,
            "tseq": 8,
            "status": 1
        }, {
            "dnum": 7,
            "hnum": 1,
            "id": 0,
            "seq": 4,
            "tseq": 8,
            "status": 1
        }, {
            "dnum": 7,
            "hnum": 2,
            "id": 0,
            "seq": 5,
            "tseq": 8,
            "status": 1
        }, {
            "dnum": 7,
            "hnum": 3,
            "id": 0,
            "seq": 6,
            "tseq": 8,
            "status": 1
        }, {
            "dnum": 7,
            "hnum": 4,
            "id": 0,
            "seq": 7,
            "tseq": 8,
            "status": 1
        }, {
            "dnum": 7,
            "hnum": 5,
            "id": 0,
            "seq": 8,
            "tseq": 8,
            "status": 1
        }, {
            "dnum": 7,
            "hnum": 21,
            "id": 0,
            "seq": 1,
            "tseq": 8,
            "status": 1
        }, {
            "dnum": 7,
            "hnum": 22,
            "id": 0,
            "seq": 2,
            "tseq": 8,
            "status": 1
        }, {
            "dnum": 7,
            "hnum": 23,
            "id": 0,
            "seq": 3,
            "tseq": 8,
            "status": 1
        }],
        "error_table": [{
            "dnum": 1,
            "id": 2,
            "err_id": 1
        }, {
            "dnum": 2,
            "id": 2,
            "err_id": 1
        }, {
            "dnum": 7,
            "id": 2,
            "err_id": 1
        }]
    }
    return schedulerOutput // or store to in-memory db lokijs with handy API?
}

function getGoalJSON() {
    let goalJSON = {
        "goals":
            [
                {
                    "title": "Slaap",
                    "id": "84bddefd-ab71-2fad-bf85-88f11648c81d",
                    "order": 1,
                    "owner_id": 123,
                    "priority": 0,
                    "start_day": new Date(new Date().setUTCHours(0, 0, 0, 0)).toISOString(),
                    "finish_day": new Date(new Date(2021, 11, 26, 0, 0, 0).setUTCHours(0, 0, 0, 0)).toISOString(),
                    "duration_in_sec": 28800,
                    "start_time_min": 1260,
                    "finish_time_min": 480,
                    "allow_split": false,
                    "week_bitmap": makeWeekBitMap(["Daily"])
                },
                {
                    "title": "Prepare for meeting presetation at 11:00PM (on Mon, Tue & Wed)",
                    "id": "1abddefb-e19b-0bef-d125-9589f64b7a0a",
                    "order": 2,
                    "owner_id": 123,
                    "priority": 1,
                    "start_day": new Date(new Date().setUTCHours(0, 0, 0, 0)).toISOString(),
                    "finish_day": new Date(new Date(2021, 11, 26, 0, 0, 0).setUTCHours(0, 0, 0, 0)).toISOString(),
                    "duration_in_sec": 3600,
                    "start_time_min": 1380,
                    "finish_time_min": 0,
                    "allow_split": false,
                    "week_bitmap": makeWeekBitMap(["Mondays", "Tuesdays", "Wednesdays"])
                }]
    }
    return goalJSON
}

function getGoalJSONForCalendar() {
    let goalJSONFromDatabase = {
        "id": "84bddefd-ab71-2fad-bf85-88f11648c81d",
        "label": "goal",
        "title": ["74"],
        "owner": ["32bd8d40-a674-7d71-a510-c019ef1943ec"],
        "status": "setting",
        "duration": ["0"],
        "createdDT": ["2021-09-07T01:59:30.784Z"],
        "start": ["2021-09-07T01:59:31.447Z"],
        "tags": ["2"],
        "updatedDT": ["2021-09-07T01:59:30.784Z"],
        "timesOfDaysPref": ["0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1"],
        "statusSort": [1],
        "timeZone": ["Europe/Amsterdam"],
        "responseType": "specificNode",
        "directParents": ["1abddefb-e19b-0bef-d125-9589f64b7a0a"],
        "directChildren": [],
        "scheduledBeginISO": "none",
        "scheduledEndISO": "none",
        "subCountMaybe": 0,
        "subCountPromised": 0,
        "subCountDone": 0,
        "subCountNever": 0,
        "meta": { "revision": 0, "created": 1634014036776, "version": 0 },
        "$loki": 136
    }

    let goalJSON = getGoalJSON()

    goalJSON.goals.forEach(goal => {
        delete goal['title']
    })

    return goalJSON
}

function generateCalendarHTML() {
    let goalJSON = getGoalJSONForCalendar()
    let schedulerJSON = calculateCalendarFor(goalJSON, 1, new Date().toISOString())
    console.log("scheduler returned JSON:", schedulerJSON)

    let slotsForSelectedDay = schedulerJSON.day_schedule_table.filter(slot => slot.dnum == 1)
    console.log("slotsForSelectedDay:", slotsForSelectedDay)

    let calendarHTML = ``
    calendarHTML += generateProgressHTML(slotsForSelectedDay)
    calendarHTML += generateSlotsHTML(slotsForSelectedDay, getGoalJSON())

    $("#main-play").html(calendarHTML)
    $("#datepicker").datepicker({
        format: 'mm/dd/yyyy',
        startDate: '-3d'
    });
}

function activateCalendarPicker() {
    $("#progress-card").on("click", "#progress-header", function (event) {
        console.log("progress-header clicked...")

    })
}

function generateSlotsHTML(slotsForSelectedDay, goalJSON) {
    let slotsHTML = ``

    for (let hour = 0; hour < 24; hour++) {
        if (slotsForSelectedDay[hour] != undefined) {
            console.log("slotsForSelectedDay[hour].id", slotsForSelectedDay[hour].id)
            console.log("Goal:", goalJSON.goals[slotsForSelectedDay[hour].id])
            slotsHTML += generateSlotHTML(goalJSON.goals[slotsForSelectedDay[hour].id])
        }
    }

    return slotsHTML
}

function makeWeekBitMap(inputArray) {
    let result = 0
    inputArray.forEach(command => {
        switch (command) {
            case "Mondays":
                result += Math.pow(2, 7)
                break;
            case "Tuesdays":
                result += Math.pow(2, 6)
                break;
            case "Wednesdays":
                result += Math.pow(2, 5)
                break;
            case "Thursdays":
                result += Math.pow(2, 4)
                break;
            case "Fridays":
                result += Math.pow(2, 3)
                break;
            case "Saturdays":
                result += Math.pow(2, 2)
                break;
            case "Sundays":
                result += Math.pow(2, 1)
                break;
            case "Daily":
                result += Math.pow(2, 7) + Math.pow(2, 6) + Math.pow(2, 5) + Math.pow(2, 4) + Math.pow(2, 3) + Math.pow(2, 2) + Math.pow(2, 1)
                break;
            default:
        }
    })
    return result
}

function generateProgressHTML(slotsForSelectedDay) {
    let progressHTML = `
    <div class="card shadow-sm text-center mb-3 mx-auto" id="progress-card">
        <div class="card-header" id="progress-header" data-bs-toggle="collapse" data-bs-target="#datepicker" aria-expanded="false" aria-controls="datepicker">
            <h6>Today</h6>
            <div class="collapse" id="datepicker">
            </div>
        </div>
        <div class="card-body">
            <div class="progress">
    `
    let blocks = [
        { width: 10, color: "var(--card1)" },
        { width: 10, color: "var(--card1)" },
        { width: 10, color: "var(--card1)" },
        { width: 10, color: "var(--card1)" },
        { width: 10, color: "var(--card1)" },
        { width: 10, color: "var(--card1)" },
        { width: 10, color: "var(--card1)" },
        { width: 10, color: "var(--card3)" },
        { width: 10, color: "var(--card4)" },
        { width: 10, color: "var(--card5)" },
        { width: 10, color: "var(--card6)" },
        { width: 10, color: "var(--card5)" },

        { width: 10, color: "var(--card1)" },
        { width: 10, color: "var(--card1)" },
        { width: 10, color: "var(--card4)" },
        { width: 10, color: "var(--card5)" },
        { width: 10, color: "var(--card6)" },
        { width: 10, color: "var(--card7)" },
        { width: 10, color: "var(--card7)" },
        { width: 10, color: "var(--card7)" },
        { width: 10, color: "var(--card8)" },
        { width: 10, color: "var(--card9)" },
        { width: 10, color: "var(--card2)" },
        { width: 10, color: "var(--card4)" },

        { width: 10, color: "var(--card2)" },
        { width: 10, color: "var(--card3)" },
        { width: 10, color: "var(--card4)" },
        { width: 10, color: "var(--card5)" },
        { width: 10, color: "var(--card6)" },
        { width: 10, color: "var(--card7)" },
        { width: 10, color: "var(--card7)" },
        { width: 10, color: "var(--card7)" },
        { width: 10, color: "var(--card8)" },
        { width: 10, color: "var(--card9)" },
        { width: 10, color: "var(--card1)" },
        { width: 10, color: "var(--card1)" },
    ]

    let goalJSON = getGoalJSON()
    for (let hour = 0; hour < 24; hour++) {
        if (slotsForSelectedDay[hour] != undefined) {
            console.log("slotsForSelectedDay[hour].id", slotsForSelectedDay[hour].id)
            console.log("Goal:", goalJSON.goals[slotsForSelectedDay[hour].id])
        }
    }

    blocks.forEach(block => {
        progressHTML += `<div class="progress-bar bg-success" role="progressbar"
        style="width: ` + block.width + `%; background-color:` + block.color + ` !important;" aria-valuenow="` + block.width + `"
        aria-valuemin="0" aria-valuemax="100"></div>`
    })
    progressHTML += `
                </div>
            </div>
        </div>
    </div>`

    return progressHTML
}


function setScreenModeDark() {
    let screenModeSetting = settings.find({ "setting": "screenMode" })[0]
    screenModeSetting.value = "dark"
    settings.update(screenModeSetting)
    updateScreenMode()
};

function setScreenModeLight() {
    let screenModeSetting = settings.find({ "setting": "screenMode" })[0]
    screenModeSetting.value = "light"
    settings.update(screenModeSetting)
    updateScreenMode()
};

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


function getShortestPathToPersonFor(id) {
    //getShortestPathToPersonFor returns id + name for ancestor on shortest path to person
    //Todo: this is a stub implementation assuming non-circularity; waiting for more knowledge on shortest path graph algorithm    

    let currentVertex
    let shortestPath = []
    let safety = 0

    do {
        safety += 1
        currentVertex = goals.find({ id: id })[0]
        if (currentVertex == undefined) {
            throw Error('getShortestPathToPersonFor: getting goal but goal not found for id:', id)
        }
        shortestPath.unshift(currentVertex)
        let relationship = relationships.find({ childId: id })[0]
        if (relationship != undefined) {
            id = relationship.parentId
        }
    } while (safety < 10 && !(currentVertex.label == "person" || currentVertex.label == "settings-root" || currentVertex.label == "suggestions-root" || currentVertex.label == "feelings-root"))

    return shortestPath
}


function updateBreadcrumbUI() {
    console.log("inside updateBreadcrumbUI...")
    let parent = goals.find({ id: parentId })[0]
    let breadcrumbHTML = ''

    let ancestors = getShortestPathToPersonFor(parent.id)
    console.log("ancestors:", ancestors)
    ancestors.forEach((ancestor, index) => {
        console.log("ancestor:", ancestor)
        if (index != 0) {
            breadcrumbHTML += '>'
        }
        let title = ancestor.title
        if (ancestor.title[settings.find({ "setting": "language" })[0].value] != undefined) {
            title = ancestor.title[settings.find({ "setting": "language" })[0].value]
        }
        breadcrumbHTML += '<button type="button" class="breadcrumb-button btn btn-outline-secondary btn-sm" id="breadcrumbGoal-' + ancestor.id + '">' + title + '</button>'
    })
    $("#breadcrumb").html(breadcrumbHTML)
    $("#breadcrumbGoal-" + ancestors[ancestors.length - 1].id).addClass('active')
}

function updatePriority() {
    console.log("inside updatePriority()")
    let sortedChildrenArray = $("#main-promised").sortable("toArray")
    sortedChildrenArray.forEach((childId, index) => {
        let relationship = relationships.find({ parentId: parentId, childId: childId })[0]
        relationship.priority = index
        relationships.update(relationship)
    })
}

function loadSettings() {
    settings = repository.addCollection('settings', { unique: ['setting'] })
    settings.insert({ "setting": "screenMode", "value": "light" })
    settings.insert({ "setting": "language", "value": "en" })
}


function loadGoalsAndRelationship() {

    goals.insert({
        label: 'person',
        id: sessionId,
        title: { "en": "Me", "nl": "Ik" },
        parentId: '',
        status: 'maybe',
        start: (new Date()).toISOString(),
        duration: 3600 * 24 * 30,
        commands: ''
    })

    goals.insert({
        "id": "____________________________Feelings",
        "label": "feelings-root",
        "title": {
            "en": "Me",
            "nl": "Ik"
        },
        "owner": "ZinZen",
        "subCountMaybe": "3",
        "subCountPromised": "0",
        "subCountDone": "0",
        "subCountNever": "0",
        "status": "setting",
        "tags": [
            "4"
        ],
        "commands": "setting",
        "statusSort": 1
    })
    relationships.insert({ parentId: '', childId: "____________________________Feelings" })

    goals.insert({
        "id": "______________________________ZinZen",
        "label": "settings-root",
        "title": {
            "en": "ZinZen",
            "nl": "ZinZen"
        },
        "owner": "ZinZen",
        "subCountMaybe": "3",
        "subCountPromised": "0",
        "subCountDone": "0",
        "subCountNever": "0",
        "status": "setting",
        "tags": [
            "4"
        ],
        "commands": "setting",
        "statusSort": 1
    })
    relationships.insert({ parentId: '', childId: "______________________________ZinZen" })

    goals.insert({
        "id": "_____________________my-app-settings",
        "label": "setting",
        "title": {
            "en": "My settings",
            "nl": "Mijn instellingen"
        },
        "owner": "ZinZen",
        "subCountMaybe": "3",
        "subCountPromised": "0",
        "subCountDone": "0",
        "subCountNever": "0",
        "status": "setting",
        "tags": [
            "4"
        ],
        "commands": "setting",
        "statusSort": 1
    })
    goals.insert({
        "id": "_________install-on-phone-or-desktop",
        "label": "setting",
        "title": {
            "en": "Install on phone or desktop",
            "nl": "Installeren op telefoon of computer"
        },
        "owner": "ZinZen",
        "subCountMaybe": "3",
        "subCountPromised": "0",
        "subCountDone": "0",
        "subCountNever": "0",
        "status": "maybe",
        "tags": [
            "4"
        ],
        "commands": "setting",
        "statusSort": 1
    })
    goals.insert({
        "id": "______________________________donate",
        "label": "setting",
        "title": { "en": "Donate", "nl": "Doneren" },
        "owner": "ZinZen",
        "subCountMaybe": "0",
        "subCountPromised": "0",
        "subCountDone": "0",
        "subCountNever": "0",
        "status": "maybe",
        "tags": [
            "4"
        ],
        "commands": "setting",
        "url": ["https://www.gofundme.com/f/deliver-purpose-with-an-app-for-keeping-promises/donate"],
        "statusSort": 1
    })
    goals.insert({
        "id": "________________________________blog",
        "label": "setting",
        "title": { "en": "Blog", "nl": "Blog" },
        "owner": "ZinZen",
        "subCountMaybe": "0",
        "subCountPromised": "0",
        "subCountDone": "0",
        "subCountNever": "0",
        "status": "maybe",
        "tags": [
            "4"
        ],
        "commands": "setting",
        "url": ["https://blog.ZinZen.me"],
        "statusSort": 1
    })
    goals.insert({
        "id": "_______________________________about",
        "label": "setting",
        "title": { "en": "About us", "nl": "Over ons" },
        "owner": "ZinZen",
        "subCountMaybe": "0",
        "subCountPromised": "0",
        "subCountDone": "0",
        "subCountNever": "0",
        "status": "maybe",
        "tags": [
            "4"
        ],
        "commands": "setting",
        "url": ["https://ZinZen.me/about.html"],
        "statusSort": 1
    })
    goals.insert({
        "id": "_______________________________legal",
        "label": "setting",
        "title": { "en": "Legal", "nl": "Juridisch" },
        "owner": "ZinZen",
        "subCountMaybe": "3",
        "subCountPromised": "0",
        "subCountDone": "0",
        "subCountNever": "0",
        "status": "maybe",
        "tags": [
            "4"
        ],
        "commands": "setting",
        "statusSort": 1
    })

    relationships.insert({ parentId: "______________________________ZinZen", childId: "_____________________my-app-settings", priority: 0 })
    relationships.insert({ parentId: "______________________________ZinZen", childId: "_________install-on-phone-or-desktop", priority: 1 })
    relationships.insert({ parentId: "______________________________ZinZen", childId: "______________________________donate", priority: 2 })
    relationships.insert({ parentId: "______________________________ZinZen", childId: "________________________________blog", priority: 3 })
    relationships.insert({ parentId: "______________________________ZinZen", childId: "_______________________________about", priority: 4 })
    relationships.insert({ parentId: "______________________________ZinZen", childId: "_______________________________legal", priority: 5 })


    goals.insert({
        "id": "_______________________look-and-feel",
        "label": "setting",
        "title": { "en": "Look and feel", "nl": "Opmaak" },
        "owner": "ZinZen",
        "subCountMaybe": "2",
        "subCountPromised": "0",
        "subCountDone": "0",
        "subCountNever": "0",
        "status": "setting",
        "tags": [
            "4"
        ],
        "commands": "setting",
        "statusSort": 1
    })
    goals.insert({
        "id": "_________________import-export-reset",
        "label": "setting",
        "title": { "en": "Import / Export / Reset my data", "nl": "Import / Export / Vernietig mijn data" },
        "owner": "ZinZen",
        "subCountMaybe": "3",
        "subCountPromised": "0",
        "subCountDone": "0",
        "subCountNever": "0",
        "status": "setting",
        "tags": [
            "4"
        ],
        "commands": "setting",
        "statusSort": 1
    })
    goals.insert({
        "id": "__________________________sign-up-in",
        "label": "setting",
        "title": { "en": "Sign up / in", "nl": "Lid worden / Aanmelden" },
        "owner": "ZinZen",
        "subCountMaybe": "0",
        "subCountPromised": "0",
        "subCountDone": "0",
        "subCountNever": "0",
        "status": "maybe",
        "tags": [
            "4"
        ],
        "function": ["logOut()"],
        "commands": "setting",
        "statusSort": 1
    })

    relationships.insert({ parentId: "_____________________my-app-settings", childId: "_______________________look-and-feel", priority: 0 })
    relationships.insert({ parentId: "_____________________my-app-settings", childId: "__________________________sign-up-in", priority: 1 })
    relationships.insert({ parentId: "_____________________my-app-settings", childId: "_________________import-export-reset", priority: 2 })

    goals.insert({
        "id": "_________________install-on-computer",
        "label": "setting",
        "title": { "en": "Install on computer (Windows, Apple, Linux)", "nl": "Installeer op computer (Windows, Apple, Linux)" },
        "owner": "ZinZen",
        "subCountMaybe": "0",
        "subCountPromised": "0",
        "subCountDone": "0",
        "subCountNever": "0",
        "status": "setting",
        "tags": [
            "4"
        ],
        "commands": "setting",
        "statusSort": 1
    })

    goals.insert({
        "id": "__________________install-on-android",
        "label": "setting",
        "title": { "en": "Install on android (Samsung, Xiaomi, other)", "": "Instaleer op android (Samsung, Xiaomi, overig)" },
        "owner": "ZinZen",
        "subCountMaybe": "0",
        "subCountPromised": "0",
        "subCountDone": "0",
        "subCountNever": "0",
        "status": "setting",
        "tags": [
            "4"
        ],
        "commands": "setting",
        "statusSort": 1
    })

    goals.insert({
        "id": "___________________install-on-iphone",
        "label": "setting",
        "title": { "en": "Install on iPhone (Apple)", "nl": "Installeer op iPhone (Apple)" },
        "owner": "ZinZen",
        "subCountMaybe": "0",
        "subCountPromised": "0",
        "subCountDone": "0",
        "subCountNever": "0",
        "status": "setting",
        "tags": [
            "4"
        ],
        "commands": "setting",
        "statusSort": 1
    })

    relationships.insert({ parentId: "_________install-on-phone-or-desktop", childId: "_________________install-on-computer", priority: 0 })
    relationships.insert({ parentId: "_________install-on-phone-or-desktop", childId: "__________________install-on-android", priority: 1 })
    relationships.insert({ parentId: "_________install-on-phone-or-desktop", childId: "___________________install-on-iphone", priority: 2 })

    goals.insert({
        "id": "_____________________________Privacy",
        "label": "setting",
        "title": { "en": "Privacy statement", "nl": "Privacy verklaring" },
        "owner": "ZinZen",
        "subCountMaybe": "0",
        "subCountPromised": "0",
        "subCountDone": "0",
        "subCountNever": "0",
        "status": "maybe",
        "tags": [
            "4"
        ],
        "commands": "setting",
        "url": ["https://ZinZen.me/privacy.html"],
        "statusSort": 1
    })
    goals.insert({
        "id": "____________________terms-of-service",
        "label": "setting",
        "title": { "en": "Terms of service", "nl": "Algemene voorwaarden" },
        "owner": "ZinZen",
        "subCountMaybe": "0",
        "subCountPromised": "0",
        "subCountDone": "0",
        "subCountNever": "0",
        "status": "maybe",
        "tags": [
            "4"
        ],
        "commands": "setting",
        "url": ["https://ZinZen.me/terms.html"],
        "statusSort": 1
    })
    goals.insert({
        "id": "________open-source-acknowledgements",
        "label": "setting",
        "title": { "en": "Open source acknowledgements", "nl": "Open source erkenningen" },
        "owner": "ZinZen",
        "subCountMaybe": "0",
        "subCountPromised": "0",
        "subCountDone": "0",
        "subCountNever": "0",
        "status": "maybe",
        "tags": [
            "4"
        ],
        "commands": "setting",
        "url": ["https://ZinZen.me/acknowledgements.html"],
        "statusSort": 1
    })

    relationships.insert({ parentId: "_______________________________legal", childId: "_____________________________Privacy", priority: 0 })
    relationships.insert({ parentId: "_______________________________legal", childId: "____________________terms-of-service", priority: 1 })
    relationships.insert({ parentId: "_______________________________legal", childId: "________open-source-acknowledgements", priority: 2 })

    goals.insert({
        "id": "_________________________color-theme",
        "label": "setting",
        "title": { "en": "Color theme", "nl": "Kleuren thema" },
        "owner": "ZinZen",
        "subCountMaybe": "2",
        "subCountPromised": "0",
        "subCountDone": "0",
        "subCountNever": "0",
        "status": "setting",
        "tags": [
            "4"
        ],
        "updatedDT": [
            "2021-08-12T15:24:03.602Z"
        ],
        "commands": "setting",
        "statusSort": 1
    })
    goals.insert({
        "id": "____________________________language",
        "label": "setting",
        "title": { "en": "Language", "nl": "Taal" },
        "owner": "ZinZen",
        "subCountMaybe": "2",
        "subCountPromised": "0",
        "subCountDone": "0",
        "subCountNever": "0",
        "status": "setting",
        "tags": [
            "4"
        ],
        "commands": "setting",
        "statusSort": 1
    })

    relationships.insert({ parentId: "_______________________look-and-feel", childId: "_________________________color-theme", priority: 0 })
    relationships.insert({ parentId: "_______________________look-and-feel", childId: "____________________________language", priority: 1 })

    goals.insert({
        "id": "__________________________light-mode",
        "label": "setting",
        "title": { "en": "Light mode", "nl": "Lichte modus" },
        "owner": "ZinZen",
        "subCountMaybe": "0",
        "subCountPromised": "0",
        "subCountDone": "0",
        "subCountNever": "0",
        "status": "setting",
        "tags": [
            "4"
        ],
        "updatedDT": [
            "2021-08-12T15:24:03.602Z"
        ],
        "function": ["setScreenModeLight()"],
        "commands": "setting",
        "statusSort": 1
    })

    goals.insert({
        "id": "___________________________dark-mode",
        "label": "setting",
        "title": { "en": "Dark mode", "nl": "Donkere modus" },
        "owner": "ZinZen",
        "subCountMaybe": "0",
        "subCountPromised": "0",
        "subCountDone": "0",
        "subCountNever": "0",
        "status": "setting",
        "tags": [
            "4"
        ],
        "updatedDT": [
            "2021-08-12T15:24:03.602Z"
        ],
        "function": ["setScreenModeDark()"],
        "commands": "setting",
        "statusSort": 1
    })

    relationships.insert({ parentId: "_________________________color-theme", childId: "__________________________light-mode", priority: 0 })
    relationships.insert({ parentId: "_________________________color-theme", childId: "___________________________dark-mode", priority: 1 })


    goals.insert({
        "id": "_________________________suggestions",
        "label": "suggestions-root",
        "title": { "en": "Explore", "nl": "Ontdek" },
        "owner": "ZinZen",
        "subCountMaybe": "3",
        "subCountPromised": "0",
        "subCountDone": "0",
        "subCountNever": "0",
        "status": "suggestion",
        "tags": [
            "4"
        ],
        "commands": "suggestion",
        "statusSort": 1
    })
    relationships.insert({ parentId: '', childId: "_________________________suggestions" })

    goals.insert({
        "id": "________nature-and-environment-goals",
        "label": "suggestion",
        "title": { "en": "🌲 Nature and environment goals 🌌", "nl": "🌲 Natuur en omgeving doelen 🌌" },
        "owner": "ZinZen",
        "subCountMaybe": "0",
        "subCountPromised": "0",
        "subCountDone": "0",
        "subCountNever": "0",
        "status": "suggestion",
        "tags": [
            "7"
        ],
        "commands": "suggestion",
        "statusSort": 1
    })
    goals.insert({
        "id": "_______________mind-and-spirit-goals",
        "label": "suggestion",
        "title": { "en": "🧘 Mind and spirit goals ☯️", "nl": "🧘 Geest en ziel doelen ☯️" },
        "owner": "ZinZen",
        "subCountMaybe": "0",
        "subCountPromised": "0",
        "subCountDone": "0",
        "subCountNever": "0",
        "status": "suggestion",
        "tags": [
            "6"
        ],
        "commands": "suggestion",
        "statusSort": 1
    })
    goals.insert({
        "id": "___________growth-and-learning-goals",
        "label": "suggestion",
        "title": { "en": "🌱 Personal growth and learning goals 💡", "nl": "🌱 Persoonlijke groei en leer doelen 💡" },
        "owner": "ZinZen",
        "subCountMaybe": "0",
        "subCountPromised": "0",
        "subCountDone": "0",
        "subCountNever": "0",
        "status": "suggestion",
        "tags": [
            "5"
        ],
        "commands": "suggestion",
        "statusSort": 1
    })
    goals.insert({
        "id": "________________________career-goals",
        "label": "suggestion",
        "title": { "en": "🎯 Career goals", "nl": "🎯 Carrière doelen" },
        "owner": "ZinZen",
        "subCountMaybe": "0",
        "subCountPromised": "0",
        "subCountDone": "0",
        "subCountNever": "0",
        "status": "suggestion",
        "tags": [
            "2"
        ],
        "commands": "suggestion",
        "statusSort": 1
    })
    goals.insert({
        "id": "____________health-and-fitness-goals",
        "label": "suggestion",
        "title": { "en": "💪 Health and fitness goals 🏅 🏆", "nl": "💪 Gezondheid en fitness doelen 🏅 🏆" },
        "owner": "ZinZen",
        "subCountMaybe": "0",
        "subCountPromised": "0",
        "subCountDone": "0",
        "subCountNever": "0",
        "status": "suggestion",
        "tags": [
            "3"
        ],
        "commands": "suggestion",
        "statusSort": 1
    })
    goals.insert({
        "id": "__________________relationship-goals",
        "label": "suggestion",
        "title": { "en": "🥰 💖 Relationship goals 🧑‍🤝‍🧑", "nl": "🥰 💖 Relatie doelen 🧑‍🤝‍🧑" },
        "owner": "ZinZen",
        "subCountMaybe": "0",
        "subCountPromised": "0",
        "subCountDone": "0",
        "subCountNever": "0",
        "status": "suggestion",
        "tags": [
            "4"
        ],
        "commands": "suggestion",
        "statusSort": 1
    })

    relationships.insert({ parentId: "_________________________suggestions", childId: "__________________relationship-goals", priority: 0 })
    relationships.insert({ parentId: "_________________________suggestions", childId: "____________health-and-fitness-goals", priority: 1 })
    relationships.insert({ parentId: "_________________________suggestions", childId: "_______________mind-and-spirit-goals", priority: 2 })
    relationships.insert({ parentId: "_________________________suggestions", childId: "________________________career-goals", priority: 3 })
    relationships.insert({ parentId: "_________________________suggestions", childId: "________nature-and-environment-goals", priority: 4 })
    relationships.insert({ parentId: "_________________________suggestions", childId: "___________growth-and-learning-goals", priority: 5 })
}

function loadTranslations() {
    translations.insert(
        {
            "en": "Goals",
            "nl": "Doelen"
        })
    translations.insert(
        {
            "en": "Emotions",
            "nl": "Gevoelens"
        })
    translations.insert(
        {
            "en": "Time",
            "nl": "Tijd"
        })
    translations.insert(
        {
            "en": "Explore",
            "nl": "Ontdek"
        })

}

function changeLanguageTo(lang) {
    let languageSetting = settings.find({ "setting": "language" })[0]
    if (lang == "en" || lang == "nl") {
        languageSetting.value = lang;
        settings.update(languageSetting)
        $("#top-feelings-label").html(translations.find({ "en": "Emotions" })[0][lang])
        $("#top-goals-label").html(translations.find({ "en": "Goals" })[0][lang])
        $("#top-calendar-label").html(translations.find({ "en": "Time" })[0][lang])
        $("#top-explore-label").html(translations.find({ "en": "Explore" })[0][lang])
        updateUIChildrenFor(parentId)
        updateBreadcrumbUI()
    }
}

async function updateUIWith(child) {
    console.log("inside updateUIWith(child)...")
    console.log("handling child:", child)

    let id = child.id

    if (!$('#' + id).length) {
        // console.log("id not yet present, prepending")
        $("#add-a-goal").empty() //Empties the No lists here
        let goalHTML = `<div class="row goal card shadow-sm mb-2" id="` + id + `"></div>`
        $("#main-promised").prepend(goalHTML)
    }
    $("#" + id).html(generateGoalHTML(child))

    if ($("#myModal").data("idx") == id) {
        switch ($("#myModal").data("modalType")) {

            case "add":
                setSkeletonHTMLForAdd(id)
                updateModalUI()
                break;

            default:
        }


    }
}

function goToSetting(selectedGoalId) {
    console.log("inside goToSetting")
    let setting = goals.by('id', selectedGoalId)
    console.log("setting:", setting)
    if (setting.function != undefined) {
        switch (setting.function[0]) {
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

function handleCommand(selectedCommand) {
    let inputCommand = $("#inputCommand").data('inputCommand')
    console.log("command pressed:", selectedCommand)
    inputCommand.commands.add(selectedCommand)
    let indexOfCommand = inputCommand.suggestedCommands.findIndex(commandSet => commandSet.has(selectedCommand));
    console.log("command has index ", indexOfCommand)
    let wordsArray = getArrayFromTitle(inputCommand.title)
    console.log("wordsArray:", wordsArray)
    if (selectedCommand.substr(0, 4) == "flex") {
        wordsArray.splice(indexOfCommand, 2)
    } else {
        wordsArray.splice(indexOfCommand, 1)
    }
    inputCommand.title = wordsArray.join(' ')
    console.log("inputCommand after (not saved):", inputCommand)
    // $("#inputCommand").data('inputCommand', inputCommand)
    updateModalUI()
}

function getArrayFromTitle(title) {
    let wordsArray = title.split(" ")
    console.log("wordsArray before:", wordsArray)

    let hasTrailingSpace = false
    if (wordsArray[wordsArray.length - 1] == "") {
        hasTrailingSpace = true
    }

    wordsArray.forEach((word, index) => {
        if (word == '') {
            wordsArray.splice(index, 1) //remove word from array
            return
        }
    })

    if (hasTrailingSpace) {
        wordsArray.push([' '])
    }
    return wordsArray
}

let commandDict = {
    'daily': ['Daily'],
    'contact': ['Contact'],
    'share public': ['Share public'],
    'share anonymous': ['Share anonymous'],
    'go up': ['Go up'],
    'up': ['Go up'],
    'today': ['Today'],
    'tomorrow': ['Tomorrow'],

    'monday': ['Monday'],
    'tuesday': ['Tuesday'],
    'wednesday': ['Wednesday'],
    'thursday': ['Thursday'],
    'friday': ['Friday'],
    'saturday': ['Saturday'],

    'wednesdays': ['Wednesdays'],

    'who': ['Who'],
    'share with': ['Share with'],
    'go to': ['Go to'],
    'copy to': ['Copy to'],
    'copy all to': ['Copy all to'],
    'move to': ['Move to'],
    'move all to': ['Move all to'],
    'repeats every': ['Repeats every'],
    'suggest to': ['Suggest to'],
    'this': ['This'],
    'next': ['Next'],
    'after': ['After'],
    'before': ['Before'],
    'finish': ['Finish'],
    'start': ['Start'],
    'emotion': ['Emotion'],
    'wait for': ['Wait for'],
    'depends on': ['Depends on'],
    'nl': ['🇳🇱'],
    'us': ['🇺🇸'],
    'english': ['🇺🇸'],
    'gb': ['gb'],
    'fr': ['🇫🇷'],
    'cn': ['🇨🇳'],
    'es': ['🇪🇸'],
    'de': ['🇩🇪'],
    'please': ['🥺'],

    '-': ["Sad", "Afraid", "Frustrated", "Depressed", "Lonely", "Embarassed", "Stressed", "Demotivated", "Pessimistic"],
    '+': ["Happy", "Grateful", "Passionate", "Loved", "Proud", "Mindful", "Motivated", "Optimistic"]

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
    command.suggestedCommands = []
    command.suggestedWords = []

    addSuggestedCommands(command)

    return command
}

function addSuggestedCommands(command) {
    let wordsArray = command.title.split(" ")
    console.log("wordsArray before:", wordsArray)

    let hasTrailingSpace = false
    if (wordsArray[wordsArray.length - 1] == "") {
        hasTrailingSpace = true
    }

    wordsArray.forEach((word, index) => {
        if (word == '') {
            wordsArray.splice(index, 1) //remove word from array
            return
        }
    })


    wordsArray.forEach((word, index) => { //parse title left to right adding commands/words
        let commandsToSuggest = new Set()
        console.log("word " + index + ": '" + word + "'")

        //if word is phone number, suggest command for that phone number unless already (active and same number)
        //if word is email, suggest command for that email unless already (active and same email)

        if (isURL(word)) {
            if (!command.commands.has(word)) {
                commandsToSuggest.add(word)
            }
        }

        if (word.substr(0, 1) == "@") {
            if (!isNaN(word.substr(1, 2)) &&
                word.substr(1, 2) != "") {
                commandsToSuggest.add(word.substr(1, 2) + ":00")
            }
        }

        if (isDuration(word) &&
            ((index > 0 && wordsArray[index - 1] != 'flex') ||
                (index == 0))) {
            commandsToSuggest.add(word)
        }

        if (word == 'flex') {
            if (isDuration(wordsArray[index + 1])) {
                commandsToSuggest.add(word + " " + wordsArray[index + 1])
            }
        }

        if (!isNaN(word)) {
            console.log("word is int:", word)
        }

        commandsToSuggest = new Set([...commandsToSuggest, ...getSuggestionsFor(word, commandDict)])

        command.suggestedCommands[index] = commandsToSuggest

        command.suggestedWords[index] = new Set([...getSuggestionsFor(word, wordDict)])
    })

    console.log("wordsArray after:", wordsArray)

    command.title = wordsArray.join(" ")
    if (hasTrailingSpace && wordsArray.length != 0) {
        command.title += " "
    }

    if (wordsArray.length == 0) {
        // we're at the start of typing a brand new command - or ready for saving
        // do a best-guess suggestion based on previous commands (if any)
    }

    //possible that same command gets suggested twice for different words: ie copy to two places
    //in that case simplest and most probable is that only the command that acts on the first word gets shown/used
    //to implement this only commands that aren't already present get added
    //this also avoids having to make the commands unique at the end

    return
}

function isURL(word) {
    if (word.length > 8 && (
        word.substr(0, 8) == "https://" ||
        word.substr(0, 2) == "www")) {
        return true
    }
    return false
}

function isDuration(word) {
    if (!isNaN(word.substr(0, 1))) {
        if (word.substr(word.length - 1, 1) == 'h') {
            return true
        }
    }
    return false
}

function getSuggestionsFor(word, dict) {
    let matchArray = getLeftMatches(word.toLowerCase(), Object.keys(dict))
    let result = []
    if (matchArray.length > 0) {
        console.log("left matches found:", matchArray)
        matchArray.forEach(match => {
            result = result.concat(dict[match])
        });
    }
    return new Set(result) //make items unique
}

function getLeftMatches(word, wordsArray) {
    let matches = wordsArray.filter(wordToMatchOn => wordToMatchOn.startsWith(word.toLowerCase()))
    return matches
}
