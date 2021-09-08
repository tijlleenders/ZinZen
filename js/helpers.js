'use strict'

function openGraphModal() {
    emptyModal()
    $("#modal-title").html("<h4 class=\"modal-title\"> Overview of all your goals</h4>");
    $("#modal-body").html('<iframe width="100%" height="684" frameborder="0"\
  src="https://observablehq.com/embed/@d3/force-directed-graph?cells=chart"></iframe>')
    $("#myModal").modal("show");
}

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

function updateModalSettingsUI() {
    if (settings.get("screenMode")[0] == "dark") {
        $("#screen-mode-light").removeClass('active')
        $("#screen-mode-dark").addClass('active')
    } else {
        $("#screen-mode-dark").removeClass('active')
        $("#screen-mode-light").addClass('active')
    }
}

function setSkeletonHTMLForSettings() {
    $("#modal-header-content").html('<h4 class="modal-title">ZinZen Settings</h4>')
    let settingsHTML = ``
    let userName = settings.get("userName")
    settingsHTML += '\
  <div class="row">\
    <div class="col">\
    I am ' + userName
    if (settings.get("owner")[0] != undefined &&
        settings.get("owner")[0] != "") {
        settingsHTML += '<div id="logout"><button name="logout-buttonx" id="logout-buttonx" type="button" class="btn btn-outline-secondary btn-sm m-1">Log out</button></div>'
    } else {
        settingsHTML += '<div id="login"><button name="login-buttonx" id="login-buttonx" type="button" class="btn btn-outline-secondary btn-sm m-1">Log in</button></div>'
    }
    settingsHTML += '  <div id="install-app"><button name="install-app-button" id="install-app-button" type="button" class="btn btn-outline-secondary btn-sm m-1">Install app (only on android)</button></div>'

    settingsHTML += '  <div id="allow-notify"><button name="allow-notify-button" id="allow-notify-button" type="button" class="btn btn-outline-secondary btn-sm m-1">Check if notifications allowed</button></div>'
    settingsHTML += '<div id="allow-notify-message" class="sub-title"></div>'
    settingsHTML += '\
    </div>\
  </div>\
  '
    settingsHTML += `
      <div class="row">\
        <div class="col">\
          <div id="modal-settings-screenmode">\
            Screenmode<br />\
            <button type="button" class="btn btn-outline-secondary btn-sm" name="screenModeDark" id="screen-mode-dark" autocomplete="off">Dark</button>
            <button type="button" class="btn btn-outline-secondary btn-sm" name="screenModeLight" id="screen-mode-light" autocomplete="off">Light</button>
            <button type="button" class="btn btn-outline-secondary btn-sm" name="screenModeTimeBased" id="screen-mode-time-based" autocomplete="off">Time-based</button>
          </div>\
        </div>\
      </div>
      `
    settingsHTML += `
      <div class="row">\
        <div class="col">\
          <div id="modal-settings-calendar">\
            <br />\
            Calendar<br />\
              <div class="text-monospace settings-info">Display timezone: ` + dayjs.tz.guess() + `</div>
              <div class="text-monospace settings-info">Default for scheduling goals: Europe/Amsterdam</div>
          </div>\
        </div>\
      </div>    
    `

    settingsHTML += `
      <div class="row">\
        <div class="col">\
          <div id="modal-settings-other">\
            <br />\
            Other<br />\
              <div id="about"><button name="about-button" id="about-button" type="button" class="btn btn-outline-secondary btn-sm m-1">About ZinZen</button></div>
              <div class="settings-info"><a href="https://zinzen.me/acknowledgements.html" target="_blank">Open source acknowledgements</a></div>
              <div class="text-monospace app-version"> Version: ` + _config.deployVersion + `</div>
          </div>\
        </div>\
      </div>    
    `

    $("#modal-body").html(settingsHTML)
}

function updateModalVisibilitiesUI() {
    let sharedAnonymously = $("#modal-share-anonymously").data("shareAnonymously")
    let sharedPublicly = $("#modal-share-publicly").data("sharePublicly")
    let sharedSelectively = $("#modal-share-selectively").data("shareSelectively")

    sharedAnonymously == "shareAnonymously" ? sharedAnonymously = true : sharedAnonymously = false
    sharedPublicly == "sharePublicly" ? sharedPublicly = true : sharedPublicly = false
    sharedSelectively == "undefined" ? sharedSelectively = true : sharedSelectively = false

    let bodyHTML = getVisibilitesBodyHTML(sharedAnonymously, sharedPublicly, sharedSelectively)
    $("#modal-body").html(bodyHTML)
}

function updateModalScheduleConstraintsUI() {
    updateDurationUI()
    updateFinishUI()
    updateStartUI()
    updatetimesOfDaysPrefUI()
}

function updateModalUI() {
    switch ($("#myModal").data("modalType")) {
        case "settings":
            updateSettingsUI()
            break;
        case "schedule":
            updateModalScheduleConstraintsUI()
            break;
        case "visibilities":
            updateModalVisibilitiesUI()
            break;
        default:
            console.log("modalType to render UI for not recognized")
    }
}

function updateScheduleStatusUI() {
    let status = $("#schedule-status").data("status")
    switch (status) {
        case "proposal":
            let proposal = JSON.parse($("#schedule-status").data("proposal"))
            let proposedHTML = '<p class="text-center">Current: '
            let currentBegin = new Date($("#modal-status").data("scheduledBeginISO"))
            let currentEnd = new Date($("#modal-status").data("scheduledEndISO"))
            let currentDurationString = formatDuration((currentEnd.valueOf() - currentBegin.valueOf()) / 1000).short
            proposedHTML += currentBegin.toLocaleString() + ' ' + currentDurationString + '</br>'
            proposedHTML += 'Proposal:<br />'
            proposal.forEach((element, index) => {
                let begin = new Date(element.begin)
                let end = new Date(element.end)
                let durationString = formatDuration((end.valueOf() - begin.valueOf()) / 1000).short
                proposedHTML = proposedHTML + begin.toLocaleString() + ' ' + durationString + '</br>'
            });
            if (proposal.length == 0) {
                proposedHTML = '<p class="text-center">No possibilities for these criteria'
            }
            proposedHTML = proposedHTML + '</p>'
            $("#schedule-status").html(proposedHTML)
            break;
        case "probing":
            $("#schedule-status").html('<div class="spinner-grow mx-auto"></div>')
            break;
        default:
            console.log("default status... not handled")
    }
}

function openModal(id, modalType) {
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

    switch (modalType) {
        case "settings":
            setSkeletonHTMLForSettings()
            break;
        case "schedule":
            setSkeletonHTMLForScheduleConstraints()
            break;
        default:
            break;
    }
    send('{"action":"read","readRequestType":"specificNode","nodeId":"' + id + '"}') //will fill the modal upon response - if applicable
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
    updateModalSettingsUI()
}

function updateScreenMode() {
    if (document.documentElement.getAttribute("data-theme") != settings.get("screenMode")[0]) {
        document.documentElement.setAttribute("data-theme", settings.get("screenMode")[0])
    }
}

function sendTimesOfDaysPrefUpdate() {
    let goalId = $("#myModal").data("idx")
    let timesOfDaysPrefString = "" + $("#modal-timesOfDaysPref").data("timesOfDaysPrefArray")
    let upsertGoal = {
        action: "command",
        command: "upsertGoal",
        goalId: goalId,
        timesOfDaysPref: timesOfDaysPrefString
    }
    send(JSON.stringify(upsertGoal))
}

function getFinishAccordionItemHTML() {
    return `
<div class="accordion-item" id="collapse-item-finish">
  <h2 class="accordion-header" id="heading-finish">
    <button class="accordion-button collapsed" id="accordion-button-finish" type="button" data-bs-toggle="collapse"
      data-bs-target="#collapse-finish" aria-expanded="false" aria-controls="collapse-finish">
      <div id="modal-finish">
        <p class="text-center">No due date</p>
      </div>
    </button>
  </h2>
  <div id="collapse-finish" class="accordion-collapse collapse" aria-labelledby="heading-finish"
    data-bs-parent="#schedule-accordion">
    <div class="accordion-body">
      <div id="modal-finish-modify" class="subtitles">
        <button name="quick-set-today-button" id="quick-set-today-button" type="button" class="btn btn-outline-secondary btn-sm">Today</button>
        <button name="quick-set-tomorrow-button" id="quick-set-tomorrow-button" type="button" class="btn btn-outline-secondary btn-sm">Tomorrow</button>
        <button name="quick-set-next-week-button" id="quick-set-next-week-button" type="button" class="btn btn-outline-secondary btn-sm">Next week</button>
        <button name="quick-set-next-month-button" id="quick-set-next-month-button" type="button" class="btn btn-outline-secondary btn-sm">Next month</button>
        <button name="quick-set-custom-button" id="quick-set-custom-button" type="button" class="btn btn-outline-secondary btn-sm">Custom</button>
        <button name="quick-set-remove-button" id="quick-set-remove-button" type="button" class="btn btn-outline-secondary btn-sm">X</button>
        <div id="due-date-time-picker" class="d-flex justify-content-center"></div>
      </div>
    </div>
  </div>
</div>`
}

function getStartAccordionItemHTML() {
    return `
            <div class="accordion-item" id="collapse-item-start">
              <h2 class="accordion-header" id="heading-start">
                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                  data-bs-target="#collapse-start" aria-expanded="false" aria-controls="collapse-start">
                  <div id="modal-start">
                    <p class="text-center">No start date</p>
                  </div>
                </button>
              </h2>
              <div id="collapse-start" class="accordion-collapse collapse" aria-labelledby="heading-start"
                data-bs-parent="#schedule-accordion">
                <div class="accordion-body">
                  <div id="modal-start-modify" class="subtitles">
                  <button name="quick-set-start-today-button" id="quick-set-start-today-button" type="button" class="btn btn-outline-secondary btn-sm">Today</button>
                  <button name="quick-set-start-tomorrow-button" id="quick-set-start-tomorrow-button" type="button" class="btn btn-outline-secondary btn-sm">Tomorrow</button>
                  <button name="quick-set-start-next-week-button" id="quick-set-start-next-week-button" type="button" class="btn btn-outline-secondary btn-sm">Next week</button>
                  <button name="quick-set-start-next-month-button" id="quick-set-start-next-month-button" type="button" class="btn btn-outline-secondary btn-sm">Next month</button>
                  <button name="quick-set-start-custom-button" id="quick-set-start-custom-button" type="button" class="btn btn-outline-secondary btn-sm">Custom</button>
                  <button name="quick-set-start-remove-button" id="quick-set-start-remove-button" type="button" class="btn btn-outline-secondary btn-sm">X</button>                  
                    <div id="start-date-time-picker" class="d-flex justify-content-center"></div>
                  </div>
                </div>
              </div>
            </div>
  `
}


