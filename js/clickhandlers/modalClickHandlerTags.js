'use strict'

$("#tag1").click(function() {
    removeSelectedTag()
    $("#tag1-path").addClass("tag-selected")
    $("#modal-title-tag-path").addClass("tag1")
        //find id
        //send update to api
});

$("#tag2").click(function() {
    removeSelectedTag()
    $("#tag2-path").addClass("tag-selected")
    $("#modal-title-tag-path").addClass("tag2")
});

$("#tag3").click(function() {
    removeSelectedTag()
    $("#tag3-path").addClass("tag-selected")
    $("#modal-title-tag-path").addClass("tag3")
});

$("#tag4").click(function() {
    removeSelectedTag()
    $("#tag4-path").addClass("tag-selected")
    $("#modal-title-tag-path").addClass("tag4")
});

$("#tag5").click(function() {
    removeSelectedTag()
    $("#tag5-path").addClass("tag-selected")
    $("#modal-title-tag-path").addClass("tag5")
});

$("#tag6").click(function() {
    removeSelectedTag()
    $("#tag6-path").addClass("tag-selected")
    $("#modal-title-tag-path").addClass("tag6")
});

$("#tag7").click(function() {
    removeSelectedTag()
    $("#tag7-path").addClass("tag-selected")
    $("#modal-title-tag-path").addClass("tag7")
});

$("#tag8").click(function() {
    removeSelectedTag()
    $("#tag8-path").addClass("tag-selected")
    $("#modal-title-tag-path").addClass("tag8")
});

$("#tag9").click(function() {
    removeSelectedTag()
    $("#tag9-path").addClass("tag-selected")
    $("#modal-title-tag-path").addClass("tag9")
});

$("#tag10").click(function() {
    removeSelectedTag()
    $("#tag10-path").addClass("tag-selected")
    $("#modal-title-tag-path").addClass("tag10")
});

function removeSelectedTag() {
    $("#tag1-path,#tag2-path,#tag3-path,#tag4-path,#tag5-path,#tag6-path,#tag7-path,#tag8-path,#tag9-path,#tag10-path").removeClass("tag-selected")
    $("#modal-title-tag-path").removeClass("tag1 tag2 tag3 tag4 tag5 tag6 tag7 tag8 tag9 tag10")
}