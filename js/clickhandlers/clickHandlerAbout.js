'use strict'

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

        success: function () {
            // clear form and show a success message
            alert("Thank you so much for your feedback! We will improve.");
            document.getElementById("contact-form").reset();
        },
        error: function () {
            // show an error message
            alert("Aww... So sorry something went wrong. Please try emailing. We'd love to hear from you!");
        }
    });
}

$("#main-example").click(function () {
    window.open('https://zinzen.me/', '_blank');
    $("#main-about").click()
})

$("#main-about").click(function () {
    location.href = "https://ZinZen.me/about.html"
})

$("#main-privacy").click(function () {
    location.href = "https://ZinZen.me/privacy.html"
})

$("#main-terms").click(function () {
    location.href = "https://ZinZen.me/terms.html"
})

$("#main-contact").click(function () {
    location.href = "https://ZinZen.me/contact.html"
})

$("#main-donate").click(function () {
    window.open('https://www.gofundme.com/f/deliver-purpose-with-an-app-for-keeping-promises/donate', '_blank');
    $("#main-about").click()
})

$("#main-blog").click(function () {
    window.open('https://blog.zinzen.me', '_blank');
    $("#main-about").click()
})

//initialize all tooltips
if (!mobileAndTabletCheck()) {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl, { delay: { "show": 500, "hide": 100 } })
    })
}