function getTimeZoneAccordionItemHTML() {
    return `
<div class="accordion-item" id="collapse-item-time-zone">
<h2 class="accordion-header" id="heading-time-zone">
  <button class="accordion-button collapsed" id="accordion-button-time-zone" type="button" data-bs-toggle="collapse"
    data-bs-target="#collapse-time-zone" aria-expanded="false" aria-controls="collapse-time-zone">
    <div id="modal-time-zone">
      <p class="text-center">Europe/Amsterdam</p>
    </div>
  </button>
</h2>
<div id="collapse-time-zone" class="accordion-collapse collapse" aria-labelledby="heading-time-zone"
  data-bs-parent="#schedule-accordion">
  <div class="accordion-body">
    <div id="modal-time-zone-modify" class="subtitles">
      <p class="subtitles">Time zones. For when you're travelling.<br />
      'Auto' makes your daily routines follow you.</p>
      <button name="quick-set-auto-button" id="quick-set-auto-button" type="button" class="btn btn-outline-secondary btn-sm m-1">Auto</button>
      <button name="quick-set-edt-button" id="quick-set-edt-button" type="button" class="btn btn-outline-secondary btn-sm m-1">EDT</button>
      <button name="quick-set-est-button" id="quick-set-est-button" type="button" class="btn btn-outline-secondary btn-sm m-1">EST</button>
      <button name="quick-set-pst-button" id="quick-set-pst-button" type="button" class="btn btn-outline-secondary btn-sm m-1">PST</button>
      <button name="quick-set-amsterdam-button" id="quick-set-amsterdam-button" type="button" class="btn btn-outline-secondary btn-sm m-1">Amsterdam</button>
      <button name="quick-set-moscow-button" id="quick-set-moscow-button" type="button" class="btn btn-outline-secondary btn-sm m-1">Moscow</button>
      <button name="quick-set-beijing-button" id="quick-set-beijing-button" type="button" class="btn btn-outline-secondary btn-sm m-1">Beijing</button>
      <button name="quick-set-tokyo-button" id="quick-set-tokyo-button" type="button" class="btn btn-outline-secondary btn-sm m-1">Tokyo</button>
      <button name="quick-set-sydney-button" id="quick-set-sydney-button" type="button" class="btn btn-outline-secondary btn-sm m-1">Sydney</button>
      <button name="quick-set-time-zone-custom-button" id="quick-set-time-zone-custom-button" type="button" class="btn btn-outline-secondary btn-sm m-1">Custom</button>
      <p>Work in progress... please <a href="https://www.gofundme.com/f/deliver-purpose-with-an-app-for-keeping-promises/donate" target="_blank">fund</a> if useful.</p> 
    </div>
  </div>
</div>
</div>`
}

function getDurationAccordionHTML() {
    return `
<div class="accordion-item">
<h2 class="accordion-header" id="heading-duration">
  <button class="accordion-button collapsed" id="accordion-button-duration" type="button" data-bs-toggle="collapse" data-bs-target="#collapse-duration"
    aria-expanded="false" aria-controls="collapse-duration">
    <div id="modal-duration">
      <p class="text-center">Reserve 1h</p>
    </div>
  </button>
</h2>
<div id="collapse-duration" class="accordion-collapse collapse" aria-labelledby="heading-duration"
  data-bs-parent="#schedule-accordion">
  <div class="accordion-body">
    <div id="modal-duration-modify">
      <table class="table">
        <tr>
          <th>
            <div><button type="button" id="add-week-button" class="btn btn-light ">+</button></div>
          </th>
          <th>
            <div><button type="button" id="add-day-button" class="btn btn-light ">+</button></div>
          </th>
          <th>
            <div><button type="button" id="add-hour-button" class="btn btn-light ">+</button></div>
          </th>
          <th>
            <div><button type="button" id="add-minute-button" class="btn btn-light ">+</button>
            </div>
          </th>
          <th>
            <div><button type="button" id="add-second-button" class="btn btn-light ">+</button>
            </div>
          </th>
        </tr>
        <tr>
          <td id="duration-weeks">w</td>
          <td id="duration-days">d</td>
          <td id="duration-hours">h</td>
          <td id="duration-minutes">m</td>
          <td id="duration-seconds">s</td>
        </tr>
        <tr>
          <td>
            <div><button type="button" id="remove-week-button" class="btn btn-light ">-</button>
            </div>
          </td>
          <td>
            <div><button type="button" id="remove-day-button" class="btn btn-light ">-</button>
            </div>
          </td>
          <td>
            <div><button type="button" id="remove-hour-button" class="btn btn-light ">-</button>
            </div>
          </td>
          <td>
            <div><button type="button" id="remove-minute-button" class="btn btn-light ">-</button>
            </div>
          </td>
          <td>
            <div><button type="button" id="remove-second-button" class="btn btn-light ">-</button>
            </div>
          </td>
        </tr>
      </table>
    </div>
  </div>
</div>
</div>`
}

