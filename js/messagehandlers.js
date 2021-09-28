'use strict'

async function updateUIWith(properties) {
    console.log("handling properties:", properties)

    if (properties.label == 'person' || properties.id == parentId) {
        updateChildrenFor(properties)
        updateBreadcrumbUI()
        return
    }

    if (!properties.directParents.includes(parentId)) {
        console.log("received list that should not be on screen. Probably child of something on screen that is preloaded")
        return
    }

    let id = properties.id

    if (!$('#' + id).length) {
        console.log("id not yet present, appending")
        $("#add-a-goal").empty() //Empties the No lists here
        let goalHTML = `<div class="row goal card shadow-sm mb-2" id="` + id + `"></div>`
        $("#main-promised").append(goalHTML)
    }
    $("#" + id).data('properties', properties)
    $("#" + id).html(generateGoalHTML(id))

    if ($("#myModal").data("idx") == id) {
        switch ($("#myModal").data("modalType")) {

            case "collaboration":
                modalCollaboration(properties)
                break;

            case "mood":
                modalMood(properties)
                break;

            case "visibilities":
                modalVisibilities(properties)
                break;

            case "notes":
                modalNotes(properties)
                break;

            case "workflow":
                modalWorkflow(properties)
                break;

            case "image":
                modalImage(properties)
                break;

            case "link":
                modalLink(properties)
                break;

            case "location":
                modalLocation(properties)
                break;

            case "tags":
                modalTags(properties)
                break;

            case "mail":
                modalMail(properties)
                break;

            case "graph":
            case "mainMail":
                //not implemented dynamically - hardcoded in helpers
                break;

            case "add":
                setDataFieldsForAdd(properties)
                updateModalUI()
                break;

            case "schedule":
                setDataFieldsForScheduleConstraints(properties)
                updateModalUI()
                break;

            default:
        }


    }
}

function handleIncomingProposal(proposal) {
    console.log("handling proposal...")
    $("#schedule-status").data("proposal", JSON.stringify(proposal))
    $("#schedule-status").data("status", "proposal")
    updateScheduleStatusUI()
    $("#schedule-this").removeClass("d-none")
}

function handleIncomingSettings(incomingSettings) {
    settings = incomingSettings
    updateSettingsUI()
}

function handleIncomingPlay(schedule, lastCalculatedEpochMs) {
    console.log("handling play schedule...")
    console.log("lastCalculatedEpochMs:", lastCalculatedEpochMs)
    console.log("goalsLastModifiedEpochMs", goalsLastModifiedEpochMs)
    console.log("schedule:", schedule)
    $("#mmain-play").empty()
    let html = ""
    if (schedule.length == 0 ||
        (lastCalculatedEpochMs != undefined &&
            lastCalculatedEpochMs < goalsLastModifiedEpochMs)) {
        html = "Recalculating..."
        send('{"action":"schedule"}')
    } else {
        schedule.forEach((element, index) => {
            console.log("handling element:", element)
            switch (element.label) {
                case "free":
                    break;
                case "effort":
                    html += generateEffortHTML(element)
                    break;
                case "slot":
                    html += generateSlotHTML(element)
                    break;
                case "person":
                    break;
                case "email":
                    break;
                default:
                    console.log("element not handled:", element)
            }
        });
    }
    $("#mmain-play").html(html)
    console.log("play message handled")
}

