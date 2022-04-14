function fetchFeelingsBulk(startDate, endDate) {

}

function fetchFeelingsOn(date) {

}

function addFeeling(feelingData, date) {

}

function updateFeeling(feelingId, date) {

}

function removeFeeling(feelingId, date) {

}

function removeFeelingsBulk(startDate, endDate) {

}

function fetchFeelings

















import loki from 'loki';

var repository = new loki("ZinZen.db", { //Todo: use more complicated indexedDB adapter here if synchronous calls to localStorage are taking too long
    autoload: true,
    autoloadCallback: databaseInitialize,
    autosave: true,
    autosaveInterval: 4000
});
var feelings;
function databaseInitialize() {
    feelings= repository.getCollection('feelings')
    if (feelings== null) {
        feelings= repository.addCollection('feelings', {}); //No need for an id column: // feelings = repository.addCollection('feelings', {unique: ['id']});
    }
}

//Usage:
//feelings.insert(feelingsJavascriptObject)
//feelings.find({...}) see: https://techfort.github.io/LokiJS/
//get ALL the data : feelings.data