function getTimesOfDaysAccordionItemHTML() {
    return `
  <div class="accordion-item">
  <h2 class="accordion-header" id="heading-timesOfDaysPref">
    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
      data-bs-target="#collapse-timesOfDaysPref" aria-expanded="false" aria-controls="collapse-timesOfDaysPref">
      <div id="modal-timesOfDaysPref">
        <p class="text-center">Anytime except night</p>
      </div>
    </button>
  </h2>
  <div id="collapse-timesOfDaysPref" class="accordion-collapse collapse" aria-labelledby="heading-timesOfDaysPref"
    data-bs-parent="#schedule-accordion">
    <div class="accordion-body">
      <div id="modal-timesOfDaysPref-modify">
        <table class="table text-center">
          <tr>
            <td></td>
            <td>
              <div id="timesOfDaysPrefNight-0" class="daytimeTimeOfDay"><svg xmlns="http://www.w3.org/2000/svg"
                  width="16" height="16" fill="currentColor" class="bi bi-moon-stars" viewBox="0 0 16 16">
                  <path
                    d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278zM4.858 1.311A7.269 7.269 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.316 7.316 0 0 0 5.205-2.162c-.337.042-.68.063-1.029.063-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286z" />
                  <path
                    d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L13.863.1z" />
                </svg></div>
            </td>
            <td>
              <div id="timesOfDaysPrefMorning-1" class="daytimeTimeOfDay"><svg xmlns="http://www.w3.org/2000/svg"
                  width="20" height="20" fill="currentColor" class="bi bi-sunrise" viewBox="0 0 16 16">
                  <path
                    d="M7.646 1.146a.5.5 0 0 1 .708 0l1.5 1.5a.5.5 0 0 1-.708.708L8.5 2.707V4.5a.5.5 0 0 1-1 0V2.707l-.646.647a.5.5 0 1 1-.708-.708l1.5-1.5zM2.343 4.343a.5.5 0 0 1 .707 0l1.414 1.414a.5.5 0 0 1-.707.707L2.343 5.05a.5.5 0 0 1 0-.707zm11.314 0a.5.5 0 0 1 0 .707l-1.414 1.414a.5.5 0 1 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zM8 7a3 3 0 0 1 2.599 4.5H5.4A3 3 0 0 1 8 7zm3.71 4.5a4 4 0 1 0-7.418 0H.499a.5.5 0 0 0 0 1h15a.5.5 0 0 0 0-1h-3.79zM0 10a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2A.5.5 0 0 1 0 10zm13 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z" />
                </svg></div>
            </td>
            <td>
              <div id="timesOfDaysPrefAfternoon-2" class="daytimeTimeOfDay"><svg xmlns="http://www.w3.org/2000/svg"
                  width="20" height="20" fill="currentColor" class="bi bi-sun" viewBox="0 0 16 16">
                  <path
                    d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z" />
                </svg></div>
            </td>
            <td>
              <div id="timesOfDaysPrefEvening-3" class="daytimeTimeOfDay"><svg xmlns="http://www.w3.org/2000/svg"
                  width="20" height="20" fill="currentColor" class="bi bi-sunset-fill" viewBox="0 0 16 16">
                  <path
                    d="M7.646 4.854a.5.5 0 0 0 .708 0l1.5-1.5a.5.5 0 0 0-.708-.708l-.646.647V1.5a.5.5 0 0 0-1 0v1.793l-.646-.647a.5.5 0 1 0-.708.708l1.5 1.5zm-5.303-.51a.5.5 0 0 1 .707 0l1.414 1.413a.5.5 0 0 1-.707.707L2.343 5.05a.5.5 0 0 1 0-.707zm11.314 0a.5.5 0 0 1 0 .706l-1.414 1.414a.5.5 0 1 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zM11.709 11.5a4 4 0 1 0-7.418 0H.5a.5.5 0 0 0 0 1h15a.5.5 0 0 0 0-1h-3.79zM0 10a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2A.5.5 0 0 1 0 10zm13 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z" />
                </svg></div>
            </td>
          </tr>
          <tr>
            <td scope="row">
              <div id="timesOfDaysPrefMon-0" class="daytimeDay">Mon</div>
            </td>
            <td>
              <div id="timesOfDaysPrefMonNight-0" class="daytime very-transparent"><svg
                  xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                  class="bi bi-moon-stars" viewBox="0 0 16 16">
                  <path
                    d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278zM4.858 1.311A7.269 7.269 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.316 7.316 0 0 0 5.205-2.162c-.337.042-.68.063-1.029.063-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286z" />
                  <path
                    d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L13.863.1z" />
                </svg></div>
            </td>
            <td>
              <div id="timesOfDaysPrefMonMorning-1" class="daytime"><svg xmlns="http://www.w3.org/2000/svg" width="20"
                  height="20" fill="currentColor" class="bi bi-sunrise" viewBox="0 0 16 16">
                  <path
                    d="M7.646 1.146a.5.5 0 0 1 .708 0l1.5 1.5a.5.5 0 0 1-.708.708L8.5 2.707V4.5a.5.5 0 0 1-1 0V2.707l-.646.647a.5.5 0 1 1-.708-.708l1.5-1.5zM2.343 4.343a.5.5 0 0 1 .707 0l1.414 1.414a.5.5 0 0 1-.707.707L2.343 5.05a.5.5 0 0 1 0-.707zm11.314 0a.5.5 0 0 1 0 .707l-1.414 1.414a.5.5 0 1 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zM8 7a3 3 0 0 1 2.599 4.5H5.4A3 3 0 0 1 8 7zm3.71 4.5a4 4 0 1 0-7.418 0H.499a.5.5 0 0 0 0 1h15a.5.5 0 0 0 0-1h-3.79zM0 10a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2A.5.5 0 0 1 0 10zm13 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z" />
                </svg></div>
            </td>
            <td>
              <div id="timesOfDaysPrefMonAfternoon-2" class="daytime"><svg xmlns="http://www.w3.org/2000/svg"
                  width="20" height="20" fill="currentColor" class="bi bi-sun" viewBox="0 0 16 16">
                  <path
                    d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z" />
                </svg></div>
            </td>
            <td>
              <div id="timesOfDaysPrefMonEvening-3" class="daytime"><svg xmlns="http://www.w3.org/2000/svg" width="20"
                  height="20" fill="currentColor" class="bi bi-sunset-fill" viewBox="0 0 16 16">
                  <path
                    d="M7.646 4.854a.5.5 0 0 0 .708 0l1.5-1.5a.5.5 0 0 0-.708-.708l-.646.647V1.5a.5.5 0 0 0-1 0v1.793l-.646-.647a.5.5 0 1 0-.708.708l1.5 1.5zm-5.303-.51a.5.5 0 0 1 .707 0l1.414 1.413a.5.5 0 0 1-.707.707L2.343 5.05a.5.5 0 0 1 0-.707zm11.314 0a.5.5 0 0 1 0 .706l-1.414 1.414a.5.5 0 1 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zM11.709 11.5a4 4 0 1 0-7.418 0H.5a.5.5 0 0 0 0 1h15a.5.5 0 0 0 0-1h-3.79zM0 10a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2A.5.5 0 0 1 0 10zm13 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z" />
                </svg></div>
            </td>
          </tr>
          <tr>
            <td scope="row">
              <div id="timesOfDaysPrefTue-4" class="daytimeDay">Tue</div>
            </td>
            <td>
              <div id="timesOfDaysPrefTueNight-4" class="daytime very-transparent"><svg
                  xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                  class="bi bi-moon-stars" viewBox="0 0 16 16">
                  <path
                    d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278zM4.858 1.311A7.269 7.269 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.316 7.316 0 0 0 5.205-2.162c-.337.042-.68.063-1.029.063-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286z" />
                  <path
                    d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L13.863.1z" />
                </svg></div>
            </td>
            <td>
              <div id="timesOfDaysPrefTueMorning-5" class="daytime"><svg xmlns="http://www.w3.org/2000/svg" width="20"
                  height="20" fill="currentColor" class="bi bi-sunrise" viewBox="0 0 16 16">
                  <path
                    d="M7.646 1.146a.5.5 0 0 1 .708 0l1.5 1.5a.5.5 0 0 1-.708.708L8.5 2.707V4.5a.5.5 0 0 1-1 0V2.707l-.646.647a.5.5 0 1 1-.708-.708l1.5-1.5zM2.343 4.343a.5.5 0 0 1 .707 0l1.414 1.414a.5.5 0 0 1-.707.707L2.343 5.05a.5.5 0 0 1 0-.707zm11.314 0a.5.5 0 0 1 0 .707l-1.414 1.414a.5.5 0 1 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zM8 7a3 3 0 0 1 2.599 4.5H5.4A3 3 0 0 1 8 7zm3.71 4.5a4 4 0 1 0-7.418 0H.499a.5.5 0 0 0 0 1h15a.5.5 0 0 0 0-1h-3.79zM0 10a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2A.5.5 0 0 1 0 10zm13 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z" />
                </svg></div>
            </td>
            <td>
              <div id="timesOfDaysPrefTueAfternoon-6" class="daytime"><svg xmlns="http://www.w3.org/2000/svg"
                  width="20" height="20" fill="currentColor" class="bi bi-sun" viewBox="0 0 16 16">
                  <path
                    d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z" />
                </svg></div>
            </td>
            <td>
              <div id="timesOfDaysPrefTueEvening-7" class="daytime"><svg xmlns="http://www.w3.org/2000/svg" width="20"
                  height="20" fill="currentColor" class="bi bi-sunset-fill" viewBox="0 0 16 16">
                  <path
                    d="M7.646 4.854a.5.5 0 0 0 .708 0l1.5-1.5a.5.5 0 0 0-.708-.708l-.646.647V1.5a.5.5 0 0 0-1 0v1.793l-.646-.647a.5.5 0 1 0-.708.708l1.5 1.5zm-5.303-.51a.5.5 0 0 1 .707 0l1.414 1.413a.5.5 0 0 1-.707.707L2.343 5.05a.5.5 0 0 1 0-.707zm11.314 0a.5.5 0 0 1 0 .706l-1.414 1.414a.5.5 0 1 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zM11.709 11.5a4 4 0 1 0-7.418 0H.5a.5.5 0 0 0 0 1h15a.5.5 0 0 0 0-1h-3.79zM0 10a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2A.5.5 0 0 1 0 10zm13 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z" />
                </svg></div>
            </td>
          </tr>
          <tr>
            <td scope="row">
              <div id="timesOfDaysPrefWed-8" class="daytimeDay">Wed</div>
            </td>
            <td>
              <div id="timesOfDaysPrefWedNight-8" class="daytime very-transparent"><svg
                  xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                  class="bi bi-moon-stars" viewBox="0 0 16 16">
                  <path
                    d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278zM4.858 1.311A7.269 7.269 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.316 7.316 0 0 0 5.205-2.162c-.337.042-.68.063-1.029.063-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286z" />
                  <path
                    d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L13.863.1z" />
                </svg></div>
            </td>
            <td>
              <div id="timesOfDaysPrefWedMorning-9" class="daytime"><svg xmlns="http://www.w3.org/2000/svg" width="20"
                  height="20" fill="currentColor" class="bi bi-sunrise" viewBox="0 0 16 16">
                  <path
                    d="M7.646 1.146a.5.5 0 0 1 .708 0l1.5 1.5a.5.5 0 0 1-.708.708L8.5 2.707V4.5a.5.5 0 0 1-1 0V2.707l-.646.647a.5.5 0 1 1-.708-.708l1.5-1.5zM2.343 4.343a.5.5 0 0 1 .707 0l1.414 1.414a.5.5 0 0 1-.707.707L2.343 5.05a.5.5 0 0 1 0-.707zm11.314 0a.5.5 0 0 1 0 .707l-1.414 1.414a.5.5 0 1 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zM8 7a3 3 0 0 1 2.599 4.5H5.4A3 3 0 0 1 8 7zm3.71 4.5a4 4 0 1 0-7.418 0H.499a.5.5 0 0 0 0 1h15a.5.5 0 0 0 0-1h-3.79zM0 10a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2A.5.5 0 0 1 0 10zm13 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z" />
                </svg></div>
            </td>
            <td>
              <div id="timesOfDaysPrefWedAfternoon-10" class="daytime"><svg xmlns="http://www.w3.org/2000/svg"
                  width="20" height="20" fill="currentColor" class="bi bi-sun" viewBox="0 0 16 16">
                  <path
                    d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z" />
                </svg></div>
            </td>
            <td>
              <div id="timesOfDaysPrefWedEvening-11" class="daytime"><svg xmlns="http://www.w3.org/2000/svg"
                  width="20" height="20" fill="currentColor" class="bi bi-sunset-fill" viewBox="0 0 16 16">
                  <path
                    d="M7.646 4.854a.5.5 0 0 0 .708 0l1.5-1.5a.5.5 0 0 0-.708-.708l-.646.647V1.5a.5.5 0 0 0-1 0v1.793l-.646-.647a.5.5 0 1 0-.708.708l1.5 1.5zm-5.303-.51a.5.5 0 0 1 .707 0l1.414 1.413a.5.5 0 0 1-.707.707L2.343 5.05a.5.5 0 0 1 0-.707zm11.314 0a.5.5 0 0 1 0 .706l-1.414 1.414a.5.5 0 1 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zM11.709 11.5a4 4 0 1 0-7.418 0H.5a.5.5 0 0 0 0 1h15a.5.5 0 0 0 0-1h-3.79zM0 10a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2A.5.5 0 0 1 0 10zm13 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z" />
                </svg></div>
            </td>
          </tr>
          <tr>
            <td scope="row">
              <div id="timesOfDaysPrefThu-12" class="daytimeDay">Thu</div>
            </td>
            <td>
              <div id="timesOfDaysPrefThuNight-12" class="daytime very-transparent"><svg
                  xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                  class="bi bi-moon-stars" viewBox="0 0 16 16">
                  <path
                    d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278zM4.858 1.311A7.269 7.269 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.316 7.316 0 0 0 5.205-2.162c-.337.042-.68.063-1.029.063-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286z" />
                  <path
                    d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L13.863.1z" />
                </svg></div>
            </td>
            <td>
              <div id="timesOfDaysPrefThuMorning-13" class="daytime"><svg xmlns="http://www.w3.org/2000/svg"
                  width="20" height="20" fill="currentColor" class="bi bi-sunrise" viewBox="0 0 16 16">
                  <path
                    d="M7.646 1.146a.5.5 0 0 1 .708 0l1.5 1.5a.5.5 0 0 1-.708.708L8.5 2.707V4.5a.5.5 0 0 1-1 0V2.707l-.646.647a.5.5 0 1 1-.708-.708l1.5-1.5zM2.343 4.343a.5.5 0 0 1 .707 0l1.414 1.414a.5.5 0 0 1-.707.707L2.343 5.05a.5.5 0 0 1 0-.707zm11.314 0a.5.5 0 0 1 0 .707l-1.414 1.414a.5.5 0 1 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zM8 7a3 3 0 0 1 2.599 4.5H5.4A3 3 0 0 1 8 7zm3.71 4.5a4 4 0 1 0-7.418 0H.499a.5.5 0 0 0 0 1h15a.5.5 0 0 0 0-1h-3.79zM0 10a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2A.5.5 0 0 1 0 10zm13 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z" />
                </svg></div>
            </td>
            <td>
              <div id="timesOfDaysPrefThuAfternoon-14" class="daytime"><svg xmlns="http://www.w3.org/2000/svg"
                  width="20" height="20" fill="currentColor" class="bi bi-sun" viewBox="0 0 16 16">
                  <path
                    d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z" />
                </svg></div>
            </td>
            <td>
              <div id="timesOfDaysPrefThuEvening-15" class="daytime"><svg xmlns="http://www.w3.org/2000/svg"
                  width="20" height="20" fill="currentColor" class="bi bi-sunset-fill" viewBox="0 0 16 16">
                  <path
                    d="M7.646 4.854a.5.5 0 0 0 .708 0l1.5-1.5a.5.5 0 0 0-.708-.708l-.646.647V1.5a.5.5 0 0 0-1 0v1.793l-.646-.647a.5.5 0 1 0-.708.708l1.5 1.5zm-5.303-.51a.5.5 0 0 1 .707 0l1.414 1.413a.5.5 0 0 1-.707.707L2.343 5.05a.5.5 0 0 1 0-.707zm11.314 0a.5.5 0 0 1 0 .706l-1.414 1.414a.5.5 0 1 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zM11.709 11.5a4 4 0 1 0-7.418 0H.5a.5.5 0 0 0 0 1h15a.5.5 0 0 0 0-1h-3.79zM0 10a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2A.5.5 0 0 1 0 10zm13 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z" />
                </svg></div>
            </td>
          </tr>
          <tr>
            <td scope="row">
              <div id="timesOfDaysPrefFri-16" class="daytimeDay">Fri</div>
            </td>
            <td>
              <div id="timesOfDaysPrefFriNight-16" class="daytime very-transparent"><svg
                  xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                  class="bi bi-moon-stars" viewBox="0 0 16 16">
                  <path
                    d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278zM4.858 1.311A7.269 7.269 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.316 7.316 0 0 0 5.205-2.162c-.337.042-.68.063-1.029.063-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286z" />
                  <path
                    d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L13.863.1z" />
                </svg></div>
            </td>
            <td>
              <div id="timesOfDaysPrefFriMorning-17" class="daytime"><svg xmlns="http://www.w3.org/2000/svg"
                  width="20" height="20" fill="currentColor" class="bi bi-sunrise" viewBox="0 0 16 16">
                  <path
                    d="M7.646 1.146a.5.5 0 0 1 .708 0l1.5 1.5a.5.5 0 0 1-.708.708L8.5 2.707V4.5a.5.5 0 0 1-1 0V2.707l-.646.647a.5.5 0 1 1-.708-.708l1.5-1.5zM2.343 4.343a.5.5 0 0 1 .707 0l1.414 1.414a.5.5 0 0 1-.707.707L2.343 5.05a.5.5 0 0 1 0-.707zm11.314 0a.5.5 0 0 1 0 .707l-1.414 1.414a.5.5 0 1 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zM8 7a3 3 0 0 1 2.599 4.5H5.4A3 3 0 0 1 8 7zm3.71 4.5a4 4 0 1 0-7.418 0H.499a.5.5 0 0 0 0 1h15a.5.5 0 0 0 0-1h-3.79zM0 10a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2A.5.5 0 0 1 0 10zm13 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z" />
                </svg></div>
            </td>
            <td>
              <div id="timesOfDaysPrefFriAfternoon-18" class="daytime"><svg xmlns="http://www.w3.org/2000/svg"
                  width="20" height="20" fill="currentColor" class="bi bi-sun" viewBox="0 0 16 16">
                  <path
                    d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z" />
                </svg></div>
            </td>
            <td>
              <div id="timesOfDaysPrefFriEvening-19" class="daytime"><svg xmlns="http://www.w3.org/2000/svg"
                  width="20" height="20" fill="currentColor" class="bi bi-sunset-fill" viewBox="0 0 16 16">
                  <path
                    d="M7.646 4.854a.5.5 0 0 0 .708 0l1.5-1.5a.5.5 0 0 0-.708-.708l-.646.647V1.5a.5.5 0 0 0-1 0v1.793l-.646-.647a.5.5 0 1 0-.708.708l1.5 1.5zm-5.303-.51a.5.5 0 0 1 .707 0l1.414 1.413a.5.5 0 0 1-.707.707L2.343 5.05a.5.5 0 0 1 0-.707zm11.314 0a.5.5 0 0 1 0 .706l-1.414 1.414a.5.5 0 1 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zM11.709 11.5a4 4 0 1 0-7.418 0H.5a.5.5 0 0 0 0 1h15a.5.5 0 0 0 0-1h-3.79zM0 10a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2A.5.5 0 0 1 0 10zm13 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z" />
                </svg></div>
            </td>
          </tr>
          <tr>
            <td scope="row">
              <div id="timesOfDaysPrefat-20" class="daytimeDay">Sat</div>
            </td>
            <td>
              <div id="timesOfDaysPrefatNight-20" class="daytime very-transparent"><svg
                  xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                  class="bi bi-moon-stars" viewBox="0 0 16 16">
                  <path
                    d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278zM4.858 1.311A7.269 7.269 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.316 7.316 0 0 0 5.205-2.162c-.337.042-.68.063-1.029.063-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286z" />
                  <path
                    d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L13.863.1z" />
                </svg></div>
            </td>
            <td>
              <div id="timesOfDaysPrefatMorning-21" class="daytime"><svg xmlns="http://www.w3.org/2000/svg"
                  width="20" height="20" fill="currentColor" class="bi bi-sunrise" viewBox="0 0 16 16">
                  <path
                    d="M7.646 1.146a.5.5 0 0 1 .708 0l1.5 1.5a.5.5 0 0 1-.708.708L8.5 2.707V4.5a.5.5 0 0 1-1 0V2.707l-.646.647a.5.5 0 1 1-.708-.708l1.5-1.5zM2.343 4.343a.5.5 0 0 1 .707 0l1.414 1.414a.5.5 0 0 1-.707.707L2.343 5.05a.5.5 0 0 1 0-.707zm11.314 0a.5.5 0 0 1 0 .707l-1.414 1.414a.5.5 0 1 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zM8 7a3 3 0 0 1 2.599 4.5H5.4A3 3 0 0 1 8 7zm3.71 4.5a4 4 0 1 0-7.418 0H.499a.5.5 0 0 0 0 1h15a.5.5 0 0 0 0-1h-3.79zM0 10a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2A.5.5 0 0 1 0 10zm13 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z" />
                </svg></div>
            </td>
            <td>
              <div id="timesOfDaysPrefatAfternoon-22" class="daytime"><svg xmlns="http://www.w3.org/2000/svg"
                  width="20" height="20" fill="currentColor" class="bi bi-sun" viewBox="0 0 16 16">
                  <path
                    d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z" />
                </svg></div>
            </td>
            <td>
              <div id="timesOfDaysPrefatEvening-23" class="daytime"><svg xmlns="http://www.w3.org/2000/svg"
                  width="20" height="20" fill="currentColor" class="bi bi-sunset-fill" viewBox="0 0 16 16">
                  <path
                    d="M7.646 4.854a.5.5 0 0 0 .708 0l1.5-1.5a.5.5 0 0 0-.708-.708l-.646.647V1.5a.5.5 0 0 0-1 0v1.793l-.646-.647a.5.5 0 1 0-.708.708l1.5 1.5zm-5.303-.51a.5.5 0 0 1 .707 0l1.414 1.413a.5.5 0 0 1-.707.707L2.343 5.05a.5.5 0 0 1 0-.707zm11.314 0a.5.5 0 0 1 0 .706l-1.414 1.414a.5.5 0 1 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zM11.709 11.5a4 4 0 1 0-7.418 0H.5a.5.5 0 0 0 0 1h15a.5.5 0 0 0 0-1h-3.79zM0 10a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2A.5.5 0 0 1 0 10zm13 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z" />
                </svg></div>
            </td>
          </tr>
          <tr>
            <td scope="row">
              <div id="timesOfDaysPrefun-24" class="daytimeDay">Sun</div>
            </td>
            <td>
              <div id="timesOfDaysPrefunNight-24" class="daytime very-transparent"><svg
                  xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                  class="bi bi-moon-stars" viewBox="0 0 16 16">
                  <path
                    d="M6 .278a.768.768 0 0 1 .08.858 7.208 7.208 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 0 1 .81.316.733.733 0 0 1-.031.893A8.349 8.349 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 0 1 6 .278zM4.858 1.311A7.269 7.269 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.316 7.316 0 0 0 5.205-2.162c-.337.042-.68.063-1.029.063-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286z" />
                  <path
                    d="M10.794 3.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387a1.734 1.734 0 0 0-1.097 1.097l-.387 1.162a.217.217 0 0 1-.412 0l-.387-1.162A1.734 1.734 0 0 0 9.31 6.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387a1.734 1.734 0 0 0 1.097-1.097l.387-1.162zM13.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732l-.774-.258a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L13.863.1z" />
                </svg></div>
            </td>
            <td>
              <div id="timesOfDaysPrefunMorning-25" class="daytime"><svg xmlns="http://www.w3.org/2000/svg"
                  width="20" height="20" fill="currentColor" class="bi bi-sunrise" viewBox="0 0 16 16">
                  <path
                    d="M7.646 1.146a.5.5 0 0 1 .708 0l1.5 1.5a.5.5 0 0 1-.708.708L8.5 2.707V4.5a.5.5 0 0 1-1 0V2.707l-.646.647a.5.5 0 1 1-.708-.708l1.5-1.5zM2.343 4.343a.5.5 0 0 1 .707 0l1.414 1.414a.5.5 0 0 1-.707.707L2.343 5.05a.5.5 0 0 1 0-.707zm11.314 0a.5.5 0 0 1 0 .707l-1.414 1.414a.5.5 0 1 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zM8 7a3 3 0 0 1 2.599 4.5H5.4A3 3 0 0 1 8 7zm3.71 4.5a4 4 0 1 0-7.418 0H.499a.5.5 0 0 0 0 1h15a.5.5 0 0 0 0-1h-3.79zM0 10a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2A.5.5 0 0 1 0 10zm13 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z" />
                </svg></div>
            </td>
            <td>
              <div id="timesOfDaysPrefunAfternoon-26" class="daytime"><svg xmlns="http://www.w3.org/2000/svg"
                  width="20" height="20" fill="currentColor" class="bi bi-sun" viewBox="0 0 16 16">
                  <path
                    d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6zm0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z" />
                </svg></div>
            </td>
            <td>
              <div id="timesOfDaysPrefunEvening-27" class="daytime"><svg xmlns="http://www.w3.org/2000/svg"
                  width="20" height="20" fill="currentColor" class="bi bi-sunset-fill" viewBox="0 0 16 16">
                  <path
                    d="M7.646 4.854a.5.5 0 0 0 .708 0l1.5-1.5a.5.5 0 0 0-.708-.708l-.646.647V1.5a.5.5 0 0 0-1 0v1.793l-.646-.647a.5.5 0 1 0-.708.708l1.5 1.5zm-5.303-.51a.5.5 0 0 1 .707 0l1.414 1.413a.5.5 0 0 1-.707.707L2.343 5.05a.5.5 0 0 1 0-.707zm11.314 0a.5.5 0 0 1 0 .706l-1.414 1.414a.5.5 0 1 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zM11.709 11.5a4 4 0 1 0-7.418 0H.5a.5.5 0 0 0 0 1h15a.5.5 0 0 0 0-1h-3.79zM0 10a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2A.5.5 0 0 1 0 10zm13 0a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5z" />
                </svg></div>
            </td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</div>
`
}

