var openRequest = indexedDB.open("ZinZenDB", 40);

openRequest.onsuccess = function (event) {
  var db = event.target.result;

  // Start a transaction and retrieve data
  var transaction = db.transaction(["taskCollection"], "readwrite");
  var objectStore = transaction.objectStore("taskCollection");

  var getRequest = objectStore.get("533c84c6-385e-4a2f-b1e1-9167d37f2d14");

  getRequest.onsuccess = function (event) {
    var data = event.target.result;

    // Modify the desired field(s)
    data.lastCompleted = "5/5/2023";
    data.lastForget = "5/5/2023";
    data.hoursSpent = 5;

    // Put the modified data back into the object store
    var putRequest = objectStore.put(data);

    putRequest.onsuccess = function (event) {
      console.log("Data updated successfully");
    };

    putRequest.onerror = function (event) {
      console.error("Error updating data: ", event.target.error);
    };
  };

  transaction.oncomplete = function (event) {
    db.close();
  };
};
