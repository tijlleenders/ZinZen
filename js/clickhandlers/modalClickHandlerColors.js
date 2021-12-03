'use strict'

$("#color1").click(function () {
    removeSelectedColor()
    $("#color1-path").addClass("color-selected")
    $("#modal-title-color-path").addClass("color1")
    //find id
    //send update to api
});

$("#color2").click(function () {
    removeSelectedColor()
    $("#color2-path").addClass("color-selected")
    $("#modal-title-color-path").addClass("color2")
});

$("#color3").click(function () {
    removeSelectedColor()
    $("#color3-path").addClass("color-selected")
    $("#modal-title-color-path").addClass("color3")
});

$("#color4").click(function () {
    removeSelectedColor()
    $("#color4-path").addClass("color-selected")
    $("#modal-title-color-path").addClass("color4")
});

$("#color5").click(function () {
    removeSelectedColor()
    $("#color5-path").addClass("color-selected")
    $("#modal-title-color-path").addClass("color5")
});

$("#color6").click(function () {
    removeSelectedColor()
    $("#color6-path").addClass("color-selected")
    $("#modal-title-color-path").addClass("color6")
});

$("#color7").click(function () {
    removeSelectedColor()
    $("#color7-path").addClass("color-selected")
    $("#modal-title-color-path").addClass("color7")
});

$("#color8").click(function () {
    removeSelectedColor()
    $("#color8-path").addClass("color-selected")
    $("#modal-title-color-path").addClass("color8")
});

$("#color9").click(function () {
    removeSelectedColor()
    $("#color9-path").addClass("color-selected")
    $("#modal-title-color-path").addClass("color9")
});

$("#color10").click(function () {
    removeSelectedColor()
    $("#color10-path").addClass("color-selected")
    $("#modal-title-color-path").addClass("color10")
});

function removeSelectedColor() {
    $("#color1-path,#color2-path,#color3-path,#color4-path,#color5-path,#color6-path,#color7-path,#color8-path,#color9-path,#color10-path").removeClass("color-selected")
    $("#modal-title-color-path").removeClass("color1 color2 color3 color4 color5 color6 color7 color8 color9 color10")
}