function modalCollaboration(properties) {
    $("#modal-header-content").html('<h4 class="modal-title">collaboration</h4>')
    $("#modal-body").html('\
<table class="table table-hover">\
    <thead>\
      <tr>\
        <th scope="col">Person</th>\
        <th scope="col">Like</th>\
        <th scope="col">Status</th>\
        <th scope="col">Chances</th>\
        <th scope="col">Start</th>\
        <th scope="col">Effort</th>\
        <th scope="col">Due</th>\
      </tr>\
    </thead>\
    <tbody>\
      <tr>\
        <td>Ceetje</td>\
        <td>...</td>\
        <td>...</td>\
        <td>...</td>\
        <td>...</td>\
        <td>...</td>\
        <td>...</td>\
      </tr>\
      <tr>\
        <td>Ietje</td>\
        <td>...</td>\
        <td>...</td>\
        <td>...</td>\
        <td>...</td>\
        <td>...</td>\
        <td>...</td>\
      </tr>\
      <tr>\
        <td>Deetje</td>\
        <td>...</td>\
        <td>...</td>\
        <td>...</td>\
        <td>...</td>\
        <td>...</td>\
        <td>...</td>\
      </tr>\
    </tbody>\
  </table>')
    $("#modal-footer-content").html('Want to work together on goals? Please consider <a\
    href="https://www.gofundme.com/f/deliver-purpose-with-an-app-for-keeping-promises/donate">funding it</a>')
}

