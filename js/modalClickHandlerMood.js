'use strict'

$("#unhappy").click(function() {
    console.log("unhappy clicked")
    setMoodsToUnhappy()
        //find id
        //send update to api

    //todo move changes in UI to message handler
    $("#unhappy-svg").removeClass("unhappy-0 unhappy-1 unhappy-2 unhappy-3 unhappy-4 unhappy-5")
    $("#unhappy-svg").addClass("unhappy-1")
});

$("#happy").click(function() {
    console.log("happy clicked")
    setMoodsToHappy()
        //find id
        //send update to api

    //todo move changes in UI to message handler
    $("#happy-svg").removeClass("happy-0 happy-1 happy-2 happy-3 happy-4 happy-5")
    $("#happy-svg").addClass("happy-1")
});

$("#happy").click(function() {
    console.log("happy clicked")
    setMoodsToHappy()
        // $("#tag1-path").addClass("tag-selected")
        // $("#modal-title-tag-path").addClass("tag1")
        //find id
        //send update to api
});

$("#unhappy-minus").click(function() {
    console.log("unhappy-minus clicked")
    setMoodsToUnhappy()
        // $("#tag1-path").addClass("tag-selected")
        // $("#modal-title-tag-path").addClass("tag1")
        //find id
        //send update to api
});

$("#happy-minus").click(function() {
    console.log("happy-minus clicked")
    setMoodsToHappy()
        // $("#tag1-path").addClass("tag-selected")
        // $("#modal-title-tag-path").addClass("tag1")
        //find id
        //send update to api
});

// $("#tag1").click(function () {
//     toggleSelectedTag()()
//     $("#tag1-path").addClass("tag-selected")
//     $("#modal-title-tag-path").addClass("tag1")
//     //find id
//     //send update to api
// });

// $("#tag2").click(function () {
//     toggleSelectedTag()()
//     $("#tag2-path").addClass("tag-selected")
//     $("#modal-title-tag-path").addClass("tag2")
// });

// $("#tag3").click(function () {
//     toggleSelectedTag()()
//     $("#tag3-path").addClass("tag-selected")
//     $("#modal-title-tag-path").addClass("tag3")
// });

// $("#tag4").click(function () {
//     toggleSelectedTag()()
//     $("#tag4-path").addClass("tag-selected")
//     $("#modal-title-tag-path").addClass("tag4")
// });

// $("#tag5").click(function () {
//     toggleSelectedTag()()
//     $("#tag5-path").addClass("tag-selected")
//     $("#modal-title-tag-path").addClass("tag5")
// });

// $("#tag6").click(function () {
//     toggleSelectedTag()()
//     $("#tag6-path").addClass("tag-selected")
//     $("#modal-title-tag-path").addClass("tag6")
// });

// $("#tag7").click(function () {
//     toggleSelectedTag()()
//     $("#tag7-path").addClass("tag-selected")
//     $("#modal-title-tag-path").addClass("tag7")
// });

// $("#tag8").click(function () {
//     toggleSelectedTag()()
//     $("#tag8-path").addClass("tag-selected")
//     $("#modal-title-tag-path").addClass("tag8")
// });

// $("#tag9").click(function () {
//     toggleSelectedTag()()
//     $("#tag9-path").addClass("tag-selected")
//     $("#modal-title-tag-path").addClass("tag9")
// });

// $("#tag10").click(function () {
//     toggleSelectedTag()()
//     $("#tag10-path").addClass("tag-selected")
//     $("#modal-title-tag-path").addClass("tag10")
// });

function toggleSelectedTag() {
    // $("#tag1-path,#tag2-path,#tag3-path,#tag4-path,#tag5-path,#tag6-path,#tag7-path,#tag8-path,#tag9-path,#tag10-path").removeClass("tag-selected")
    // $("#modal-title-tag-path").removeClass("tag1 tag2 tag3 tag4 tag5 tag6 tag7 tag8 tag9 tag10")
}

function setMoodsToUnhappy() {
    console.log("moods set to unhappy")
        //setMoodsToUnhappy options
}

function setMoodsToHappy() {
    console.log("moods set to happy")
        //setMoodsToUnhappy options
}