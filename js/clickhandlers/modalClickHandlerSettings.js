'use strict'

$("#myModal").on("click", "#login-buttonx", function () {
    console.log("log in")
    redirectUserAgentToAuthorizeEndpoint()
});

$("#myModal").on("click", "#install-app-button", function () {
    isInstalled()
    console.log("Trying to install app...")
    tryToInstall()
});

async function isInstalled() {
    console.log("Checking if app installed...")
    let relatedAppsInstalled = await navigator.getInstalledRelatedApps()
    console.log("installedRelatedApps:", relatedAppsInstalled)
}

$("#myModal").on("click", "#allow-notify-button", function () {
    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
        return
    }

    switch (Notification.permission) {
        case "granted":
            $("#allow-notify-button").html('Notification on')
            $("#allow-notify-button").addClass('active')
            var notification = new Notification("Hi there!")
            break;

        default:
            Notification.requestPermission().then(function (permission) {
                if (permission === "granted") {
                    $("#allow-notify-button").html('Notification on')
                    $("#allow-notify-button").addClass('active')
                    var notification = new Notification("Hi there!")
                } else {
                    $("#allow-notify-button").html('Notifications denied in browser/app settings.')
                    $("#allow-notify-message").html("Type chrome://settings/content/notifications in your browser to change.")
                }
            });
            break;
    }
})


async function tryToInstall() {
    // Hide the app provided install promotion
    hideInstallPromotion();
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    // Optionally, send analytics event with outcome of user choice
    console.log(`User response to the install prompt: ${outcome}`);
    // We've used the prompt, and can't use it again, throw it away
    deferredPrompt = null;
}

$("#myModal").on("click", "#screen-mode-dark", function () {
    let message = {
        action: "command",
        command: "updateSettings",
        screenMode: "dark"
    }
    send(JSON.stringify(message))
});

$("#myModal").on("click", "#screen-mode-light", function () {
    let message = {
        action: "command",
        command: "updateSettings",
        screenMode: "light"
    }
    send(JSON.stringify(message))
});

$("#myModal").on("click", "#screen-mode-time-based", function () {
    let message = {
        action: "command",
        command: "updateSettings",
        screenMode: "timeBased"
    }
    // send(JSON.stringify(message))
});