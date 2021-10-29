'use strict'

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