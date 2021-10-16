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