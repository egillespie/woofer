// Sign into the database anonymously
var config = {
  apiKey: "AIzaSyCbeTKiZUIefKvL1AkpnzHLoK1rZOznBSU",
  authDomain: "woofer-db.firebaseapp.com",
  databaseURL: "https://woofer-db.firebaseio.com",
  projectId: "woofer-db",
  storageBucket: "woofer-db.appspot.com",
  messagingSenderId: "354019295570"
}
firebase.initializeApp(config)
firebase.auth().signInAnonymously()

// CREATE a new woof in Firebase
function createWoofInDatabase (woof) {
  firebase.database().ref('woofs').push(woof)
}

// READ from Firebase when woofs are added, changed, or removed
// Call addWoofRow, updateWoofRow, and deleteWoofRow to update the page
function readWoofsInDatabase () {
  var woofsRef = firebase.database().ref('woofs')
  woofsRef.on('child_added', function (woofSnapshot) {
    addWoofRow(woofSnapshot.key, woofSnapshot.val())
  })
  woofsRef.on('child_changed', function (woofSnapshot) {
    updateWoofRow(woofSnapshot.key, woofSnapshot.val())
  })
  woofsRef.on('child_removed', function (woofSnapshot) {
    deleteWoofRow(woofSnapshot.key)
  })
}

// UPDATE the woof in Firebase
function updateWoofInDatabase (woofKey, woofText) {
  firebase.database().ref('woofs').child(woofKey).child('text').set(woofText)
}

// DELETE the woof from Firebase
function deleteWoofFromDatabase (woofKey) {
  firebase.database().ref('woofs').child(woofKey).remove()
}

// Load all of the data
readWoofsInDatabase()
