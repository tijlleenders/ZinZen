'use strict'

async function updateUIWith(properties) {
  // console.log("handling properties:", properties)

  if (properties.label == 'person' || properties.id == parentId) {
    updateChildrenFor(properties)
    updateBreadcrumbUI()
    return
  }

  if (!properties.directParents.includes(parentId)) {
    // console.log("received list that should not be on screen. Probably child of something on screen that is preloaded")
    preloadChildrenFor(properties)
    return
  }

  preloadChildrenFor(properties)
  let id = properties.id

  if (!$('#' + id).length) {
    // console.log("id not yet present, prepending")
    $("#add-a-goal").empty() //Empties the No lists here
    let goalHTML = `<div class="row goal card shadow-sm mb-2" id="` + id + `"></div>`
    $("#main-promised").prepend(goalHTML)
  }
  $("#" + id).data('properties', properties)
  $("#" + id).html(generateGoalHTML(id))

  if ($("#myModal").data("idx") == id) {
    switch ($("#myModal").data("modalType")) {

      case "tags":
        modalTags(properties)
        break;

      case "add":
        setSkeletonHTMLForAdd(id)
        updateModalUI()
        break;

      default:
    }


  }
}

function handleIncomingSettings(incomingSettings) {
  settings = incomingSettings
  parentId = settings.owner[0]
  defaultParentId = settings.owner[0]
  send('{"action":"read","readRequestType":"specificNode","nodeId":"' + parentId + '"}');
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