function setSkeletonHTMLForScheduleConstraints() {
    let headerHTML = `<h4 class="modal-title">Time options for ...</h4>`
    $("#modal-header-content").html(headerHTML)
    let bodyHTML = `
  <div class="row mt-2" id="options-row">
    <div class="col">
      <div class="accordion .accordion-flush" id="schedule-accordion">`
    bodyHTML += getDurationAccordionHTML()
    bodyHTML += getTimesOfDaysAccordionItemHTML()
    bodyHTML += getFinishAccordionItemHTML()
    bodyHTML += getStartAccordionItemHTML()
    bodyHTML += getTimeZoneAccordionItemHTML()
    bodyHTML += `
      </div>
    </div>
  </div>`
    $("#modal-body").html(bodyHTML)
}

function setSkeletonHTMLForVisibilities() {
    let headerHTML = `<h4 class="modal-title">Visibilities</h4>`
    $("#modal-header-content").html(headerHTML)

    let sharedAnonymously = false
    let sharedPublicly = false
    let sharedSelectively = false

    let bodyHTML = getVisibilitesBodyHTML(sharedAnonymously, sharedPublicly, sharedSelectively)
    $("#modal-body").html(bodyHTML)
}

function getVisibilitesBodyHTML(sharedAnonymously, sharedPublicly, sharedSelectively) {
    let dontShareAnonymouslyIsChecked
    let shareAnonymouslyIsChecked
    sharedAnonymously ? dontShareAnonymouslyIsChecked = "" : dontShareAnonymouslyIsChecked = "checked"
    sharedAnonymously ? shareAnonymouslyIsChecked = "checked" : shareAnonymouslyIsChecked = ""

    let dontSharePubliclyIsChecked
    let sharePubliclyIsChecked
    sharedPublicly ? dontSharePubliclyIsChecked = "" : dontSharePubliclyIsChecked = "checked"
    sharedPublicly ? sharePubliclyIsChecked = "checked" : sharePubliclyIsChecked = ""

    let dontShareSelectivelyIsChecked
    let shareSelectivelyIsChecked
    sharedSelectively ? dontShareSelectivelyIsChecked = "" : dontShareSelectivelyIsChecked = "checked"
    sharedSelectively ? shareSelectivelyIsChecked = "checked" : shareSelectivelyIsChecked = ""

    let bodyHTML = `\
  <div class="row">\
    <div class="col">\
      <div id="modal-share-anonymously">\
        <input type="radio" class="btn-check" name="anonymous-options" id="dont-share-anonymously" autocomplete="off" ` + dontShareAnonymouslyIsChecked + `>
          <label class="btn btn-outline-secondary btn-sm" for="dont-share-anonymously">Don't</label>
        <input type="radio" class="btn-check" name="anonymous-options" id="share-anonymously" autocomplete="off" ` + shareAnonymouslyIsChecked + `>
          <label class="btn btn-outline-secondary btn-sm" for="share-anonymously">Share anonymously</label> to help others<br />\
      </div>\
      <br />\
      <div id="modal-share-publicly">\
        <input type="radio" class="btn-check" name="public-options" id="dont-share-publicly" autocomplete="off" ` + dontSharePubliclyIsChecked + `>
          <label class="btn btn-outline-secondary btn-sm" for="dont-share-publicly">Don't</label>
        <input type="radio" class="btn-check" name="public-options" id="share-publicly" autocomplete="off" ` + sharePubliclyIsChecked + `>
          <label class="btn btn-outline-secondary btn-sm" for="share-publicly">Share publicly</label> on my profile<br />\        
      </div>\
      <br />\
      <div id="modal-share-selectively">\
        <input type="radio" class="btn-check" name="selective-options" id="dont-share-selectively" autocomplete="off" ` + dontShareSelectivelyIsChecked + `>
          <label class="btn btn-outline-secondary btn-sm" for="dont-share-selectively">Don't</label>
        <input type="radio" class="btn-check" name="selective-options" id="share-selectively" autocomplete="off" ` + shareSelectivelyIsChecked + `>
          <label class="btn btn-outline-secondary btn-sm" for="share-selectively">Share selectively</label> with others...<br />\
      </div>\
    </div>\
  </div>\
  `
    $("#modal-body").html(bodyHTML)
}

