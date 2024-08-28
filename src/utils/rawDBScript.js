// var openRequest = indexedDB.open("ZinZenDB", 40);

// openRequest.onsuccess = function (event) {
//   const db = event.target.result;

//   // Start a transaction and retrieve data
//   const transaction = db.transaction(["taskCollection"], "readwrite");
//   const objectStore = transaction.objectStore("taskCollection");

//   const getRequest = objectStore.get("533c84c6-385e-4a2f-b1e1-9167d37f2d14");

//   getRequest.onsuccess = function (event) {
//     const data = event.target.result;

//     // Modify the desired field(s)
//     data.lastCompleted = "5/5/2023";
//     data.lastSkipped = "5/5/2023";
//     data.hoursSpent = 5;

//     // Put the modified data back into the object store
//     const putRequest = objectStore.put(data);

//     putRequest.onsuccess = function (event) {
//       console.log("Data updated successfully");
//     };

//     putRequest.onerror = function (event) {
//       console.error("Error updating data: ", event.target.error);
//     };
//   };

//   transaction.oncomplete = function (event) {
//     db.close();
//   };
// };