function modalMood(properties) {
    $("#modal-header-content").html('\
<table>\
    <tr>\
      <th>\
        <div class="mr-2" id="modal-title-mood">\
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">\
            <path class="mood3 mood-selected" id="modal-title-mood-path"\
              d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1z" />\
          </svg>\
        </div>\
      </th>\
      <th>\
        <div id="modal-title"></div>\
      </th>\
    </tr>\
  </table>')
    $("#modal-body").html('\
  <div class="row">\
  <div class="col">\
    <div id="modal-mood">\
      Logging <b>moods </b>help you understand and handle emotions.<br />\
      Moods are private <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">\
        <path fill-rule="evenodd"\
          d="M4 4v2h-.25A1.75 1.75 0 002 7.75v5.5c0 .966.784 1.75 1.75 1.75h8.5A1.75 1.75 0 0014 13.25v-5.5A1.75 1.75 0 0012.25 6H12V4a4 4 0 10-8 0zm6.5 2V4a2.5 2.5 0 00-5 0v2h5zM12 7.5h.25a.25.25 0 01.25.25v5.5a.25.25 0 01-.25.25h-8.5a.25.25 0 01-.25-.25v-5.5a.25.25 0 01.25-.25H12z" />\
      </svg> to you and cannot be shared.\
    </div>\
  </div>\
</div>\
<div class="row">\
  <div class="col d-flex justify-content-center" id="unhappy-minus">\
    <div class="align-self-center">\
      <svg xmlns="http://www.w3.org/2000/svg" class="unhappy-minus" viewBox="0 0 24 24">\
        <path d="M12.75 11.25h-5a.75.75 0 000 1.5h8.5 a.75.75 0 000-1.5h-3.5z" />\
        <path fill-rule="evenodd"\
          d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zM2.5 12a9.5 9.5 0 1119 0 9.5 9.5 0 01-19 0z" />\
      </svg>\
    </div>\
  </div>\
  <div class="col">\
    <table class="center">\
      <tr>\
        <th id="unhappy">\
          <svg xmlns="http://www.w3.org/2000/svg" id="unhappy-svg" class="unhappy mr-2" viewBox="0 0 24 24">\
            <path\
              d="m 8.456,17.056414 a 0.75,-0.75 0 0 0 1.068,-0.17 3.08,-3.08 0 0 1 0.572,-0.492 3.381,-3.381 0 0 1 1.904,-0.564 c 0.855,0 1.487,0.283 1.904,0.562 a 3.081,-3.081 0 0 1 0.572,0.492 l 0.021,0.026 a 0.7503056,-0.7503056 0 0 0 1.197,-0.905 l -0.027,-0.034 c -0.013,-0.016 -0.03,-0.038 -0.052,-0.063 -0.044,-0.05 -0.105,-0.119 -0.184,-0.198 a 4.569,-4.569 0 0 0 -0.695,-0.566 4.88,-4.88 0 0 0 -2.736,-0.814 4.88,-4.88 0 0 0 -2.736,0.814 4.57,-4.57 0 0 0 -0.695,0.566 3.253,-3.253 0 0 0 -0.236,0.261 c -0.259,0.332 -0.223,0.824 0.123,1.084 z" />\
            <path fill-rule="evenodd"\
              d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zM2.5 12a9.5 9.5 0 1119 0 9.5 9.5 0 01-19 0z" />\
            <path\
              d="M9 10.75a1.25 1.25 0 11-2.5 0 1.25 1.25 0 012.5 0zM16.25 12a1.25 1.25 0 100-2.5 1.25 1.25 0 000 2.5z" />\
          </svg>\
        </th>\
        <th id="happy">\
          <svg xmlns="http://www.w3.org/2000/svg" id="happy-svg" class="happy ml-2" viewBox="0 0 24 24">\
            <path\
              d="M8.456 14.494a.75.75 0 011.068.17 3.08 3.08 0 00.572.492A3.381 3.381 0 0012 15.72c.855 0 1.487-.283 1.904-.562a3.081 3.081 0 00.572-.492l.021-.026a.75.75 0 011.197.905l-.027.034c-.013.016-.03.038-.052.063-.044.05-.105.119-.184.198a4.569 4.569 0 01-.695.566A4.88 4.88 0 0112 17.22a4.88 4.88 0 01-2.736-.814 4.57 4.57 0 01-.695-.566 3.253 3.253 0 01-.236-.261c-.259-.332-.223-.824.123-1.084z" />\
            <path fill-rule="evenodd"\
              d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zM2.5 12a9.5 9.5 0 1119 0 9.5 9.5 0 01-19 0z" />\
            <path\
              d="M9 10.75a1.25 1.25 0 11-2.5 0 1.25 1.25 0 012.5 0zM16.25 12a1.25 1.25 0 100-2.5 1.25 1.25 0 000 2.5z" />\
          </svg>\
        </th>\
      </tr>\
    </table>\
  </div>\
  <div class="col d-flex justify-content-center" id="happy-minus">\
    <div class="align-self-center">\
      <svg xmlns="http://www.w3.org/2000/svg" class="happy-minus" viewBox="0 0 24 24">\
        <path d="M12.75 11.25h-5a.75.75 0 000 1.5h8.5 a.75.75 0 000-1.5h-3.5z" />\
        <path fill-rule="evenodd"\
          d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zM2.5 12a9.5 9.5 0 1119 0 9.5 9.5 0 01-19 0z" />\
      </svg>\
    </div>\
  </div>\
</div>\
<div class="row">\
  <div class="col">\
    <ul class="nav nav-tabs justify-content-center" id="myTab" role="tablist">\
      <li class="nav-item">\
        <a class="nav-link" id="negative-tab" data-toggle="tab" href="#negative" role="tab"\
          aria-controls="negative" aria-selected="false">Negative</a>\
      </li>\
      <li class="nav-item">\
        <a class="nav-link active" id="positive-tab" data-toggle="tab" href="#positive" role="tab"\
          aria-controls="positive" aria-selected="true">Positive</a>\
      </li>\
    </ul>\
    <div class="tab-content my-4" id="myTabContent">\
      <div class="tab-pane fade" id="negative" role="tabpanel" aria-labelledby="negative-tab"\
        align-text="center">Sad Afraid Frustrated Depressed Lonely Embarassed Stressed Demotivated\
        Pessimistic</div>\
      <div class="tab-pane fade show active" id="positive" role="tabpanel" aria-labelledby="positive-tab">\
        Happy Grateful Passionate Loved Proud Mindful Motivated Optimistic\
      </div>\
    </div>\
  </div>\
</div>\
<div class="row">\
  <div class="col">\
    <div>\
      <b>Want more options?</b> You can! <b><a\
          href="https://www.gofundme.com/f/deliver-purpose-with-an-app-for-keeping-promises/donate"><br />Fund\
          it.</a></b>\
      ( Set TIP to <b>"Other - 0%"</b> )<br />\
    </div>\
  </div>\
</div>')
}

