'use strict';

var WS = undefined;
var received_msg
var settings = []
var publicOrPrivate = undefined
var serviceWorker = null

var myHeaders = new Headers();
myHeaders.set('Cache-Control', 'no-store');
var urlParams = new URLSearchParams(window.location.search);
var id_token = sessionStorage.id_token
console.log("sessionStorage.id_token", id_token)

window.mobileAndTabletCheck = function() {
    let check = false;
    (function(a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};

function openWS(authorizer, stage, WSEndpoint) {
    if (!("WebSocket" in window)) {
        alert("WebSocket is not supported by your Browser... :(");
        return;
    }

    WS = new WebSocket(
        WSEndpoint + "/" + stage + "?Authorizer=" + authorizer
    );

    WS.onopen = function() {
        console.log("websocket opened")
        const interval = setInterval(function() { //TODO: Check if response actually comes in - otherwise re-open websocket
            send('{"action":"read","readRequestType":"play"}')
        }, 60000);
        $("#main-promised").empty();
        let parentId = ""
        if (urlParams.get("listId") != undefined) {
            parentId = urlParams.get("listId")
        }
        send('{"action":"read","readRequestType":"allSubsFor","status":"promised","parentId":"' + parentId + '"}');
        send('{"action":"read","readRequestType":"play"}')
        send('{"action":"read","readRequestType":"settings"}')
    };

    WS.onmessage = function(evt) {
        try {
            console.log(new Date().toLocaleTimeString("en-US") + " received event of type " + evt.type + ":", evt);
            received_msg = JSON.parse(evt.data, reviver); //made global temporarily for debugging in console
            console.log("parsed message:", received_msg)

            received_msg.forEach(function(item, index) {
                switch (item.get("responseType")) {
                    case "specificNode":
                        console.log("case for specificNode")
                        if (item.has("properties")) {
                            let properties = item.get("properties")
                            properties.set('directParents', item.get('directParents'))
                            properties.set('ultimateParents', item.get('ultimateParents'))
                            properties.set('subCount', item.get('subCount'))
                            properties.set('scheduledBeginISO', item.get('scheduledBeginISO'))
                            properties.set('scheduledEndISO', item.get('scheduledEndISO'))
                            let isNew = !($('#' + item.get('id')).length)
                            handleIncomingProperties(properties)
                            if (isNew) {
                                $('#' + item.get('id')).addClass('jello-vertical-animation')
                            }
                        }
                        break;

                    case "probeResults":
                        handleIncomingProposal(item.get("schedule"))
                        break;

                    case "allSubs":
                        $("#main-promised").empty()
                        console.log("breadcrumb goals received:", item.get("goalsBreadcrumb"))
                        $("#breadcrumb").data("top", item.get("username"))
                        $("#breadcrumb").data("goals", item.get("goalsBreadcrumb"))
                        updateBreadcrumbUI()

                        $("#main-promised").sortable("disable")
                        $("#move-a-goal-button").addClass('disabled')
                        $("#move-a-goal-button").removeClass('disabled')

                        item.get("allSubs").forEach(sub => {
                            let properties = sub.get("properties")
                            properties.set('directParents', sub.get('directParents'))
                            properties.set('ultimateParents', sub.get('ultimateParents'))
                            properties.set('subCount', sub.get('subCount'))
                            properties.set('scheduledBeginISO', sub.get('scheduledBeginISO'))
                            properties.set('scheduledEndISO', sub.get('scheduledEndISO'))
                            handleIncomingProperties(properties)
                        })

                        if (item.get("allSubs").length == 0) {
                            $("#main-promised").html(`<div id="add-a-goal"><p class="no-lists-yet"><br />No lists here yet...</p></div>`) //Todo use item.get("goalsBreadCrumb") array to customize to parent name
                            $("#inputCommand").focus()
                        }
                        break;

                    case "play":
                        handleIncomingPlay(item.get("schedule"))
                        break;

                    case "settings":
                        handleIncomingSettings(item.get("settings"))
                        break;

                    default:
                        console.log("UNDEFINED RESPONSE");
                        return;
                }


            });


        } catch (err) {
            console.log("Websocket not responding or undefined/error response...:", err)
        }
    };

    WS.onclose = function() {
        // websocket is closed.
        clearInterval(interval)
        alert("Connection " + stage + " is closed...");
    };

}

function send(jsonString) {
    let sendId = uuidv4()
    let json = JSON.parse(jsonString)
    json.sendId = sendId
    if (publicOrPrivate == "public") {
        if (urlParams.get('profile') != undefined) {
            json.profile = urlParams.get('profile')
        }
    }
    console.log("sending:", JSON.stringify(json))
    WS.send(JSON.stringify(json))
}

function replyToMail(goalId, messageId, response) {
    console.log("messageId:" + messageId + " and reply:" + response);
    WS.send(
        '{"action":"message","command":"message.reply","messageId":"' +
        messageId +
        '","reply":"' +
        response +
        '","goalId":"' +
        goalId +
        '"}'
    );
}

if (
    urlParams.get('profile') != undefined &&
    urlParams.get('code') != undefined
) {
    console.log('showing profile while logged in: ' + urlParams.get('profile'))
    openWS("publicUser", "public", _config.publicWSEndpoint)
    publicOrPrivate = "public"
    $("#inputCommand").attr('placeholder', 'Suggest something to add...')
} else if (
    urlParams.get('profile') != undefined &&
    urlParams.get('code') == undefined
) {
    console.log('showing profile without being logged in' + urlParams.get('profile'))
    openWS("publicUser", "public", _config.publicWSEndpoint)
    publicOrPrivate = "public"
    $("#inputCommand").attr('placeholder', 'Suggest something to add...')
} else if (
    urlParams.get('profile') == undefined &&
    urlParams.get('code') == undefined
) {
    console.log('showing general info page')
    $("#main-promised").addClass('d-none')
    $("#control-part-screen").addClass('d-none')
    $("#breadcrumb").addClass('d-none')
    $("#main-info").removeClass('d-none')
    $("#main-search").addClass('d-none')
    if (urlParams.get('page') == 'privacy') {
        $("#main-privacy").click()
        $("#main-info-privacy-details").removeClass('d-none')
        $("#main-info-about-details").addClass('d-none')
        $("#main-info-terms-details").addClass('d-none')
    }
    if (urlParams.get('page') == 'terms') {
        $("#main-terms").click()
        $("#main-info-privacy-details").addClass('d-none')
        $("#main-info-about-details").addClass('d-none')
        $("#main-info-terms-details").removeClass('d-none')
    }
} else if (
    sessionStorage.getItem("pkce_state") != urlParams.get('state')
) { //Could get a valid token without state (only with code) but 
    console.log("state is stale; logging in again")
        // Authorization Code Flow with Proof Key Code Exchange (PKCE) is recommended for public clients, such as single-page apps or native mobile apps. 
    redirectUserAgentToAuthorizeEndpoint()
} else {
    requestToken(urlParams.get('code')).then(
        tokenReceived => {
            console.log("Token valid2 - let's go!")
            openWS(tokenReceived, "prod", _config.privateWSEndpoint)
            publicOrPrivate = "private"
        }, error => {
            urlParams.set('code', null) //to avoid loop with invalid code
            sessionStorage.clear()
            console.log("request token failed2:", error)
            redirectUserAgentToAuthorizeEndpoint()
        }
    );
}

//initialize all tooltips on index.html:
if (!mobileAndTabletCheck()) {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl, { delay: { "show": 500, "hide": 100 } })
    })
}


$("#app-version").html(_config.deployVersion)

// Initialize deferredPrompt for use later to show browser install prompt.
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    // Update UI notify the user they can install the PWA
    showInstallPromotion();
    // Optionally, send analytics event that PWA install promo was shown.
    console.log(`'beforeinstallprompt' event was fired.`);
});

window.addEventListener("load", () => {
    if ("serviceWorker" in navigator) {
        const url = "https://zinzen.me"
        const scope = new URL("/", url)
        serviceWorker = navigator.serviceWorker.register("service-worker.js", { scope: url })
            .then(swReg => {
                console.log("Service Worker is registered", swReg);
                serviceWorker = swReg;
            })
    }
});

$("#main-promised").sortable({
    appendTo: document.body,
    delay: 1,
    scroll: true,
    scrollSpeed: 40
});

$("#main-promised").sortable("disable");