function setDataFieldsForScheduleConstraints(properties) {
    console.log("properties in setDataFieldsForScheduleConstraints:", properties)
    let headerHTML = `<h4 class="modal-title">` + properties.get("title")[0] + `</h4>`
    $("#modal-header-content").html(headerHTML)

    $("#modal-status").data("status", properties.get("status")[0])

    $("#modal-status").data("scheduledBeginISO", properties.get("scheduledBeginISO"))
    $("#modal-status").data("scheduledEndISO", properties.get("scheduledEndISO"))

    if (properties.has("finish")) {
        $("#modal-finish").data("finish", properties.get("finish")[0])
    }

    if (properties.has("start")) {
        $("#modal-start").data("start", properties.get("start")[0])
    }

    if (properties.has("duration") && properties.get("duration")[0] != "") {
        var duration = properties.get("duration")[0]
    }
    $("#modal-duration").data("duration", duration)

    if (properties.has("timesOfDaysPref") && properties.get("timesOfDaysPref")[0] != "") {
        let timesOfDaysPrefArray = JSON.parse("[" + properties.get("timesOfDaysPref")[0] + "]")
        $("#modal-timesOfDaysPref").data("timesOfDaysPrefArray", timesOfDaysPrefArray)
    }

    if (properties.has("minSize") && properties.get("minSize")[0] != "") {
        $("#modal-budget-per-slot").data("minSize", properties.get("minSize")[0])
    }

    if (properties.has("maxSize") && properties.get("maxSize")[0] != "") {
        $("#modal-budget-per-slot").data("maxSize", properties.get("maxSize")[0])
    }

    if (properties.has("minTimesPerDay") && properties.get("minTimesPerDay")[0] != "") {
        $("#modal-budget-per-day").data("minTimesPerDay", properties.get("minTimesPerDay")[0])
    }

    if (properties.has("maxTimesPerDay") && properties.get("maxTimesPerDay")[0] != "") {
        $("#modal-budget-per-day").data("maxTimesPerDay", properties.get("maxTimesPerDay")[0])
    }

    if (properties.has("minTimesPerWeek") && properties.get("minTimesPerWeek")[0] != "") {
        $("#modal-budget-per-week").data("minTimesPerWeek", properties.get("minTimesPerWeek")[0])
    }

    if (properties.has("maxTimesPerWeek") && properties.get("maxTimesPerWeek")[0] != "") {
        $("#modal-budget-per-week").data("maxTimesPerWeek", properties.get("maxTimesPerWeek")[0])
    }
}

function setDataFieldsForVisibilities(properties) {
    if (properties.has("shareAnonymously")) {
        $("#modal-share-anonymously").data("shareAnonymously", properties.get("shareAnonymously")[0])
    } else {
        $("#modal-share-anonymously").data("shareAnonymously", "dontShareAnonymously")
    }
    if (properties.has("sharePublicly")) {
        $("#modal-share-publicly").data("sharePublicly", properties.get("sharePublicly")[0])
    } else {
        $("#modal-share-publicly").data("sharePublicly", "dontSharePublicly")
    }
    if (properties.has("shareSelectively")) {
        $("#modal-share-selectively").data("shareSelectively", properties.get("shareSelectively")[0])
    } else {
        $("#modal-share-selectively").data("shareSelectively", [])
    }
}