function modalVisibilities(properties) {
    setSkeletonHTMLForVisibilities()
    setDataFieldsForVisibilities(properties)
    updateModalUI()
}

function modalNotes(properties) {
    $("#modal-header-content").html('<h4 class="modal-title">notes</h4>')
    $("#modal-body").html('\
    <div class="row">\
    <div class="col">\
      <div id="modal-notes">\
        <b>notes</b><br />\
        Edit the notes you made for this goal.<br />\
        <br />\
        Notes are private <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">\
          <path fill-rule="evenodd"\
            d="M4 4v2h-.25A1.75 1.75 0 002 7.75v5.5c0 .966.784 1.75 1.75 1.75h8.5A1.75 1.75 0 0014 13.25v-5.5A1.75 1.75 0 0012.25 6H12V4a4 4 0 10-8 0zm6.5 2V4a2.5 2.5 0 00-5 0v2h5zM12 7.5h.25a.25.25 0 01.25.25v5.5a.25.25 0 01-.25.25h-8.5a.25.25 0 01-.25-.25v-5.5a.25.25 0 01.25-.25H12z" />\
        </svg> to you and cannot be shared.<br />\
        <br />\
        <b>Want this?</b> You can! <b><a\
            href="https://www.gofundme.com/f/deliver-purpose-with-an-app-for-keeping-promises/donate"><br />Fund\
            it.</a></b>\
        ( Set TIP to <b>"Other - 0%"</b> )<br />\
      </div>\
    </div>\
  </div>')
}

function modalWorkflow(properties) {
    $("#modal-header-content").html('<h4 class="modal-title">workflow</h4>')
    $("#modal-body").html('\
    <div class="row">\
    <div class="col">\
      <div id="modal-workflow">\
        <b>Workflow</b> lets you add dependencies on other goals.<br />\
        Example: Goal A + B need to be achieved before goal C can start.<br />\
        Scheduling will automatically adjust when a goal in the dependency chain changes.<br />\
        <br />\
        <b>Want this?</b> You can! <b><a\
            href="https://www.gofundme.com/f/deliver-purpose-with-an-app-for-keeping-promises/donate"><br />Fund\
            it.</a></b>\
        ( Set TIP to <b>"Other - 0%"</b> )<br />\
      </div>\
    </div>\
  </div>')
}

function modalImage(properties) {
    $("#modal-header-content").html('<h4 class="modal-title">image</h4>')
    $("#modal-body").html('\
    <div class="row">\
    <div class="col">\
      <div id="modal-image">\
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">\
          <path fill-rule="evenodd"\
            d="M1.75 2.5a.25.25 0 00-.25.25v10.5c0 .138.112.25.25.25h.94a.76.76 0 01.03-.03l6.077-6.078a1.75 1.75 0 012.412-.06L14.5 10.31V2.75a.25.25 0 00-.25-.25H1.75zm12.5 11H4.81l5.048-5.047a.25.25 0 01.344-.009l4.298 3.889v.917a.25.25 0 01-.25.25zm1.75-.25V2.75A1.75 1.75 0 0014.25 1H1.75A1.75 1.75 0 000 2.75v10.5C0 14.216.784 15 1.75 15h12.5A1.75 1.75 0 0016 13.25zM5.5 6a.5.5 0 11-1 0 .5.5 0 011 0zM7 6a2 2 0 11-4 0 2 2 0 014 0z" />\
        </svg><b> Image(s)</b> can be added to this goal.<br />\
        <br />\
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">\
          <path\
            d="M12.75 7.75a.75.75 0 00-1.5 0v3.5h-3.5a.75.75 0 000 1.5h3.5v3.5a.75.75 0 001.5 0v-3.5h3.5a.75.75 0 000-1.5h-3.5v-3.5z" />\
          <path fill-rule="evenodd"\
            d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zM2.5 12a9.5 9.5 0 1119 0 9.5 9.5 0 01-19 0z" />\
        </svg> : Add an image\
        <br />\
        <br />\
        <b>Want this?</b> You can! <b><a\
            href="https://www.gofundme.com/f/deliver-purpose-with-an-app-for-keeping-promises/donate"><br />Fund\
            it.</a></b>\
        ( Set TIP to <b>"Other - 0%"</b> )<br />\
      </div>\
    </div>\
  </div>')
}

