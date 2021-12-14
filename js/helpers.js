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

function getParentIdsFor(id) {
    if (id == "") {
        return []
    }
    let relationshipsForIdAsChild = relationships.find({ childId: id })
    let result = []
    relationshipsForIdAsChild.forEach(relationship => {
        result.push(relationship.parentId)
    });
    return result
}

function getParentsFor(id) {
    if (id == "") {
        return goals.find({ id: parentId })
    }
    let parentIds = getParentIdsFor(id)
    let result = []
    parentIds.forEach(id => {
        result.push(goals.find({ id: id })[0])
    });
    return result
}


function updateModalAddUI() {
    let inputGoal = $("#inputGoal").data('inputGoal')
    console.log("refreshing for inputGoal:", inputGoal)

    let newinputGoal = parseCommand(inputGoal)
    console.log("newinputGoal:", newinputGoal)
    $("#inputGoal").data('inputGoal', newinputGoal)
    $("#inputGoal").val(newinputGoal.title[inputGoal.lang])
    $("#inputGoal").focus()
    //when to change modal title??

    let lang = settings.find({ "setting": "language" })[0].value

    let parentsHTML = ``
    getParentsFor(inputGoal.id).forEach(parent => {
        if (parent.title != undefined) {
            parentsHTML += '<span class="badge m-1 selected-parents" style="color: var(--foreground-color);background-color: var(--card' + getColorsFor(inputGoal.id) + ') !important;" id=modal-parent-' + parent.id + '>' + parent.title[lang] + '</span>'
        }
    })

    $("#selected-parents").html(parentsHTML)

    let selectedCommands = ``;
    if (inputGoal.durationString != undefined) {
        selectedCommands += '<span class="badge bg-secondary m-1 selected-command">duration ' + inputGoal.durationString + '</span>'
    }
    if (inputGoal.repeatString != undefined) {
        selectedCommands += '<span class="badge bg-secondary m-1 selected-command">repeat ' + inputGoal.repeatString + '</span>'
    }
    if (inputGoal.startStringsArray != undefined) {
        selectedCommands += '<span class="badge bg-secondary m-1 selected-command">start ' + inputGoal.startStringsArray + '</span>'
    }
    if (inputGoal.finishStringsArray != undefined) {
        selectedCommands += '<span class="badge bg-secondary m-1 selected-command">finish ' + inputGoal.finishStringsArray + '</span>'
    }

    $("#selected-commands").html(selectedCommands)

    let suggestedCommands = ``
    if (newinputGoal.suggestedCommands.length > 0 && newinputGoal.suggestedCommands[0].size > 0) {
        suggestedCommands = `Suggested commands: `
    }
    newinputGoal.suggestedCommands.forEach(suggestionSet => {
        suggestionSet.forEach(suggestion => {
            suggestedCommands += '<button type="button" class="btn btn-outline-secondary btn-sm m-1 command-suggestion">' + suggestion + '</button>'
        })
    });

    $("#calendar-feedback").html("Type number of hours to schedule on calendar.")
    if (suggestedCommands.search("duration") > -1) {
        $("#calendar-feedback").html("Click suggested duration command to schedule on calendar.")
    }
    if (selectedCommands.search("duration") > -1) {
        $("#calendar-feedback").html("Scheduled or not scheduled for x / y / z.")
    }

    calculateCalendar() //Todo: a little overkill to do this on every letter typed
    let tasks = calendar.tasks.filter(task => {
        return task.goal_id == inputGoal.$loki
    })
    if (tasks.length > 0) {
        let success = tasks.filter(task => {
            return task.task_status == "SCHEDULED"
        })
        $("#calendar-feedback").html("Scheduled " + success.length + "/" + tasks.length + " ; first on ...")
    }


    $("#suggested-commands").html(suggestedCommands)

    let suggestedWords = ``
    if (newinputGoal.suggestedWords.length > 0 && newinputGoal.suggestedWords[0].size > 0) {
        suggestedWords = `Suggested words: `
    }
    newinputGoal.suggestedWords.forEach(suggestionSet => {
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
            deleteMode = false
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

    let lang = settings.find({ "setting": "language" })[0].value

    let bodyHTML = `
    <div class="row emo-title-row" id="emo-title-row">
        <div class="col">
            <h4 class="">`+ translations.find({ "en": "How do you feel now?" })[0][lang] + `</h4>
        </div>
    </div>
    `
    "sadness-emotion"

    bodyHTML += `    
    <div class="row" id="emo-buttons-enjoyment-row">
        <div class="col text-center mt-3">🤗 `+ translations.find({ "en": "Happy" })[0][lang] + `</div>
    </div>
    <div class="row" id="emo-buttons-enjoyment-row">
      <div class="col text-center m-2" id="emo-enjoyment-buttons-col">
        `
    let enjoymentEmotions = translations.find({ "label": "enjoyment-emotion" })
    enjoymentEmotions.forEach(emotion => {
        bodyHTML += `<button type="button" class="btn btn-outline-secondary m-1 feeling" id="emotion-` + emotion.en + `">` + emotion[lang] + `</button>`
    })
    bodyHTML += `
      </div>
    </div>`

    bodyHTML += ` 
    <div class="row" id="emo-buttons-enjoyment-row">
        <div class="col text-center mt-3">😔 `+ translations.find({ "en": "Sad" })[0][lang] + `</div>
    </div>   
    <div class="row" id="emo-buttons-sadness-row">
      <div class="col text-center m-2" id="emo-buttons-sadness-col">
        `
    let sadnessEmotions = translations.find({ "label": "sadness-emotion" })
    sadnessEmotions.forEach(emotion => {
        bodyHTML += `<button type="button" class="btn btn-outline-secondary m-1 feeling" id="emotion-` + emotion.en + `">` + emotion[lang] + `</button>`
    })
    bodyHTML += `
      </div>
    </div>`

    bodyHTML += `
    <div class="row" id="emo-buttons-enjoyment-row">
        <div class="col text-center mt-3">😨 `+ translations.find({ "en": "Afraid" })[0][lang] + `</div>
    </div>  
    <div class="row" id="emo-buttons-fear-row">
      <div class="col text-center m-2" id="emo-buttons-fear-col">
        `
    let fearEmotions = translations.find({ "label": "fear-emotion" })
    fearEmotions.forEach(emotion => {
        bodyHTML += `<button type="button" class="btn btn-outline-secondary m-1 feeling" id="emotion-` + emotion.en + `">` + emotion[lang] + `</button>`
    })
    bodyHTML += `
      </div>
    </div>`

    bodyHTML += `
    <div class="row" id="emo-buttons-enjoyment-row">
        <div class="col text-center mt-3">😤😠 `+ translations.find({ "en": "Angry" })[0][lang] + `</div>
    </div>      
    <div class="row" id="emo-buttons-anger-row">
      <div class="col text-center m-2" id="emo-buttons-anger-col">
        `
    let angerEmotions = translations.find({ "label": "anger-emotion" })
    angerEmotions.forEach(emotion => {
        bodyHTML += `<button type="button" class="btn btn-outline-secondary m-1 feeling" id="emotion-` + emotion.en + `">` + emotion[lang] + `</button>`
    })
    bodyHTML += `
      </div>
    </div>`

    bodyHTML += `
    <div class="row" id="emo-buttons-enjoyment-row">
        <div class="col text-center mt-3">🤢 `+ translations.find({ "en": "Disgusted" })[0][lang] + `</div>
    </div>          
    <div class="row" id="emo-button-disgust-row">
      <div class="col text-center m-2" id="emo-buttons-disgust-col">
        `
    let disgustEmotions = translations.find({ "label": "disgust-emotion" })
    disgustEmotions.forEach(emotion => {
        bodyHTML += `<button type="button" class="btn btn-outline-secondary m-1 feeling" id="emotion-` + emotion.en + `">` + emotion[lang] + `</button>`
    })
    bodyHTML += `
      </div>
    </div>`

    bodyHTML += `
    <div class="row mt-2" id="next-row">
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
    let lang = settings.find({ "setting": "language" })[0].value

    let headerHTML = `<h4 class="modal-title ms-3">` + translations.find({ "en": "Add or search" })[0][lang] + `</h4>`
    $("#modal-header-content").html(headerHTML)
    let bodyHTML = ``
    bodyHTML += `
    <div class="row mt-2 d-none" id="save-row">
        <div class=" col m-1">
            <button type="button" class="btn btn-outline-primary" id="modal-cancel-button">Cancel</button>
        </div>      
        <div class="col m-1">
            <button type="button" class="btn btn-outline-primary" id="save-a-goal-button">Save</button>
        </div>
        <div class="col m-1" id="add-sub-button-col">
            <button type="button" class="btn btn-outline-primary" id="add-subgoal-button">Add sub</button>
        </div>
    </div>     
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
            <input class="form-control" type="text" id="inputGoal" placeholder="`+ translations.find({ "en": "Type a goal and the number of hours..." })[0][lang] + `" name="command" required autofocus autocomplete="off">
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
    <div class="row mt-2" id="calendar-feedback-row">
      <div class="col">
        <div class="" id="calendar-feedback">
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

    let titleObject = {}
    switch (lang) {
        case "en":
            titleObject.en = ''
            break;
        case "nl":
            titleObject.nl = ''
            break;
        default:
            throw ("language " + lang + " not implemented in switch")
    }


    let inputGoal = goals.find({ "id": id })[0]

    if (inputGoal == undefined) {
        inputGoal = {
            id: "",
            label: "goal",
            title: titleObject,
            status: "maybe",
            suggestedCommands: new Set(),
            suggestedWords: new Set(),
            lang: lang,
            start: Date.now()
        }
    } else {
        headerHTML = `<h4 class="modal-title">` + translations.find({ "en": "Edit" })[0][lang] + `: ` + inputGoal.title[lang].substring(0, 10) + `...</h4>`
    }

    if (inputGoal.id == "") {
        $("#add-sub-button-col").html(`
        <button type="button" class="btn btn-outline-primary btn-hidden" id="add-subgoal-buttonx">Add sub</button>
            `)
    }

    $("#modal-header-content").html(headerHTML)
    $("#add-row").addClass('d-none') //custom workaround because can't change text of button inside modal somehow
    $("#save-row").removeClass('d-none')

    $("#inputGoal").data('inputGoal', inputGoal)
    $("#myModal").on('shown.bs.modal', function () {
        $("#inputGoal").focus();
    });
    console.log("inputGoal after setSkeleton:", inputGoal)
}

function translate(englishText) {
    let lang = settings.find({ "setting": "language" })[0].value
    let translation = translations.find({ "en": englishText })
    if (translation[0] == undefined) {
        return "No translation..."
    } else {
        if (translation[0][lang] == undefined) {
            return "No tranlation for " + englishText + " for language " + lang + "..."
        } else {
            return translation[0][lang]
        }
    }
}

function generateSlotHTML(element) {
    // console.log("inside generateSlotHTML...")
    // console.log("slot data:", element)

    var slotId = element.goal_id

    // console.log("element for slotId ", slotId + ":" + element)

    //Todo: handle case for array of colors
    var color = element.colors[0]
    let cardStyle = "card" + color
    let status = "maybe"
    let goalId = element.goalId
    var title = element.title
    var begin = (new dayjs).startOf("day").add(element.begin, 'hour')
    var end = (new dayjs).startOf("day").add(element.end, 'hour')
    let sequenceNumberHTML = ""
    if (element.scheduledInTotal > 1) {
        sequenceNumberHTML = "(" + element.scheduledSequenceNumber + "/" + element.scheduledInTotal + ") "
    }

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

    //Todo: handle case for array of colors
    var color = element.goalColors
    let cardStyle = "card" + color
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

    if (relationships.find({ parentId: id })[0] != undefined || status == "folder") {
        goalSvg = '<svg id="svg-circle-' + id + '" class="icons" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36"><path path stroke="#959595" fill="#959595" fill-rule="evenodd" d="M3.75 4.5a.25.25 0 00-.25.25v14.5c0 .138.112.25.25.25h16.5a.25.25 0 00.25-.25V7.687a.25.25 0 00-.25-.25h-8.471a1.75 1.75 0 01-1.447-.765L8.928 4.61a.25.25 0 00-.208-.11H3.75zM2 4.75C2 3.784 2.784 3 3.75 3h4.971c.58 0 1.12.286 1.447.765l1.404 2.063a.25.25 0 00.207.11h8.471c.966 0 1.75.783 1.75 1.75V19.25A1.75 1.75 0 0120.25 21H3.75A1.75 1.75 0 012 19.25V4.75z"></path></svg>'
        return goalSvg
    }
    switch (status) {

        case "none":
            goalSvg = ''
            break;

        case "add":
            goalSvg = '<svg id="svg-circle-' + id + '" class="icons" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36"><path path stroke="#959595" fill="#959595" d="M12.75 7.75a.75.75 0 00-1.5 0v3.5h-3.5a.75.75 0 000 1.5h3.5v3.5a.75.75 0 001.5 0v-3.5h3.5a.75.75 0 000-1.5h-3.5v-3.5z"></path><path path stroke="#959595" fill="#959595" fill-rule="evenodd" d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zM2.5 12a9.5 9.5 0 1119 0 9.5 9.5 0 01-19 0z"></path></svg>'
            break;
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

        case "link":
            goalSvg = '<svg id="svg-circle-' + id + '" class="icons" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36"><path path stroke="#959595" fill="#959595"  d="M14.78 3.653a3.936 3.936 0 115.567 5.567l-3.627 3.627a3.936 3.936 0 01-5.88-.353.75.75 0 00-1.18.928 5.436 5.436 0 008.12.486l3.628-3.628a5.436 5.436 0 10-7.688-7.688l-3 3a.75.75 0 001.06 1.061l3-3z"></path><path path stroke="#959595" fill="#959595" d="M7.28 11.153a3.936 3.936 0 015.88.353.75.75 0 001.18-.928 5.436 5.436 0 00-8.12-.486L2.592 13.72a5.436 5.436 0 107.688 7.688l3-3a.75.75 0 10-1.06-1.06l-3 3a3.936 3.936 0 01-5.567-5.568l3.627-3.627z"></path></svg>'
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

function getColorsFor(id) {
    console.log("getColorsFor(id):", id)
    let relationshipsForIdAsChild = relationships.find({ childId: id })[0]
    console.log("relationships found:", relationshipsForIdAsChild)
    return ["1"]
}

function generateGoalHTML(properties) {
    console.log("generating goal HTML for properties:", properties)

    let shakeClass = ""
    if (deleteMode == true) {
        shakeClass = " shake-medium shake-constant "
    }

    let goalId = properties.id
    console.log("goalId", goalId)

    let color = getColorsFor(goalId)[0]
    if (properties.colors != undefined) {
        color = properties.colors[0]
    }

    let status = properties.status
    $("#" + goalId).data("status", status) //Todo: remove if occurences replaced by properties.get("status")[0]

    let titleIcon = ""
    if (properties.url != undefined) {
        titleIcon = "🔗 "
    }

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

    let title = titleIcon
    let lang = settings.find({ "setting": "language" })[0].value
    if (properties.title[lang] != undefined) {
        title += properties.title[lang]
    } else {
        switch (lang) {
            case "en":
                title += properties.title.nl
                break;
            case "nl":
                title += properties.title.en
                break;
            default:
                title += 'title not found...'
        }
    }

    let cardStyle = "card" + color
    $("#" + goalId).addClass(cardStyle) //Todo: What does this do? remove...?

    let subTitleIcon = ''
    let subCountTotal = 0
    let subCountMaybeAndPromised = 0
    let childrenRelations = relationships.find({ parentId: properties.id })
    console.log("childrenRelations:", childrenRelations)
    if (childrenRelations != undefined) {
        subCountTotal = childrenRelations.length
        childrenRelations.forEach(childRelation => {
            let child = goals.find({ id: childRelation.childId })[0]
            console.log("child found for count:", child)
            switch (child.status) {
                case "maybe":
                case "promised":
                    subCountMaybeAndPromised += 1
                    break;

                default:
                    break;

            }
        })
    }
    console.log("subCountMaybeAndPromised:", subCountMaybeAndPromised)
    console.log("subCountTotal:", subCountTotal)

    if (subCountMaybeAndPromised > 0) {
        subTitleIcon = subCountMaybeAndPromised + " / "
    }
    if (subCountTotal > 0) {
        subTitleIcon += subCountTotal
    }

    let subTitle = ''
    if (properties.subTitle && properties.subTitle != "") {
        subTitle += properties.subTitle
    }
    if (properties.durationString && properties.durationString != "") {
        subTitle += properties.durationString + " "
    }
    if (properties.repeatString && properties.repeatString != "") {
        subTitle += properties.repeatString + " "
    }

    let goalSvg = getGoalSvg(status, goalId)

    let returnHTML = `
          <div class="col" id="card-inners-` + goalId + `">
            <div class="row" id="icon-and-title-row-` + goalId + `">
                <div class="col-2 d-flex justify-content-center align-items-end circle-col" id="circle-col-` + goalId + `">
                    <div class="mr-3 status-icon`+ shakeClass + `" id="todo-circle-` + goalId + `">` + goalSvg + `</div>                    
                </div>
                <div class="col-10 d-flex" id="subtext-icon-` + goalId + `">
                    <div class="title d-flex icons" id="title-` + goalId + `">              
                        <div class="me-auto d-inline-block text-truncate title-text`+ shakeClass + `" id="title-text-` + goalId + `">` + title + `</div>
                    </div>
              </div>                
            </div>
            <div class="row" id="sub-title-row-` + goalId + `">
                <div class="col-2 d-flex justify-content-center circle-col" id="subtext-col-` + goalId + `">
                    <div class="icons sub-title`+ shakeClass + `" id="subtext-` + goalId + `">` + subTitleIcon + `</div>
                </div>
                <div class="col-10 d-flex" id="subtext-col-` + goalId + `">
                    <div class="icons sub-title`+ shakeClass + `" id="subtext-` + goalId + `">` + subTitle + `</div>
                </div>            
            </div>
          </div>
      `

    return returnHTML
}

function goToCalendar() {
    calculateCalendar()

    $("#calendarSlots").html(generateCalendarHTML())
    $("#main-calendar").removeClass('d-none')

    $("#main-quote").addClass('d-none')
    $("#main-buttons-row").addClass('d-none')
    $("#main-promised").addClass('d-none')

    $("#datepicker").datepicker({
        format: 'mm/dd/yyyy',
        startDate: '-3d'
    });
}

function getDurationFromStringIn(stringToParse, timeUnit) {
    switch (timeUnit) {
        case "h":
            if (stringToParse.substr(stringToParse.length - 1, 1) != "h") {
                console.error("attempting to getDurationFromStringIn:" + stringToParse + " with unit h, but not in h")
            }
            return parseInt(stringToParse.substr(0, stringToParse.length - 1))
            break;
        default:
            console.error("timeUnit " + timeUnit + " not handled.")
    }
}

function calculateCalendar() {
    let start = Date.now()
    calendar.tasks = []
    calendar.slots = []
    calendar.goals = []
    let goalsToAdd = goals.where(function (goal) {
        return (goal.durationString != undefined && (goal.status == "maybe" || goal.status == "promised"));
    });

    if (goalsToAdd.length == 0) {
        console.log("NO GOALS IN CALENDAR")
    }

    goalsToAdd.forEach(goal => {
        console.log("goal:", goal)
        let estimated_duration = getDurationFromStringIn(goal.durationString, "h")
        let goal_type
        switch (goal.repeatString) {
            case "daily":
                goal_type = "DAILY"
                break;
            case "weekly":
                goal_type = "WEEKLY"
                break;
            case "monthly":
                goal_type = "MONTLY"
                break;
            case "yearly":
                goal_type = "YEARLY"
                break;
            default:
                goal_type = "FIXED"
                break;
        }

        let goal_for_wasm = {
            id: goal.$loki,
            title: goal.title.en,
            estimated_duration: estimated_duration,
            effort_invested: 0,
            start: 0,
            finish: calendar.max_time_units,
            start_time: 0,
            goal_type: goal_type
        }

        if (goal.startStringsArray != undefined) {
            goal_for_wasm.start_time = parseInt(goal.startStringsArray[0].substr(0, 2))
        }

        if (goal.finishStringsArray != undefined) {
            goal_for_wasm.finish_time = parseInt(goal.finishStringsArray[0].substr(0, 2))
        }

        calendar.goals.push(goal_for_wasm)
    })

    let end = Date.now()
    console.log("update goals in calendar took:", (end - start) / 1000)
    // console.log("calendarInput:", calendar)

    start = Date.now()
    calendar = wasm_bindgen.load_calendar(calendar)
    end = Date.now()
    console.log("load and calculate goals in wasm took:", (end - start) / 1000)


    start = Date.now()
    //Todo: order slots in Rust
    calendar.slots.sort((a, b) => { return a.begin - b.begin }) // Could be faster in WASM? For now not noticeable so OK.
    // console.log("calendarOutput:", calendar)
    end = Date.now()
    // console.log("sorting slots and printing to console took:", (end - start) / 1000)

}


function generateImpossibleHTML() {
    let HTML = ``
    let impossibleTasks = calendar.tasks.filter(task => { return task.task_status == "IMPOSSIBLE" })
    // console.log("impossibleTasks:", impossibleTasks)
    let impossibleGoalIds = new (Set)
    impossibleTasks.forEach(task => {
        impossibleGoalIds.add(task.goal_id)
    })
    // console.log("impossible goal ids:", impossibleGoalIds)
    let impossibleGoals = calendar.goals.filter(goal => {
        return impossibleGoalIds.has(goal.id)
    })
    // console.log("impossible goals:", impossibleGoals)
    impossibleGoals.forEach(goal => {
        HTML += "! Issue scheduling " + goal.title + " x/y times<br />"
    })
    return HTML
}

function generateCalendarHTML() {
    // console.log("inside generateCalendarHTML()")
    let HTML = ``
    HTML += generateImpossibleHTML()
    HTML += generateSlotsHTML()

    return HTML
}

function activateCalendarPicker() {
    $("#progress-card").on("click", "#progress-header", function (event) {
        console.log("progress-header clicked...")

    })
}

function generateSlotsHTML() {
    let HTML = ``
    let days = []
    calendar.slots.forEach(slot => {
        // console.log("slot:", slot)

        let task = calendar.tasks.find(task => { return task.task_id == slot.task_id })
        // console.log("task:", task)
        slot.duration_to_schedule = task.duration_to_schedule
        slot.task_status = task.task_status

        let goal = calendar.goals.find(goal => { return goal.id == task.goal_id })
        // console.log("goal:", goal)
        slot.effort_invested = goal.effort_invested
        slot.estimated_duration = goal.estimated_duration
        slot.finish = goal.finish
        slot.finish_time = goal.finish_time
        slot.goal_type = goal.goal_type
        slot.goal_id = goal.id
        slot.start = goal.start
        slot.start_time = goal.start_time
        slot.title = goal.title

        let JSGoal = goals.find({ $loki: task.goal_id })[0]
        slot.colors = JSGoal.colors

        if (calendar.time_unit_qualifier == "h") {
            let day = Math.floor(slot.begin / 24)
            if (days[day] == undefined) {
                days[day] = []
            }
            days[day].push(slot)
        }
    })
    // console.log(days)

    days.forEach((day, index) => {
        HTML += "day " + index + "<br />"
        day.forEach(slot => {
            HTML += generateSlotHTML(slot)
        })
    })
    return HTML
}

function getGoalIdsToSchedule() {
    console.log("Inside getGoalIdsToSchedule...")
    let workPackage = {
        goalIdsToSchedule: [],
        goalIdsToInvestigate: []
    }
    workPackage.goalIdsToInvestigate = getChildrenIdsFor("_______________________________goals")
    console.log("workPackage:", workPackage)

    let loopCounter = 0
    while (workPackage.goalIdsToInvestigate.length > 0 && loopCounter < MAX_LEVELS) {
        console.log("workPackage:", workPackage)
        console.log("loop ", loopCounter)
        loopCounter += 1
        workPackage = filterForDurationAndMaybeStatus(workPackage)
    }

    return workPackage.goalIdsToSchedule
}

function filterForDurationAndMaybeStatus(workPackage) {
    console.log("Inside filterForDurationAndMaybeStatus...")
    return workPackage
}

function getChildrenIdsFor(id) {
    console.log("Inside getChildrenIdsFor...", id)
    let result = []
    let relationshipsToUse = relationships.where(function (relation) {
        return (relation.parentId == id)
    })
    console.log("relationshipsToUse:", relationshipsToUse)
    relationshipsToUse.forEach(relationship => {
        result.push(relationship.childId)
    })

    return result
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


function setLanguageTo(lang) {
    if (lang == 'en' || lang == 'nl') {
        let languageSetting = settings.find({ "setting": "language" })[0]
        languageSetting.value = lang
        settings.update(languageSetting)
        updateUILanguage()
        repository.saveDatabase() //better to force for if user refreshes before autosave interval
    };
}

function resetRepository() {
    repository.removeCollection('goals')
    repository.removeCollection('relationships')
    repository.removeCollection('settings')
    repository.removeCollection('translations')
    repository.saveDatabase()
    databaseInitialize()
}

function setScreenModeDark() {
    let screenModeSetting = settings.find({ "setting": "screenMode" })[0]
    screenModeSetting.value = "dark"
    settings.update(screenModeSetting)
    updateScreenMode()
    repository.saveDatabase() //better to force for if user refreshes before autosave interval
};

function setScreenModeLight() {
    let screenModeSetting = settings.find({ "setting": "screenMode" })[0]
    screenModeSetting.value = "light"
    settings.update(screenModeSetting)
    updateScreenMode()
    repository.saveDatabase() //better to force for if user refreshes before autosave interval
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
    } while (safety < 10 && !(currentVertex.label == "person"))

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
        breadcrumbHTML += '<button type="button" class="breadcrumb-button btn btn-outline-secondary btn-sm m-1" id="breadcrumbGoal-' + ancestor.id + '">' + title + '</button>'
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

function lastSettingsUpdate() {
    return 1637675183133
}

function loadSettings() {
    repository.removeCollection('settings')
    goals.findAndRemove({ "label": "setting" })
    goals.findAndRemove({ "label": "setting-action" })
    relationships.findAndRemove({ "label": "setting" })
    settings = repository.addCollection('settings', { unique: ['setting'] })
    settings.insert({ "setting": "screenMode", "value": "light" })
    settings.insert({ "setting": "settingsLastUpdate", "value": lastSettingsUpdate() })
    let browserLanguage = navigator.language.substr(0, 2)
    if (browserLanguage != 'en' && browserLanguage != 'nl') {
        browserLanguage = 'en'
    }
    settings.insert({ "setting": "language", "value": browserLanguage })
}

function updateMainButtonsFor(parentId) {
    console.log("inside updateMainButtonsfor(id):", parentId)
    let parent = goals.find({ id: parentId })[0]
    console.log("parent:", parent)

    switch (parent.label) {
        case "goal":
            let relationshipsForParent = relationships.find({ parentId: parentId })
            if (relationshipsForParent.length == 0) {
                deleteMode = false
                $("#main-notification").empty()
                $("#main-notification").addClass('d-none')
                $("#deleteButtonDiv").html(`
                <button type="button" class="btn btn-outline-secondary btn-sm m-1 btn-hidden" id="deleteButtonX">
                    <div class="top-buttons" id="deleteButtonText">Delete</div>
                </button>
                `)
            } else {
                $("#deleteButtonDiv").html(`
                <button type="button" class="btn btn-outline-secondary btn-sm m-1" id="deleteButton">
                    <div class="top-buttons" id="deleteButtonText">Delete</div>
                </button>
                `)
            }

            if (deleteMode == true) {
                console.log("hit")
                $("#main-notification").removeClass('d-none')
                $("#main-notification").html("Click / touch any list to delete.")
            } else {
                $("#main-notification").html("")
                $("#main-notification").addClass('d-none')
            }

            $("#main-buttons-row").removeClass('d-none')
            break;
        case "person":
            $("#main-buttons-row").addClass('d-none')
            break;
        case "feeling":
            $("#deleteButtonDiv").html(`
            <button type="button" class="btn btn-outline-secondary btn-sm m-1 btn-hidden" id="deleteButtonX">
                <div class="top-buttons" id="deleteButtonText">Delete</div>
            </button>
            `)
            $("#main-buttons-row").removeClass('d-none')
            break;
        default:
            $("#main-notification").empty()
            $("#main-notification").addClass('d-none')
            $("#main-buttons-row").addClass('d-none')
    }
}

function loadSettingGoalsAndRelationships() {
    goals.insert({
        "id": "______________________________ZinZen",
        "label": "setting",
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
        "colors": [
            "4"
        ],
        "commands": "setting",
        "statusSort": 1
    })

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
        "colors": [
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

        "colors": [
            "4"
        ],
        "commands": "setting",
        "statusSort": 1
    })
    goals.insert({
        "id": "______________________________donate",
        "label": "setting-action",
        "title": { "en": "Donate", "nl": "Doneren" },
        "owner": "ZinZen",
        "subCountMaybe": "0",
        "subCountPromised": "0",
        "subCountDone": "0",
        "subCountNever": "0",
        "status": "link",
        "function": "openURLs()",
        "colors": [
            "4"
        ],
        "commands": "setting",
        "urls": ["https://www.gofundme.com/f/deliver-purpose-with-an-app-for-keeping-promises/donate"],
        "statusSort": 1
    })
    goals.insert({
        "id": "________________________________blog",
        "label": "setting-action",
        "title": { "en": "Blog", "nl": "Blog" },
        "owner": "ZinZen",
        "subCountMaybe": "0",
        "subCountPromised": "0",
        "subCountDone": "0",
        "subCountNever": "0",
        "status": "link",
        "function": "openURLs()",
        "colors": [
            "4"
        ],
        "commands": "setting",
        "urls": ["https://blog.ZinZen.me"],
        "statusSort": 1
    })
    goals.insert({
        "id": "_______________________________about",
        "label": "setting-action",
        "title": { "en": "About us", "nl": "Over ons" },
        "owner": "ZinZen",
        "subCountMaybe": "0",
        "subCountPromised": "0",
        "subCountDone": "0",
        "subCountNever": "0",
        "status": "link",
        "function": "openURLs()",
        "colors": [
            "4"
        ],
        "commands": "setting",
        "urls": ["https://ZinZen.me/about.html"],
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

        "colors": [
            "4"
        ],
        "commands": "setting",
        "statusSort": 1
    })

    relationships.insert({ parentId: sessionId, childId: "______________________________ZinZen", priority: 0, label: "setting" })
    relationships.insert({ parentId: "______________________________ZinZen", childId: "_________install-on-phone-or-desktop", priority: 1, label: "setting" })
    relationships.insert({ parentId: "______________________________ZinZen", childId: "______________________________donate", priority: 2, label: "setting" })
    relationships.insert({ parentId: "______________________________ZinZen", childId: "________________________________blog", priority: 3, label: "setting" })
    relationships.insert({ parentId: "______________________________ZinZen", childId: "_______________________________about", priority: 4, label: "setting" })
    relationships.insert({ parentId: "______________________________ZinZen", childId: "_______________________________legal", priority: 5, label: "setting" })


    goals.insert({
        "id": "_______________________look-and-feel",
        "label": "setting",
        "title": { "en": "Display and Language", "nl": "Opmaak en Taal" },
        "owner": "ZinZen",
        "subCountMaybe": "2",
        "subCountPromised": "0",
        "subCountDone": "0",
        "subCountNever": "0",
        "status": "setting",
        "colors": [
            "4"
        ],
        "commands": "setting",
        "statusSort": 1
    })
    goals.insert({
        "id": "_________________import-export-reset",
        "label": "setting",
        "title": { "en": "Import / Export / Destroy all my data", "nl": "Import / Export / Vernietig al mijn data" },
        "owner": "ZinZen",
        "subCountMaybe": "3",
        "subCountPromised": "0",
        "subCountDone": "0",
        "subCountNever": "0",
        "status": "setting",
        "colors": [
            "4"
        ],
        "commands": "setting",
        "statusSort": 1
    })
    goals.insert({
        "id": "__________________________sign-up-in",
        "label": "setting-action",
        "title": { "en": "Sign up / in", "nl": "Lid worden / Aanmelden" },
        "owner": "ZinZen",
        "subCountMaybe": "0",
        "subCountPromised": "0",
        "subCountDone": "0",
        "subCountNever": "0",
        "status": "link",
        "function": "openURLs()",
        "colors": [
            "4"
        ],
        "function": "logOut()",
        "commands": "setting",
        "statusSort": 1
    })

    relationships.insert({ parentId: "______________________________ZinZen", childId: "_______________________look-and-feel", priority: 0, label: "setting" })
    relationships.insert({ parentId: "______________________________ZinZen", childId: "__________________________sign-up-in", priority: 1, label: "setting" })
    relationships.insert({ parentId: "______________________________ZinZen", childId: "_________________import-export-reset", priority: 2, label: "setting" })

    goals.insert({
        "id": "____________________reset-repository",
        "label": "setting-action",
        "title": { "en": "Destroy all my data now!", "nl": "Vernietig al mijn data nu!" },
        "owner": "ZinZen",
        "subCountMaybe": "0",
        "subCountPromised": "0",
        "subCountDone": "0",
        "subCountNever": "0",
        "status": "setting",
        "colors": [
            "4"
        ],
        "updatedDT": [
            "2021-08-12T15:24:03.602Z"
        ],
        "function": "resetRepository()",
        "commands": "setting",
        "statusSort": 1
    })

    relationships.insert({ parentId: "_________________import-export-reset", childId: "____________________reset-repository", priority: 0, label: "setting" })

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
        "colors": [
            "4"
        ],
        "commands": "setting",
        "statusSort": 1
    })

    goals.insert({
        "id": "__________________install-on-android",
        "label": "setting",
        "title": { "en": "Install on android (Samsung, Xiaomi, other)", "nl": "Instaleer op android (Samsung, Xiaomi, overig)" },
        "owner": "ZinZen",
        "subCountMaybe": "0",
        "subCountPromised": "0",
        "subCountDone": "0",
        "subCountNever": "0",
        "status": "setting",
        "colors": [
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
        "colors": [
            "4"
        ],
        "commands": "setting",
        "statusSort": 1
    })

    relationships.insert({ parentId: "_________install-on-phone-or-desktop", childId: "_________________install-on-computer", priority: 0, label: "setting" })
    relationships.insert({ parentId: "_________install-on-phone-or-desktop", childId: "__________________install-on-android", priority: 1, label: "setting" })
    relationships.insert({ parentId: "_________install-on-phone-or-desktop", childId: "___________________install-on-iphone", priority: 2, label: "setting" })

    goals.insert({
        "id": "_____________________________Privacy",
        "label": "setting-action",
        "title": { "en": "Privacy statement", "nl": "Privacy verklaring" },
        "owner": "ZinZen",
        "subCountMaybe": "0",
        "subCountPromised": "0",
        "subCountDone": "0",
        "subCountNever": "0",
        "status": "link",
        "function": "openURLs()",
        "colors": [
            "4"
        ],
        "commands": "setting",
        "urls": ["https://ZinZen.me/privacy.html"],
        "statusSort": 1
    })
    goals.insert({
        "id": "____________________terms-of-service",
        "label": "setting-action",
        "title": { "en": "Terms of service", "nl": "Algemene voorwaarden" },
        "owner": "ZinZen",
        "subCountMaybe": "0",
        "subCountPromised": "0",
        "subCountDone": "0",
        "subCountNever": "0",
        "status": "link",
        "function": "openURLs()",
        "colors": [
            "4"
        ],
        "commands": "setting",
        "urls": ["https://ZinZen.me/terms.html"],
        "statusSort": 1
    })
    goals.insert({
        "id": "________open-source-acknowledgements",
        "label": "setting-action",
        "title": { "en": "Open source acknowledgements", "nl": "Open source erkenningen" },
        "owner": "ZinZen",
        "subCountMaybe": "0",
        "subCountPromised": "0",
        "subCountDone": "0",
        "subCountNever": "0",
        "status": "link",
        "function": "openURLs()",
        "colors": [
            "4"
        ],
        "commands": "setting",
        "urls": ["https://ZinZen.me/acknowledgements.html"],
        "statusSort": 1
    })

    relationships.insert({ parentId: "_______________________________legal", childId: "_____________________________Privacy", priority: 0, label: "setting" })
    relationships.insert({ parentId: "_______________________________legal", childId: "____________________terms-of-service", priority: 1, label: "setting" })
    relationships.insert({ parentId: "_______________________________legal", childId: "________open-source-acknowledgements", priority: 2, label: "setting" })

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
        "colors": [
            "4"
        ],
        "commands": "setting",
        "statusSort": 1
    })

    goals.insert({
        "id": "__________________________light-mode",
        "label": "setting-action",
        "title": { "en": "Light mode", "nl": "Lichte modus" },
        "owner": "ZinZen",
        "subCountMaybe": "0",
        "subCountPromised": "0",
        "subCountDone": "0",
        "subCountNever": "0",
        "status": "setting",
        "colors": [
            "4"
        ],
        "updatedDT": [
            "2021-08-12T15:24:03.602Z"
        ],
        "function": "setScreenModeLight()",
        "commands": "setting",
        "statusSort": 1
    })

    goals.insert({
        "id": "___________________________dark-mode",
        "label": "setting-action",
        "title": { "en": "Dark mode", "nl": "Donkere modus" },
        "owner": "ZinZen",
        "subCountMaybe": "0",
        "subCountPromised": "0",
        "subCountDone": "0",
        "subCountNever": "0",
        "status": "setting",
        "colors": [
            "4"
        ],
        "updatedDT": [
            "2021-08-12T15:24:03.602Z"
        ],
        "function": "setScreenModeDark()",
        "commands": "setting",
        "statusSort": 1
    })


    relationships.insert({ parentId: "_______________________look-and-feel", childId: "____________________________language", priority: 2, label: "setting" })
    relationships.insert({ parentId: "_______________________look-and-feel", childId: "__________________________light-mode", priority: 0, label: "setting" })
    relationships.insert({ parentId: "_______________________look-and-feel", childId: "___________________________dark-mode", priority: 1, label: "setting" })

    goals.insert({
        "id": "_______________________________Dutch",
        "label": "setting-action",
        "title": { "en": "🇳🇱 Dutch", "nl": "🇳🇱 Nederlands" },
        "owner": "ZinZen",
        "subCountMaybe": "0",
        "subCountPromised": "0",
        "subCountDone": "0",
        "subCountNever": "0",
        "status": "setting",
        "colors": [
            "4"
        ],
        "updatedDT": [
            "2021-08-12T15:24:03.602Z"
        ],
        "function": "setLanguageTo('nl')",
        "commands": "setting",
        "statusSort": 1
    })

    goals.insert({
        "id": "_____________________________English",
        "label": "setting-action",
        "title": { "en": "🇺🇸 🇬🇧 English", "nl": "🇺🇸 🇬🇧 Engels" },
        "owner": "ZinZen",
        "subCountMaybe": "0",
        "subCountPromised": "0",
        "subCountDone": "0",
        "subCountNever": "0",
        "status": "setting",
        "colors": [
            "4"
        ],
        "updatedDT": [
            "2021-08-12T15:24:03.602Z"
        ],
        "function": "setLanguageTo('en')",
        "commands": "setting",
        "statusSort": 1
    })

    relationships.insert({ parentId: "____________________________language", childId: "_____________________________English", priority: 0, label: "setting" })
    relationships.insert({ parentId: "____________________________language", childId: "_______________________________Dutch", priority: 1, label: "setting" })
}


function loadGoalsAndRelationships() {

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

    loadSettings()
    loadSettingGoalsAndRelationships()
    loadSuggestionsGoalsAndRelationships()
    loadPersonalTimeAndRelationships()
    loadPersonalFeelingsAndRelationships()
    loadPersonalGoalsAndRelationships()
}

function loadPersonalTimeAndRelationships() {
    goals.insert({
        "id": "________________________________time",
        "label": "setting-action",
        "title": { "en": "My time", "nl": "Mijn tijd" },
        "owner": "ZinZen",
        "subCountMaybe": "0",
        "subCountPromised": "0",
        "subCountDone": "0",
        "subCountNever": "0",
        "status": "suggestion",
        "function": "goToCalendar()",
        "colors": [
            "1"
        ],
        "commands": "",
        "statusSort": 1
    })
    relationships.insert({ parentId: sessionId, childId: "________________________________time" })
}

function loadPersonalFeelingsAndRelationships() {
    goals.insert({
        "id": "____________________________feelings",
        "label": "feeling",
        "title": { "en": "My feelings 💖", "nl": "Mijn gevoelens 💖" },
        "owner": "ZinZen",
        "subCountMaybe": "0",
        "subCountPromised": "0",
        "subCountDone": "0",
        "subCountNever": "0",
        "status": "suggestion",
        "colors": [
            "2"
        ],
        "commands": "",
        "statusSort": 1
    })

    relationships.insert({ parentId: sessionId, childId: "____________________________feelings" })
}

function loadPersonalGoalsAndRelationships() {
    goals.insert({
        "id": "_______________________________goals",
        "label": "goal",
        "title": { "en": "My goals 🎯", "nl": "Mijn doelen 🎯" },
        "owner": "ZinZen",
        "subCountMaybe": "0",
        "subCountPromised": "0",
        "subCountDone": "0",
        "subCountNever": "0",
        "status": "folder",
        "colors": [
            "5"
        ],
        "commands": "",
        "statusSort": 1
    })

    relationships.insert({ parentId: sessionId, childId: "_______________________________goals" })
}

function loadSuggestionsGoalsAndRelationships() {
    goals.insert({
        "id": "_________________________suggestions",
        "label": "suggestion",
        "title": { "en": "🔭 Explore 🧭", "nl": "🔭 Ontdek 🧭" },
        "owner": "ZinZen",
        "subCountMaybe": "3",
        "subCountPromised": "0",
        "subCountDone": "0",
        "subCountNever": "0",
        "status": "suggestion",
        "colors": [
            "7"
        ],
        "commands": "suggestion",
        "statusSort": 1
    })
    relationships.insert({ parentId: sessionId, childId: "_________________________suggestions" })

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
        "colors": [
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
        "colors": [
            "7"
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
        "colors": [
            "7"
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
        "colors": [
            "7"
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
        "colors": [
            "7"
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
        "colors": [
            "7"
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
    repository.removeCollection('translations')
    translations = repository.addCollection('translations', {
        unique: ['en']
    });

    translations.insert(
        {
            "en": "Goals",
            "nl": "Doelen"
        })
    translations.insert(
        {
            "en": "Feelings",
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
    translations.insert(
        {
            "en": "How do you feel now?",
            "nl": "Hoe voel je je nu?"
        })
    translations.insert(
        {
            "en": "Type a goal and the number of hours...",
            "nl": "Type een doel en het aantal uur..."
        })
    translations.insert(
        {
            "en": "Add or search",
            "nl": "Nieuw of zoeken"
        })
    translations.insert(
        {
            "en": "Edit",
            "nl": "Wijzig"
        })
    translations.insert(
        {
            "en": "Back",
            "nl": "Terug"
        }
    )
    translations.insert(
        {
            "en": "Add",
            "nl": "Voeg toe"
        }
    )
    translations.insert(
        {
            "en": "Copy",
            "nl": "Kopieer"
        }
    )
    translations.insert(
        {
            "en": "Move",
            "nl": "Verplaats"
        }
    )
    translations.insert(
        {
            "en": "Paste",
            "nl": "Plakken"
        }
    )
    translations.insert(
        {
            "en": "Delete",
            "nl": "Verwijder"
        }
    )
    translations.insert(
        {
            "en": "Happy",
            "nl": "Blij"
        })

    translations.insert(
        {
            "en": "Sad",
            "nl": "Bedroefd"
        })
    translations.insert(
        {
            "en": "Afraid",
            "nl": "Bang"
        })
    translations.insert(
        {
            "en": "Angry",
            "nl": "Boos"
        })
    translations.insert(
        {
            "en": "Disgusted",
            "nl": "Afschuw"
        })


    translations.insert(
        {
            "en": "happy",
            "nl": "gelukkig",
            "label": "enjoyment-emotion"
        })
    translations.insert(
        {
            "en": "loved",
            "nl": "geliefd",
            "label": "enjoyment-emotion"
        })
    translations.insert(
        {
            "en": "relieved",
            "nl": "opgelucht",
            "label": "enjoyment-emotion"
        })
    translations.insert(
        {
            "en": "content",
            "nl": "tevreden",
            "label": "enjoyment-emotion"
        })
    translations.insert(
        {
            "en": "amused",
            "nl": "geamuseerd",
            "label": "enjoyment-emotion"
        })
    translations.insert(
        {
            "en": "joyful",
            "nl": "plezierig",
            "label": "enjoyment-emotion"
        })
    translations.insert(
        {
            "en": "proud",
            "nl": "trots",
            "label": "enjoyment-emotion"
        })
    translations.insert(
        {
            "en": "excited",
            "nl": "opgewonden",
            "label": "enjoyment-emotion"
        })
    translations.insert(
        {
            "en": "peaceful",
            "nl": "vredig",
            "label": "enjoyment-emotion"
        })
    translations.insert(
        {
            "en": "compassionate",
            "nl": "meedogend",
            "label": "enjoyment-emotion"
        })

    translations.insert(
        {
            "en": "hopeless",
            "nl": "hopeloos",
            "label": "sadness-emotion"
        })
    translations.insert(
        {
            "en": "lonely",
            "nl": "eenzaam",
            "label": "sadness-emotion"
        })
    translations.insert(
        {
            "en": "heartbroken",
            "nl": "diepbedroefd",
            "label": "sadness-emotion"
        })
    translations.insert(
        {
            "en": "gloomy",
            "nl": "somber",
            "label": "sadness-emotion"
        })
    translations.insert(
        {
            "en": "disappointed",
            "nl": "teleurgesteld",
            "label": "sadness-emotion"
        })
    translations.insert(
        {
            "en": "grieved",
            "nl": "rouwend",
            "label": "sadness-emotion"
        })
    translations.insert(
        {
            "en": "unhappy",
            "nl": "ongelukkig",
            "label": "sadness-emotion"
        })
    translations.insert(
        {
            "en": "lost",
            "nl": "verloren",
            "label": "sadness-emotion"
        })
    translations.insert(
        {
            "en": "troubled",
            "nl": "verontrust",
            "label": "sadness-emotion"
        })
    translations.insert(
        {
            "en": "resigned",
            "nl": "neergeslagen",
            "label": "sadness-emotion"
        })
    translations.insert(
        {
            "en": "miserable",
            "nl": "ellendig",
            "label": "sadness-emotion"
        })

    translations.insert(
        {
            "en": "worried",
            "nl": "ongerust",
            "label": "fear-emotion"
        })
    translations.insert(
        {
            "en": "doubtful",
            "nl": "twijfelend",
            "label": "fear-emotion"
        })
    translations.insert(
        {
            "en": "nervous",
            "nl": "nerveus",
            "label": "fear-emotion"
        })
    translations.insert(
        {
            "en": "anxious",
            "nl": "gespannen",
            "label": "fear-emotion"
        })
    translations.insert(
        {
            "en": "terrified",
            "nl": "doodsbang",
            "label": "fear-emotion"
        })
    translations.insert(
        {
            "en": "panicked",
            "nl": "paniekerig",
            "label": "fear-emotion"
        })
    translations.insert(
        {
            "en": "horrified",
            "nl": "geschokt",
            "label": "fear-emotion"
        })
    translations.insert(
        {
            "en": "desperate",
            "nl": "wanhopig",
            "label": "fear-emotion"
        })
    translations.insert(
        {
            "en": "confused",
            "nl": "verward",
            "label": "fear-emotion"
        })
    translations.insert(
        {
            "en": "stressed",
            "nl": "gestrest",
            "label": "fear-emotion"
        })


    translations.insert(
        {
            "en": "annoyed",
            "nl": "geërgerd",
            "label": "anger-emotion"
        })
    translations.insert(
        {
            "en": "frustrated",
            "nl": "gefrustreerd",
            "label": "anger-emotion"
        })
    translations.insert(
        {
            "en": "bitter",
            "nl": "bitter",
            "label": "anger-emotion"
        })
    translations.insert(
        {
            "en": "infuriated",
            "nl": "woedend",
            "label": "anger-emotion"
        })
    translations.insert(
        {
            "en": "mad",
            "nl": "boos",
            "label": "anger-emotion"
        })
    translations.insert(
        {
            "en": "vengeful",
            "nl": "wraakzuchtig",
            "label": "anger-emotion"
        })
    translations.insert(
        {
            "en": "insulted",
            "nl": "beledigd",
            "label": "anger-emotion"
        })


    translations.insert(
        {
            "en": "dislike",
            "nl": "afkeer",
            "label": "disgust-emotion"
        })
    translations.insert(
        {
            "en": "loathing",
            "nl": "walging",
            "label": "disgust-emotion"
        })
    translations.insert(
        {
            "en": "disapproving",
            "nl": "afkeurend",
            "label": "disgust-emotion"
        })
    translations.insert(
        {
            "en": "uncomfortable",
            "nl": "ongemakkelijk",
            "label": "disgust-emotion"
        })
    translations.insert(
        {
            "en": "nauseated",
            "nl": "misselijk",
            "label": "disgust-emotion"
        })
    translations.insert(
        {
            "en": "disturbed",
            "nl": "verstoord",
            "label": "disgust-emotion"
        })
    translations.insert(
        {
            "en": "withdrawal",
            "nl": "vluchtend",
            "label": "disgust-emotion"
        })

}

function updateUILanguage() {
    let lang = settings.find({ "setting": "language" })[0].value
    console.log("language found in settings:", lang)
    $("#backButtonText").html(translate("Back"))
    $("#addButtonText").html(translate("Add"))
    $("#deleteButtonText").html(translate("Delete"))
    goTo(parentId)
}

async function updateUIWith(child) {
    console.log("inside updateUIWith(child)...")
    console.log("handling child:", child)

    let id = child.id

    if (!$('#' + id).length) {
        let goalHTML = `<div class="row goal card shadow-sm mb-2" id="` + id + `"></div>`
        $("#main-promised").prepend(goalHTML)
    }
    $("#" + id).html(generateGoalHTML(child))

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
    let inputGoal = $("#inputGoal").data('inputGoal')
    console.log("command pressed:", selectedCommand)
    if (selectedCommand.substr(0, 9) == "duration ") {
        console.log("duration selected")
        let durationString = selectedCommand.split(" ")[1]
        inputGoal.title[inputGoal.lang] = inputGoal.title[inputGoal.lang].replace(durationString, "")
        inputGoal.durationString = durationString
    }

    if (selectedCommand.substr(0, 7) == "repeat ") {
        console.log("repeat selected")
        let repeatString = selectedCommand.split(" ")[1]
        //Todo: need something to clean up title regardless of number of characters matching full command - store trigger or match dynamic?
        inputGoal.repeatString = repeatString
        inputGoal.title[inputGoal.lang] = inputGoal.title[inputGoal.lang].replace(repeatString, "")
        inputGoal.title[inputGoal.lang] = inputGoal.title[inputGoal.lang].replace("  ", " ")
    }

    if (selectedCommand.substr(0, 6) == "start ") {
        console.log("start selected")
        inputGoal.startStringsArray = [selectedCommand.substr(6, selectedCommand.length - 6)]
        inputGoal.title[inputGoal.lang] = inputGoal.title[inputGoal.lang].replace(selectedCommand.substr(6, selectedCommand.length - 9), "")
    }

    if (selectedCommand.substr(0, 7) == "finish ") {
        console.log("finish selected")
        inputGoal.finishStringsArray = [selectedCommand.substr(7, selectedCommand.length - 7)]
        inputGoal.title[inputGoal.lang] = inputGoal.title[inputGoal.lang].replace(selectedCommand.substr(7, selectedCommand.length - 10), "")
    }

    if (selectedCommand.substr(0, 5) == "flex ") {
        console.log("flex selected")
    }

    console.log("inputGoal after (not saved):", inputGoal)
    $("#inputGoal").data('inputGoal', inputGoal)
    updateModalAddUI()
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
    'daily': ['repeat daily'],
    'weekly': ['repeat weekly'],
    'monthly': ['repeat monthly'],
    'yearly': ['repeat yearly'],

    'contact': ['contact'],
    'share public': ['share public'],
    'share anonymous': ['share anonymous'],
    'go up': ['go up'],
    'up': ['go up'],
    'today': ['today'],
    'tomorrow': ['tomorrow'],

    'monday': ['Monday'],
    'tuesday': ['Tuesday'],
    'wednesday': ['Wednesday'],
    'thursday': ['Thursday'],
    'friday': ['Friday'],
    'saturday': ['Saturday'],

    'wednesdays': ['Wednesdays'],

    'who': ['who'],
    'share with': ['whare with'],
    'go to': ['go to'],
    'copy to': ['copy to'],
    'copy all to': ['copy all to'],
    'move to': ['move to'],
    'move all to': ['move all to'],

    'suggest to': ['suggest to'],
    'this': ['this'],
    'next': ['next'],
    'after': ['after'],
    'before': ['before'],
    'finish': ['finish'],
    'start': ['start'],
    'emotion': ['emotion'],
    'wait for': ['wait for'],
    'depends on': ['depends on'],
    'nl': ['🇳🇱'],
    'us': ['🇺🇸'],
    'english': ['🇺🇸'],
    'gb': ['gb'],
    'fr': ['🇫🇷'],
    'cn': ['🇨🇳'],
    'es': ['🇪🇸'],
    'de': ['🇩🇪'],
    'please': ['🥺']
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
    if (command.lang == undefined) {
        command.lang = settings.find({ "setting": "language" })[0].value
    }
    console.log("command.lang:", command.lang)
    let wordsArray = command.title[command.lang].split(" ")
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

        if (isDuration(word)) {
            commandsToSuggest.add("duration " + word)
            commandsToSuggest.add("flex " + word)
            commandsToSuggest.add("start in " + word)
            commandsToSuggest.add("finish in " + word)
        }

        if (!isNaN(word) && parseInt(word) >= 0) {
            commandsToSuggest.add("duration " + word + "h")
            commandsToSuggest.add("start in " + word + "h")
            commandsToSuggest.add("finish in " + word + "h")
        }
        if (!isNaN(word) && parseInt(word) < 24 && parseInt(word) >= 0) {
            commandsToSuggest.add("start " + word + ":00")
            commandsToSuggest.add("finish " + word + ":00")
        }

        commandsToSuggest = new Set([...commandsToSuggest, ...getSuggestionsFor(word, commandDict)])
        //Todo: filter out any commands that are already selected

        command.suggestedCommands[index] = commandsToSuggest

        command.suggestedWords[index] = new Set([...getSuggestionsFor(word, wordDict)])
    })

    console.log("wordsArray after:", wordsArray)

    command.title[command.lang] = wordsArray.join(" ")
    if (hasTrailingSpace && wordsArray.length != 0) {
        command.title[command.lang] += " "
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

function openURLs(urls) {
    urls.forEach(url => {
        window.open(url, '_blank')
    })
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