function dueDateInModalChanged(ev) {
    console.log("ev:", ev)
    if (ev.date.valueOf()) {
        console.log("due date selected:", ev.date.toISOString())
        let previousDate = new Date($("#modal-finish").data("finish"))
        $("#modal-finish").data("finish", ev.date.toISOString())
        let chosenDateTime = new Date(ev.date.toISOString())
        let chosenDateTimeString = ev.date.toISOString()
        let now = new Date()
        if (Math.abs(now - chosenDateTime) > 1500 || Math.abs(previousDate - chosenDateTime) < 5000) {
            updateFinishUI()
            let goalId = $("#myModal").data("idx")
            let upsertGoal = {
                action: "command",
                command: "upsertGoal",
                goalId: goalId,
                finish: chosenDateTimeString
            }
            send(JSON.stringify(upsertGoal))
            $("#collapse-finish").collapse('hide')
        }
    }
}

function startDateInModalChanged(ev) {
    console.log("ev:", ev)
    if (ev.date.valueOf()) {
        console.log("start date selected:", ev.date.toISOString())
        let previousDate = new Date($("#modal-start").data("start"))
        $("#modal-start").data("start", ev.date.toISOString())
        let chosenDateTime = new Date(ev.date.toISOString())
        let now = new Date()
        if (Math.abs(now - chosenDateTime) > 1500 || Math.abs(previousDate - chosenDateTime) < 5000) {
            updateStartUI()
                // sendProbeRequest()
            $("#collapse-start").collapse('hide')
        }
    }
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

    //Todo replace this by map.get(gremlin.process.t.id/label) -- can't figure it out...
    var propIterator = properties.values()
    var goalId = propIterator.next().value
    var label = propIterator.next().value

    var tag = properties.get("tags")[0]
    let cardStyle = "card" + tag
    $("#" + goalId).addClass(cardStyle) //Todo: What does this do? remove...?

    let status = properties.get("status")[0]
    $("#" + goalId).data("status", status) //Todo: remove if occurences replaced by properties.get("status")[0]

    let directParents = properties.get('directParents')
    let ultimateParents = properties.get('ultimateParents')
    let subCountDone = properties.get('subCountDone')
    let subCountTotal = properties.get('subCountMaybe') + properties.get('subCountPromised') + properties.get('subCountDone')
    let finish = ""
    if (properties.has("finish") && properties.get("finish")[0] != "") {
        finish = properties.get("finish")[0]
    }

    let visibilities = 'Private'
    if (properties.has("shareAnonymously") && properties.get("shareAnonymously")[0] == "shareAnonymously") {
        visibilities = 'Anonymous'
    }

    if (properties.has("sharePublicly") && properties.get("sharePublicly")[0] == "sharePublicly") {
        visibilities = 'Public'
    }

    var title = properties.get("title")[0]
    var duration = properties.get("duration")[0]
    let durationString = formatDuration(duration).short
    let durationTransparency = ""
    if (durationString == "0m") {
        durationTransparency = "semi-transparent"
    }
    console.log("duration", duration)
    console.log("finish", finish)

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
    if (properties.has("subTitle") && properties.get("subTitle")[0] != "") {
        subTitle += '<br />' + properties.get("subTitle")[0]
    }


    let goalSvg = getGoalSvg(status, goalId)


    let parentRowAndColHTML = ''
    if (directParents.length != 0) {
        let parentTitles = directParents.map(parent => parent.get("title")[0]);
        let parentIds = directParents.map(parent => parent.values().next().value);
        parentRowAndColHTML += '<div class="row" id="goal-parents-row-' +
            goalId +
            '">\
      <div class="col text-end" id="goal-parents-' +
            goalId +
            '">\
    '
        if (parentTitles.length > 1) {
            parentTitles.forEach(function(title, index) {
                parentRowAndColHTML += '<div class="parent-link" id="parent-link-' + parentIds[index] + '">' + title + "</div>"
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
            <div class="row d-none edit-buttons" id="goal-buttons-row-` + goalId + `">
            <div class="col d-flex flex-column icons edit-buttons-col" id="finish-col-` + goalId + `" data-status="` + status + `">
              <svg id="finish-icon-` + goalId + `" class="icons" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill-rule="evenodd" d="M6.75 0a.75.75 0 01.75.75V3h9V.75a.75.75 0 011.5 0V3h2.75c.966 0 1.75.784 1.75 1.75v16a1.75 1.75 0 01-1.75 1.75H3.25a1.75 1.75 0 01-1.75-1.75v-16C1.5 3.784 2.284 3 3.25 3H6V.75A.75.75 0 016.75 0zm-3.5 4.5a.25.25 0 00-.25.25V8h18V4.75a.25.25 0 00-.25-.25H3.25zM21 9.5H3v11.25c0 .138.112.25.25.25h17.5a.25.25 0 00.25-.25V9.5z"></path></svg>
              <div class="sub-title">Schedule</div>
            </div>
            <div class="col d-flex flex-column icons edit-buttons-col" id="visibilities-col-` + goalId + `" data-status="` + status + `">
              <svg id="visibilities-icon-` + goalId + `" class="icons" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path d="M15.5 12a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0z"></path><path fill-rule="evenodd" d="M12 3.5c-3.432 0-6.125 1.534-8.054 3.24C2.02 8.445.814 10.352.33 11.202a1.6 1.6 0 000 1.598c.484.85 1.69 2.758 3.616 4.46C5.876 18.966 8.568 20.5 12 20.5c3.432 0 6.125-1.534 8.054-3.24 1.926-1.704 3.132-3.611 3.616-4.461a1.6 1.6 0 000-1.598c-.484-.85-1.69-2.757-3.616-4.46C18.124 5.034 15.432 3.5 12 3.5zM1.633 11.945c.441-.774 1.551-2.528 3.307-4.08C6.69 6.314 9.045 5 12 5c2.955 0 5.309 1.315 7.06 2.864 1.756 1.553 2.866 3.307 3.307 4.08a.111.111 0 01.017.056.111.111 0 01-.017.056c-.441.774-1.551 2.527-3.307 4.08C17.31 17.685 14.955 19 12 19c-2.955 0-5.309-1.315-7.06-2.864-1.756-1.553-2.866-3.306-3.307-4.08A.11.11 0 011.616 12a.11.11 0 01.017-.055z"></path></svg>
              <div class="sub-title">` + visibilities + `</div>
            </div>
            <div class="col d-flex flex-column icons edit-buttons-col" id="delete-col-` + goalId + `" data-status="` + status + `">
              <svg id="delete-icon-` + goalId + `" class="icons" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><path fill-rule="evenodd" d="M16 1.75V3h5.25a.75.75 0 010 1.5H2.75a.75.75 0 010-1.5H8V1.75C8 .784 8.784 0 9.75 0h4.5C15.216 0 16 .784 16 1.75zm-6.5 0a.25.25 0 01.25-.25h4.5a.25.25 0 01.25.25V3h-5V1.75z"></path><path d="M4.997 6.178a.75.75 0 10-1.493.144L4.916 20.92a1.75 1.75 0 001.742 1.58h10.684a1.75 1.75 0 001.742-1.581l1.413-14.597a.75.75 0 00-1.494-.144l-1.412 14.596a.25.25 0 01-.249.226H6.658a.25.25 0 01-.249-.226L4.997 6.178z"></path><path d="M9.206 7.501a.75.75 0 01.793.705l.5 8.5A.75.75 0 119 16.794l-.5-8.5a.75.75 0 01.705-.793zm6.293.793A.75.75 0 1014 8.206l-.5 8.5a.75.75 0 001.498.088l.5-8.5z"></path></svg>
              <div class="sub-title">Delete</div>
            </div>           
            </div>
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
    let top = $("#breadcrumb").data("top")
    let goals = $("#breadcrumb").data("goals")
    let breadcrumbHTML = ''
    breadcrumbHTML += '<button type="button" class="breadcrumb-button btn btn-outline-secondary btn-sm" id="breadcrumb-me">' + top + '</button>'
    if (goals.length != 0) {
        goals.forEach(goal => {
            breadcrumbHTML += '><button type="button" class="breadcrumb-button btn btn-outline-secondary btn-sm" id="breadcrumbGoal-' + goal.id + '">' + goal.properties.title[0].value + '</button>'
        })
        $("#breadcrumb").html(breadcrumbHTML)
        $("#breadcrumbGoal-" + goals[goals.length - 1].id).addClass('active')
    } else {
        $("#breadcrumb").html(breadcrumbHTML)
    }
}

function updateFinishUI() { //Todo: use locale for picker timezone
    let finishISOString = $("#modal-finish").data("finish")
        //Todo: if already instantiated update
    if (finishISOString != undefined && finishISOString != "") {
        $("#due-date-time-picker").datetimepicker({
            format: 'yyyy-mm-ddThh:ii:ssZ',
            initialDate: new Date(finishISOString),
            todayHighlight: true,
            todayBtn: "linked"
        }).on('changeDate', function(ev) {
            console.log("changeDate event")
            dueDateInModalChanged(ev)
        });
        let localTimeLeft = dayjs().to(new dayjs(finishISOString))
        $("#modal-finish").html('<p class="text-center">Finish ' + localTimeLeft + "</p>")

        let now = new dayjs()
        switch (finishISOString) {
            case now.endOf('day').toISOString():
                $("#quick-set-today-button").addClass('active')
                $("#quick-set-tomorrow-button").removeClass('active')
                $("#quick-set-next-week-button").removeClass('active')
                $("#quick-set-next-month-button").removeClass('active')
                $("#quick-set-custom-button").removeClass('active')
                break;
            case now.add(1, 'day').endOf('day').toISOString():
                $("#quick-set-today-button").removeClass('active')
                $("#quick-set-tomorrow-button").addClass('active')
                $("#quick-set-next-week-button").removeClass('active')
                $("#quick-set-next-month-button").removeClass('active')
                $("#quick-set-custom-button").removeClass('active')
                break;
            case now.add(1, 'week').endOf('week').toISOString():
                $("#quick-set-today-button").removeClass('active')
                $("#quick-set-tomorrow-button").removeClass('active')
                $("#quick-set-next-week-button").addClass('active')
                $("#quick-set-next-month-button").removeClass('active')
                $("#quick-set-custom-button").removeClass('active')
                break;
            case now.add(1, 'month').endOf('month').toISOString():
                $("#quick-set-today-button").removeClass('active')
                $("#quick-set-tomorrow-button").removeClass('active')
                $("#quick-set-next-week-button").removeClass('active')
                $("#quick-set-next-month-button").addClass('active')
                $("#quick-set-custom-button").removeClass('active')
                break;
            default:
                $("#quick-set-today-button").removeClass('active')
                $("#quick-set-tomorrow-button").removeClass('active')
                $("#quick-set-next-week-button").removeClass('active')
                $("#quick-set-next-month-button").removeClass('active')
                $("#quick-set-custom-button").addClass('active')
                break;
        }
    } else { //finishISOString == ""
        $("#quick-set-today-button").removeClass('active')
        $("#quick-set-tomorrow-button").removeClass('active')
        $("#quick-set-next-week-button").removeClass('active')
        $("#quick-set-next-month-button").removeClass('active')
        $("#quick-set-custom-button").removeClass('active')
        $("#due-date-time-picker").datetimepicker('remove')
        $("#modal-finish").html('<p class="text-center">No due date</p>')
    }
}


function updateStartUI() { //Todo: use locale for picker timezone
    let startISOString = $("#modal-start").data("finish")
        //Todo: if already instantiated update
    if (startISOString != undefined && startISOString != "") {
        $("#due-date-time-picker").datetimepicker({
            format: 'yyyy-mm-ddThh:ii:ssZ',
            initialDate: new Date(startISOString),
            todayHighlight: true,
            todayBtn: "linked"
        }).on('changeDate', function(ev) {
            console.log("changeDate event")
            dueDateInModalChanged(ev)
        });
        let localTimeLeft = dayjs().to(new dayjs(startISOString))
        $("#modal-start").html('<p class="text-center">Starts ' + localTimeLeft + "</p>")

        let now = new dayjs()
        switch (startISOString) {
            case now.startOf('day').toISOString():
                $("#quick-set-start-today-button").addClass('active')
                $("#quick-set-start-tomorrow-button").removeClass('active')
                $("#quick-set-start-next-week-button").removeClass('active')
                $("#quick-set-start-next-month-button").removeClass('active')
                $("#quick-set-start-custom-button").removeClass('active')
                break;
            case now.add(1, 'day').startOf('day').toISOString():
                $("#quick-set-start-today-button").removeClass('active')
                $("#quick-set-start-tomorrow-button").addClass('active')
                $("#quick-set-start-next-week-button").removeClass('active')
                $("#quick-set-start-next-month-button").removeClass('active')
                $("#quick-set-start-custom-button").removeClass('active')
                break;
            case now.add(1, 'week').startOf('week').toISOString():
                $("#quick-set-start-today-button").removeClass('active')
                $("#quick-set-start-tomorrow-button").removeClass('active')
                $("#quick-set-start-next-week-button").addClass('active')
                $("#quick-set-start-next-month-button").removeClass('active')
                $("#quick-set-start-custom-button").removeClass('active')
                break;
            case now.add(1, 'month').startOf('month').toISOString():
                $("#quick-set-start-today-button").removeClass('active')
                $("#quick-set-start-tomorrow-button").removeClass('active')
                $("#quick-set-start-next-week-button").removeClass('active')
                $("#quick-set-start-next-month-button").addClass('active')
                $("#quick-set-start-custom-button").removeClass('active')
                break;
            default:
                $("#quick-set-start-today-button").removeClass('active')
                $("#quick-set-start-tomorrow-button").removeClass('active')
                $("#quick-set-start-next-week-button").removeClass('active')
                $("#quick-set-start-next-month-button").removeClass('active')
                $("#quick-set-start-custom-button").addClass('active')
                break;
        }
    } else { //startISOString == ""
        $("#quick-set-start-today-button").removeClass('active')
        $("#quick-set-start-tomorrow-button").removeClass('active')
        $("#quick-set-start-next-week-button").removeClass('active')
        $("#quick-set-start-next-month-button").removeClass('active')
        $("#quick-set-start-custom-button").removeClass('active')
        $("#due-date-time-picker").datetimepicker('remove')
        $("#modal-start").html('<p class="text-center">No start date</p>')
    }
}

function updateDurationUI() {
    let duration = $("#modal-duration").data("duration")
    var durationJson = formatDuration(duration)
    $("#duration-weeks").html(durationJson.weeks)
    $("#duration-days").html(durationJson.days)
    $("#duration-hours").html(durationJson.hours)
    $("#duration-minutes").html(durationJson.minutes)
    $("#duration-seconds").html(durationJson.seconds)
    $("#modal-duration").html('<p class="text-center">Takes ' + durationJson.short + '</p>')
}

function updatetimesOfDaysPrefUI() {

    let timesOfDaysPref = $("#modal-timesOfDaysPref").data("timesOfDaysPrefArray")

    timesOfDaysPref[0] == 0 ? $("#timesOfDaysPrefMonNight-0").addClass("very-transparent") : $("#timesOfDaysPrefMonNight-0").removeClass("very-transparent")
    timesOfDaysPref[1] == 0 ? $("#timesOfDaysPrefMonMorning-1").addClass("very-transparent") : $("#timesOfDaysPrefMonMorning-1").removeClass("very-transparent")
    timesOfDaysPref[2] == 0 ? $("#timesOfDaysPrefMonAfternoon-2").addClass("very-transparent") : $("#timesOfDaysPrefMonAfternoon-2").removeClass("very-transparent")
    timesOfDaysPref[3] == 0 ? $("#timesOfDaysPrefMonEvening-3").addClass("very-transparent") : $("#timesOfDaysPrefMonEvening-3").removeClass("very-transparent")

    timesOfDaysPref[4] == 0 ? $("#timesOfDaysPrefTueNight-4").addClass("very-transparent") : $("#timesOfDaysPrefTueNight-4").removeClass("very-transparent")
    timesOfDaysPref[5] == 0 ? $("#timesOfDaysPrefTueMorning-5").addClass("very-transparent") : $("#timesOfDaysPrefTueMorning-5").removeClass("very-transparent")
    timesOfDaysPref[6] == 0 ? $("#timesOfDaysPrefTueAfternoon-6").addClass("very-transparent") : $("#timesOfDaysPrefTueAfternoon-6").removeClass("very-transparent")
    timesOfDaysPref[7] == 0 ? $("#timesOfDaysPrefTueEvening-7").addClass("very-transparent") : $("#timesOfDaysPrefTueEvening-7").removeClass("very-transparent")

    timesOfDaysPref[8] == 0 ? $("#timesOfDaysPrefWedNight-8").addClass("very-transparent") : $("#timesOfDaysPrefWedNight-8").removeClass("very-transparent")
    timesOfDaysPref[9] == 0 ? $("#timesOfDaysPrefWedMorning-9").addClass("very-transparent") : $("#timesOfDaysPrefWedMorning-9").removeClass("very-transparent")
    timesOfDaysPref[10] == 0 ? $("#timesOfDaysPrefWedAfternoon-10").addClass("very-transparent") : $("#timesOfDaysPrefWedAfternoon-10").removeClass("very-transparent")
    timesOfDaysPref[11] == 0 ? $("#timesOfDaysPrefWedEvening-11").addClass("very-transparent") : $("#timesOfDaysPrefWedEvening-11").removeClass("very-transparent")

    timesOfDaysPref[12] == 0 ? $("#timesOfDaysPrefThuNight-12").addClass("very-transparent") : $("#timesOfDaysPrefThuNight-12").removeClass("very-transparent")
    timesOfDaysPref[13] == 0 ? $("#timesOfDaysPrefThuMorning-13").addClass("very-transparent") : $("#timesOfDaysPrefThuMorning-13").removeClass("very-transparent")
    timesOfDaysPref[14] == 0 ? $("#timesOfDaysPrefThuAfternoon-14").addClass("very-transparent") : $("#timesOfDaysPrefThuAfternoon-14").removeClass("very-transparent")
    timesOfDaysPref[15] == 0 ? $("#timesOfDaysPrefThuEvening-15").addClass("very-transparent") : $("#timesOfDaysPrefThuEvening-15").removeClass("very-transparent")

    timesOfDaysPref[16] == 0 ? $("#timesOfDaysPrefFriNight-16").addClass("very-transparent") : $("#timesOfDaysPrefFriNight-16").removeClass("very-transparent")
    timesOfDaysPref[17] == 0 ? $("#timesOfDaysPrefFriMorning-17").addClass("very-transparent") : $("#timesOfDaysPrefFriMorning-17").removeClass("very-transparent")
    timesOfDaysPref[18] == 0 ? $("#timesOfDaysPrefFriAfternoon-18").addClass("very-transparent") : $("#timesOfDaysPrefFriAfternoon-18").removeClass("very-transparent")
    timesOfDaysPref[19] == 0 ? $("#timesOfDaysPrefFriEvening-19").addClass("very-transparent") : $("#timesOfDaysPrefFriEvening-19").removeClass("very-transparent")

    timesOfDaysPref[20] == 0 ? $("#timesOfDaysPrefatNight-20").addClass("very-transparent") : $("#timesOfDaysPrefatNight-20").removeClass("very-transparent")
    timesOfDaysPref[21] == 0 ? $("#timesOfDaysPrefatMorning-21").addClass("very-transparent") : $("#timesOfDaysPrefatMorning-21").removeClass("very-transparent")
    timesOfDaysPref[22] == 0 ? $("#timesOfDaysPrefatAfternoon-22").addClass("very-transparent") : $("#timesOfDaysPrefatAfternoon-22").removeClass("very-transparent")
    timesOfDaysPref[23] == 0 ? $("#timesOfDaysPrefatEvening-23").addClass("very-transparent") : $("#timesOfDaysPrefatEvening-23").removeClass("very-transparent")

    timesOfDaysPref[24] == 0 ? $("#timesOfDaysPrefunNight-24").addClass("very-transparent") : $("#timesOfDaysPrefunNight-24").removeClass("very-transparent")
    timesOfDaysPref[25] == 0 ? $("#timesOfDaysPrefunMorning-25").addClass("very-transparent") : $("#timesOfDaysPrefunMorning-25").removeClass("very-transparent")
    timesOfDaysPref[26] == 0 ? $("#timesOfDaysPrefunAfternoon-26").addClass("very-transparent") : $("#timesOfDaysPrefunAfternoon-26").removeClass("very-transparent")
    timesOfDaysPref[27] == 0 ? $("#timesOfDaysPrefunEvening-27").addClass("very-transparent") : $("#timesOfDaysPrefunEvening-27").removeClass("very-transparent")

    formattimesOfDaysPrefString(timesOfDaysPref)
}

function updateTimePerSlotUI() {
    let minSize = $("#modal-budget-per-slot").data("minSize")
    let maxSize = $("#modal-budget-per-slot").data("maxSize")
    let minString = formatDuration(minSize).short
    let maxString = formatDuration(maxSize).short
    $("#modal-budget-per-slot").html('<p class="text-center">' + minString + '-' + maxString + ' per slot</p>')
}

function updateTimePerDayUI() {
    let minTimesPerDay = $("#modal-budget-per-day").data("minTimesPerDay")
    let maxTimesPerDay = $("#modal-budget-per-day").data("maxTimesPerDay")
    $("#modal-budget-per-day").html('<p class="text-center">' + minTimesPerDay + '-' + maxTimesPerDay + ' per day</p>')
}

function updateTimePerWeekUI() {
    let minTimesPerWeek = $("#modal-budget-per-week").data("minTimesPerWeek")
    let maxTimesPerWeek = $("#modal-budget-per-week").data("maxTimesPerWeek")
    $("#modal-budget-per-week").html('<p class="text-center">' + minTimesPerWeek + '-' + maxTimesPerWeek + ' per week</p>')
}

function formattimesOfDaysPrefString(timesOfDaysPref) {
    console.log("timesOfDaysPref:", timesOfDaysPref.toString())
        //Todo: format nicely
    switch (timesOfDaysPref.toString()) {
        case "0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1":
            $("#modal-timesOfDaysPref").html('<p class="text-center">Anyday, anytime except night</p>')
            break;
        case "1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1":
            $("#modal-timesOfDaysPref").html('<p class="text-center">Anyday, anytime incl. night</p>')
            break;
        case "0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0":
            $("#modal-timesOfDaysPref").html('<p class="text-center">Anyday, during the day</p>')
            break;
        case "0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0":
            $("#modal-timesOfDaysPref").html('<p class="text-center">Any morning</p>')
            break;
        case "0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0":
            $("#modal-timesOfDaysPref").html('<p class="text-center">Any afternoon</p>')
            break;
        case "0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1":
            $("#modal-timesOfDaysPref").html('<p class="text-center">Any evening</p>')
            break;
        case "1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0":
            $("#modal-timesOfDaysPref").html('<p class="text-center">Any night</p>')
            break;

        case "0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,0,0,0,0,0,0,0,0":
            $("#modal-timesOfDaysPref").html('<p class="text-center">Workdays, anytime except night</p>')
            break;
        case "1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0":
            $("#modal-timesOfDaysPref").html('<p class="text-center">Workdays, anytime incl. night</p>')
            break;
        case "0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,1,1,0,0,0,0,0,0,0,0,0":
            $("#modal-timesOfDaysPref").html('<p class="text-center">Workdays, during the day</p>')
            break;
        case "0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0":
            $("#modal-timesOfDaysPref").html('<p class="text-center">Workdays, any morning</p>')
            break;
        case "0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0":
            $("#modal-timesOfDaysPref").html('<p class="text-center">Workdays, any afternoon</p>')
            break;
        case "0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0":
            $("#modal-timesOfDaysPref").html('<p class="text-center">Workdays, any evening</p>')
            break;
        case "1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0":
            $("#modal-timesOfDaysPref").html('<p class="text-center">Workdays, any night</p>')
            break;

        case "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,1,1,1":
            $("#modal-timesOfDaysPref").html('<p class="text-center">Weekends, anytime except night</p>')
            break;
        case "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1":
            $("#modal-timesOfDaysPref").html('<p class="text-center">Weekends, anytime incl. night</p>')
            break;
        case "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,1,1,0":
            $("#modal-timesOfDaysPref").html('<p class="text-center">Weekends, during the day</p>')
            break;
        case "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0":
            $("#modal-timesOfDaysPref").html('<p class="text-center">Weekends, any morning</p>')
            break;
        case "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0":
            $("#modal-timesOfDaysPref").html('<p class="text-center">Weekends, any afternoon</p>')
            break;
        case "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1":
            $("#modal-timesOfDaysPref").html('<p class="text-center">Weekends, any evening</p>')
            break;
        case "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0":
            $("#modal-timesOfDaysPref").html('<p class="text-center">Weekends, any night</p>')
            break;

        case "0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0":
            $("#modal-timesOfDaysPref").html('<p class="text-center">Monday mornings</p>')
            break;
        case "0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0":
            $("#modal-timesOfDaysPref").html('<p class="text-center">Tuesday mornings</p>')
            break;
        case "0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0":
            $("#modal-timesOfDaysPref").html('<p class="text-center">Wednesday mornings</p>')
            break;
        case "0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0":
            $("#modal-timesOfDaysPref").html('<p class="text-center">Thursday mornings</p>')
            break;
        case "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0":
            $("#modal-timesOfDaysPref").html('<p class="text-center">Friday mornings</p>')
            break;
        case "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0":
            $("#modal-timesOfDaysPref").html('<p class="text-center">Saturnday mornings</p>')
            break;
        case "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0":
            $("#modal-timesOfDaysPref").html('<p class="text-center">Sunday mornings</p>')
            break;

        case "0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0":
            $("#modal-timesOfDaysPref").html('<p class="text-center">Monday afternoons</p>')
            break;
        case "0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0":
            $("#modal-timesOfDaysPref").html('<p class="text-center">Tuesday afternoons</p>')
            break;
        case "0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0":
            $("#modal-timesOfDaysPref").html('<p class="text-center">Wednesday afternoons</p>')
            break;
        case "0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0":
            $("#modal-timesOfDaysPref").html('<p class="text-center">Thursday afternoons</p>')
            break;
        case "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0":
            $("#modal-timesOfDaysPref").html('<p class="text-center">Friday afternoons</p>')
            break;
        case "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0":
            $("#modal-timesOfDaysPref").html('<p class="text-center">Saturnday afternoons</p>')
            break;
        case "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0":
            $("#modal-timesOfDaysPref").html('<p class="text-center">Sunday afternoons</p>')
            break;

        case "0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0":
            $("#modal-timesOfDaysPref").html('<p class="text-center">Monday evenings</p>')
            break;
        case "0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0":
            $("#modal-timesOfDaysPref").html('<p class="text-center">Tuesday evenings</p>')
            break;
        case "0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0":
            $("#modal-timesOfDaysPref").html('<p class="text-center">Wednesday evenings</p>')
            break;
        case "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0":
            $("#modal-timesOfDaysPref").html('<p class="text-center">Thursday evenings</p>')
            break;
        case "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0":
            $("#modal-timesOfDaysPref").html('<p class="text-center">Friday evenings</p>')
            break;
        case "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0":
            $("#modal-timesOfDaysPref").html('<p class="text-center">Saturnday evenings</p>')
            break;
        case "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1":
            $("#modal-timesOfDaysPref").html('<p class="text-center">Sunday evenings</p>')
            break;

        case "0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0":
            $("#modal-timesOfDaysPref").html('<p class="text-center">Mondays, during the day</p>')
            break;
        case "0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0":
            $("#modal-timesOfDaysPref").html('<p class="text-center">Tuesdays, during the day</p>')
            break;
        case "0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0":
            $("#modal-timesOfDaysPref").html('<p class="text-center">Wednesdays, during the day</p>')
            break;
        case "0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0":
            $("#modal-timesOfDaysPref").html('<p class="text-center">Thursdays, during the day</p>')
            break;
        case "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0":
            $("#modal-timesOfDaysPref").html('<p class="text-center">Fridays, during the day</p>')
            break;
        case "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0":
            $("#modal-timesOfDaysPref").html('<p class="text-center">Saturndays, during the day</p>')
            break;
        case "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0":
            $("#modal-timesOfDaysPref").html('<p class="text-center">Sundays, during the day</p>')
            break;

        case "0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0":
            $("#modal-timesOfDaysPref").html('<p class="text-center">Mondays, anytime except night</p>')
            break;
        case "0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0":
            $("#modal-timesOfDaysPref").html('<p class="text-center">Tuesdays, anytime except night</p>')
            break;
        case "0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0":
            $("#modal-timesOfDaysPref").html('<p class="text-center">Wednesdays, anytime except night</p>')
            break;
        case "0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0":
            $("#modal-timesOfDaysPref").html('<p class="text-center">Thursdays, anytime except night</p>')
            break;
        case "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0":
            $("#modal-timesOfDaysPref").html('<p class="text-center">Fridays, anytime except night</p>')
            break;
        case "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0":
            $("#modal-timesOfDaysPref").html('<p class="text-center">Saturndays, anytime except night</p>')
            break;
        case "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1":
            $("#modal-timesOfDaysPref").html('<p class="text-center">Sundays, anytime except night</p>')
            break;

        default:
            $("#modal-timesOfDaysPref").html('<p class="text-center">Custom</p>')
            break;
    }
}

function submitToAPI(e) {
    e.preventDefault();
    var URL = "https://" + _config.apiContact + ".execute-api.eu-west-1.amazonaws.com/prod/contact";

    var desc = $("#description-input").val();
    var email = $("#email-input").val();
    var updateMe = $("#emailMeCheck").val();
    var data = {
        desc: desc,
        email: email,
        updateMe: updateMe
    };

    $.ajax({
        type: "POST",
        url: "https://" + _config.apiContact + ".execute-api.eu-west-1.amazonaws.com/prod/contact",
        dataType: "json",
        crossDomain: "true",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(data),

        success: function() {
            // clear form and show a success message
            alert("Thank you so much for your feedback! We will improve.");
            document.getElementById("contact-form").reset();
        },
        error: function() {
            // show an error message
            alert("Aww... So sorry. Please try emailing. We'd love to hear from you!");
        }
    });
}