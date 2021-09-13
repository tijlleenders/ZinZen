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