function modalLink(properties) {
    $("#modal-header-content").html('<h4 class="modal-title">link</h4>')
    $("#modal-body").html('\
    <div class="row">\
    <div class="col">\
      <div id="modal-link">\
        A <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">\
          <path fill-rule="evenodd"\
            d="M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z" />\
        </svg> <b>link</b> turns the goal into a website shortcut.<br />\
        (instead of going to the list of subgoals)<br />\
        <br />\
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">\
          <path\
            d="M12.75 7.75a.75.75 0 00-1.5 0v3.5h-3.5a.75.75 0 000 1.5h3.5v3.5a.75.75 0 001.5 0v-3.5h3.5a.75.75 0 000-1.5h-3.5v-3.5z" />\
          <path fill-rule="evenodd"\
            d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zM2.5 12a9.5 9.5 0 1119 0 9.5 9.5 0 01-19 0z" />\
        </svg> : Add a link\
        <br />\
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">\
          <path fill-rule="evenodd"\
            d="M2 9.75C2 8.784 2.784 8 3.75 8h2.5a.75.75 0 010 1.5h-2.5a.25.25 0 00-.25.25v10.5c0 .138.112.25.25.25h10.5a.25.25 0 00.25-.25v-2.5a.75.75 0 011.5 0v2.5A1.75 1.75 0 0114.25 22H3.75A1.75 1.75 0 012 20.25V9.75z" />\
          <path fill-rule="evenodd"\
            d="M8 3.75C8 2.784 8.784 2 9.75 2h10.5c.966 0 1.75.784 1.75 1.75v10.5A1.75 1.75 0 0120.25 16H9.75A1.75 1.75 0 018 14.25V3.75zm1.75-.25a.25.25 0 00-.25.25v10.5c0 .138.112.25.25.25h10.5a.25.25 0 00.25-.25V3.75a.25.25 0 00-.25-.25H9.75z" />\
        </svg> : Copy to clipboard\
        <br />\
        <br />\
        For video\'s and articles a duration is automatically inferred.\
        <br />\
        <br />\
        <b>Want this?</b> You can! <b><a\
            href="https://www.gofundme.com/f/deliver-purpose-with-an-app-for-keeping-promises/donate"><br />Fund\
            it.</a></b>\
        ( Set TIP to <b>"Other - 0%"</b> )<br />\
      </div>\
    </div>\
  </div>')
}

function modalLocation(properties) {
    $("#modal-header-content").html('<h4 class="modal-title">location</h4>')
    $("#modal-body").html('\
    <div class="row">\
    <div class="col">\
      <div id="modal-location">\
        <b>Locations</b><br />\
        Set the location(s) for working on this goal.<br />\
        You will only be reminded if at the right location.<br />\
        Travelling times between locations will be auto suggested.<br />\
        <br />\
        Examples: <br>\
        - At work<br />\
        - While walking<br />\
        - Near someone that shares this goal<br />\
        - While being transported<br />\
        - At the supermarket<br />\
        <br />\
        <b>Want this?</b> You can! <b><a\
            href="https://www.gofundme.com/f/deliver-purpose-with-an-app-for-keeping-promises/donate"><br />Fund\
            it.</a></b>\
        ( Set TIP to <b>"Other - 0%"</b> )<br />\
      </div>\
    </div>\
  </div>')
}

