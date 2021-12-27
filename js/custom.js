'use strict';

var serviceWorker = null
var sessionId = uuidv4()
var parentId = sessionId
var MAX_LEVELS = 10
var MAX_SUBLISTS = 33
let MAX_CALENDAR_DAYS = 3
var calendar = { "max_time_units": MAX_CALENDAR_DAYS * 24, "time_unit_qualifier": "h", "tasks": [], "slots": [], "startEpoch": dayjs().startOf('day').valueOf() }
let wasmModule
let deleteMode = false

var repository = new loki("ZinZen.db", { //Todo: use more complicated indexedDB adapter here if synchronous calls to localStorage are taking too long
    autoload: true,
    autoloadCallback: databaseInitialize,
    autosave: true,
    autosaveInterval: 4000
});


var goals
var relationships
var translations
var settings
var tasks
var taskRelations
var slots
var tempSlots
var tempTasks
var tempTaskRelations

function databaseInitialize() {
    goals = repository.getCollection('goals')
    relationships = repository.getCollection('relationships')
    translations = repository.getCollection('translations')
    settings = repository.getCollection('settings')
    tasks = repository.getCollection('tasks')
    taskRelations = repository.getCollection('taskRelations')
    slots = repository.getCollection('slots')
    tempSlots = repository.getCollection('tempSlots')
    tempTasks = repository.getCollection('tempTasks')
    tempTaskRelations = repository.getCollection('tempTaskRelations')

    if (goals == null && relationships == null) {
        goals = repository.addCollection('goals', {
            unique: ['id']
        })
        relationships = repository.addCollection('relationships', {})
        loadGoalsAndRelationships()
    } else {
        sessionId = goals.find({ label: 'person' })[0].id
        console.log("getting sessionId from db:", sessionId)
        parentId = sessionId
    }

    if (tasks == null) {
        tasks = repository.addCollection('tasks', {
            unique: ['id']
        })
    }

    if (taskRelations == null) {
        taskRelations = repository.addCollection('taskRelations', {})
    }

    if (slots == null) {
        slots = repository.addCollection('slots', {})
    }

    if (tempSlots == null) {
        tempSlots = repository.addCollection('tempSlots', {})
    }

    if (tempTasks == null) {
        tempTasks = repository.addCollection('tempTasks', {
            unique: ['id']
        })
    }

    if (tempTaskRelations == null) {
        tempTaskRelations = repository.addCollection('tempTaskRelations', {})
    }

    if (settings == undefined || settings.find({ "setting": "settingsLastUpdate" })[0].value < lastSettingsUpdate()) {
        loadSettings()
    }

    loadTranslations()
    goTo(parentId)
    $("#main-quote").html('<center><h1>“' + randomQuote.quote + '”</h1>- ' + randomQuote.author + '</center> ')
    updateUILanguage()
    $("#main-quote").removeClass('d-none')
}

var sortableStartX, sortableStartY, sortableEndX, sortableEndY = 0 //for click or swipe or move detection


const quotes = [
    {
        "quote": "What is essential is invisible to the eye.",
        "author": "Antoine de St Exupéry"
    },
    {
        "quote": "Promises are the central issues of ethics.",
        "author": "Friedrich Nietzsche"
    },
    {
        "quote": "We become what we think.",
        "author": "Buddha"
    },
    {
        "quote": "Make the days count.",
        "author": "Muhammad Ali"
    },
    {
        "quote": "You can do anything, but not everything.",
        "author": "David Allen"
    },
    {
        "quote": "You dont have to see the whole staircase just the first step.",
        "author": "Martin Luther King"
    },
    {
        "quote": "It isn't normal to know what we want",
        "author": "Maslow"
    },
    {
        "quote": "Schedule your priorities.",
        "author": "Stephen Covey"
    },
    {
        "quote": "We are what we repeatedly do.",
        "author": "Aristotle"
    },
    {
        "quote": "How is it that we're so good at technology, and yet so poor at human cooperation?",
        "author": "Mark Burgess"
    },
    {
        "quote": "Change happens.",
        "author": "Mark Burgess"
    }
]
const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

var myHeaders = new Headers();
myHeaders.set('Cache-Control', 'no-store');
var urlParams = new URLSearchParams(window.location.search);
var id_token = sessionStorage.id_token
console.log("sessionStorage.id_token", id_token)

window.mobileAndTabletCheck = function () {
    let check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};

function updateUIChildrenFor(parentId) {
    console.log("inside updateUIChildrenFor...")
    let relationshipsForParent = relationships.chain().find({ 'parentId': parentId }).simplesort('priority', { desc: true }).limit(MAX_SUBLISTS).data()
    relationshipsForParent.forEach(relationship => {
        let childResults = goals.find({ 'id': relationship.childId })
        updateUIWith(childResults[0])
        if (relationships.find({ parentId: relationship.childId }).length > 0) {
            $("#" + relationship.childId).addClass("double-bottom")
        }
    });
}

// Initialize deferredPrompt for use later to show browser install prompt.
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    // use this prompt in a user-triggerd function like this: deferredPrompt.prompt();
    // Optionally, send analytics event that PWA install promo was shown.
    console.log(`'beforeinstallprompt' event was fired.`);
});

window.addEventListener("load", () => {
    if ("serviceWorker" in navigator) {
        const url = "https://www.zinzen.me"
        serviceWorker = navigator.serviceWorker.register("service-worker.js", { scope: url })
            .then(swReg => {
                console.log("Service Worker is registered", swReg);
                serviceWorker = swReg;
            }, reason => {
                console.log("rejected reason:", reason)
                const url2 = "https://zinzen.me"
                serviceWorker = navigator.serviceWorker.register("service-worker.js", { scope: url2 })
                    .then(swReg => {
                        console.log("Service Worker is registered", swReg);
                        serviceWorker = swReg;
                    }, reason => {
                        console.log("rejected reason:", reason)
                    });
            });
    }
    wasmModule = wasm_bindgen("./zinzen_scheduler_bg.wasm")
});

$("#main-promised").sortable({
    appendTo: document.body,
    delay: 0,
    distance: 10,
    scroll: true,
    scrollSpeed: 40,
    handle: ".circle-col",
    cursor: "move",
    scrollSensitivity: 50
});


$(function () {
    FastClick.attach(document.body);
});

//disable back button on android
//https://stackoverflow.com/questions/43329654/android-back-button-on-a-progressive-web-application-closes-de-app
window.addEventListener('load', function () {
    window.history.pushState({}, '')
})

window.addEventListener('popstate', function () {
    window.history.pushState({}, '')
})

async function showInstallPrompt() {
    console.log("Inside showInstallPrompt()...")
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    // Optionally, send analytics event with outcome of user choice
    console.log(`User response to the install prompt: ${outcome}`);
    // We've used the prompt, and can't use it again, throw it away
    deferredPrompt = null;
}