function modalTags(properties) {
    $("#modal-header-content").html('\
    <table>\
    <tr>\
      <th>\
        <div class="mr-2" id="modal-title-tag">\
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">\
            <path class="tag3 tag-selected" id="modal-title-tag-path"\
              d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1z" />\
          </svg>\
        </div>\
      </th>\
      <th>\
        <div id="modal-title">...</div>\
      </th>\
    </tr>\
  </table>')
    $("#modal-body").html('\
  <div class="row">\
  <div class="col">\
    <div id="modal-tags">\
      <b>Tags </b>are a quick way of seeing what top-line goal(s) a subgoal or activity contributes\
      to.<br />\
      <br />\
      <table>\
        <caption>Choose a color for your tag </caption>\
        <tr>\
          <th>\
            <div class="m-3" id="tag1">\
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">\
                <path class="tag1 tag-path" id="tag1-path"\
                  d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1z" />\
              </svg>\
            </div>\
          </th>\
          <th>\
            <div class="m-3" id="tag2">\
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">\
                <path class="tag2 tag-path" id="tag2-path"\
                  d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1z" />\
              </svg>\
            </div>\
          </th>\
          <th>\
            <div class="m-3" id="tag3">\
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">\
                <path class="tag3 tag-path" id="tag3-path"\
                  d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1z" />\
              </svg>\
            </div>\
          </th>\
          <th>\
            <div class="m-3" id="tag4">\
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">\
                <path class="tag4 tag-path" id="tag4-path"\
                  d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1z" />\
              </svg>\
            </div>\
          </th>\
          <th>\
            <div class="m-3" id="tag5">\
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">\
                <path class="tag5 tag-path" id="tag5-path"\
                  d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1z" />\
              </svg>\
            </div>\
          </th>\
        </tr>\
        <tr>\
          <td>\
            <div class="m-3" id="tag6">\
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">\
                <path class="tag6 tag-path" id="tag6-path"\
                  d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1z" />\
              </svg>\
            </div>\
          </td>\
          <td>\
            <div class="m-3" id="tag7">\
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">\
                <path class="tag7 tag-path" id="tag7-path"\
                  d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1z" />\
              </svg>\
            </div>\
          </td>\
          <td>\
            <div class="m-3" id="tag8">\
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">\
                <path class="tag8 tag-path" id="tag8-path"\
                  d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1z" />\
              </svg>\
            </div>\
          </td>\
          <td>\
            <div class="m-3" id="tag9">\
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">\
                <path class="tag9 tag-path" id="tag9-path"\
                  d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1z" />\
              </svg>\
            </div>\
          </td>\
          <td>\
            <div class="m-3" id="tag10">\
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">\
                <path class="tag10 tag-path" id="tag10-path"\
                  d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1z" />\
              </svg>\
            </div>\
          </td>\
\
        </tr>\
      </table>\
      <br />\
      <b>Want more options?</b> You can! <b><a\
          href="https://www.gofundme.com/f/deliver-purpose-with-an-app-for-keeping-promises/donate"><br />Fund\
          it.</a></b>\
      ( Set TIP to <b>"Other - 0%"</b> )<br />\
    </div>\
  </div>\
</div>')
}

function modalMail(properties) {
    $("#modal-header-content").html('<h4 class="modal-title">mail</h4>')
    $("#modal-body").html('\
    <table class="table table-hover">\
    <thead>\
      <tr>\
        <th scope="col">Person</th>\
        <th scope="col">MessageType</th>\
        <th scope="col">Message</th>\
        <th scope="col">ReplyBy</th>\
      </tr>\
    </thead>\
    <tbody>\
      <tr>\
        <td>Ceetje</td>\
        <td>...</td>\
        <td>...</td>\
        <td>...</td>\
      </tr>\
      <tr>\
        <td>Ietje</td>\
        <td>...</td>\
        <td>...</td>\
        <td>...</td>\
      </tr>\
      <tr>\
        <td>Ceetje</td>\
        <td>...</td>\
        <td>...</td>\
        <td>...</td>\
      </tr>\
    </tbody>\
  </table>')
}

function modalScheduleConstraints(properties) {
    setDataFieldsForScheduleConstraints(properties)
    updateModalUI()
}