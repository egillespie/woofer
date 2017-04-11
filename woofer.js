var woofText = document.getElementById('woof-text')
var woofs = document.getElementById('woofs')
var woofCreate = document.getElementById('woof-button')

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

// Adds a new row to the list of woofs
function addWoofRow (woofKey, woof) {
  var template = document.getElementById('woof-template')
  var clone = document.importNode(template.content, true)

  clone.querySelector('.row').id = woofKey
  clone.querySelector('.created-at').textContent = moment(woof.created_at).calendar()
  clone.querySelector('.text').textContent = woof.text
  clone.querySelector('.btn-edit').addEventListener('click', showWoofTextbox)
  clone.querySelector('.btn-delete').addEventListener('click', deleteWoof)
  clone.querySelector('input').addEventListener('keyup', editWoof)

  woofs.insertBefore(clone, woofs.firstChild)
  woofText.value = ''
}

// Adds a new woof to the database
function addWoof (text) {
  firebase.database().ref('woofs').push({
    created_at: new Date().getTime(),
    text: text
  })
}

// Get woof text from input and pass it to addWoof
function createWoof () {
  var text = woofText.value || ''
  if (!text.trim().length) return
  addWoof(text)
}

// Make the textbox to edit a woof appear
function showWoofTextbox () {
  var row = this.parentElement.parentElement
  var textbox = row.querySelector('input')
  var form = textbox.parentElement
  var text = row.querySelector('.text')

  textbox.value = row.querySelector('.text').textContent
  text.className = text.className.replace('show', 'hidden')
  form.className = form.className.replace('hidden', 'show')
  textbox.focus()
  textbox.select()
}

// If Enter was pressed, update woof in database,
// If Escape was pressed, hide the textbox
function editWoof (event) {
  var row = this.parentElement.parentElement.parentElement
  var textbox = row.querySelector('input')
  var form = textbox.parentElement
  var text = row.querySelector('.text')

  if (event.keyCode === 13) {
    // Enter key pressed
    firebase.database().ref('woofs').child(row.id).child('text').set(textbox.value)
  } else if (event.keyCode === 27) {
    // Escape key pressed
    form.className = form.className.replace('show', 'hidden')
    text.className = text.className.replace('hidden', 'show')
  }
}

// Update the woof text in a row on the page
function updateWoofRow (row, woof) {
  var form = row.querySelector('input').parentElement
  var text = row.querySelector('.text')
  form.className = form.className.replace('show', 'hidden')
  row.querySelector('.text').textContent = woof.text
  text.className = text.className.replace('hidden', 'show')
}

// Remove a woof row from the page
function deleteWoofRow (row) {
  row.parentElement.removeChild(row)
}

// Remove the clicked woof from the database
function deleteWoof () {
  var row = this.parentElement.parentElement
  firebase.database().ref('woofs').child(row.id).remove()
}

// Update the page when woofs are added, changed, or removed
var woofsRef = firebase.database().ref('woofs')
woofsRef.on('child_added', function (woofSnapshot) {
  addWoofRow(woofSnapshot.key, woofSnapshot.val())
})
woofsRef.on('child_changed', function (woofSnapshot) {
  var row = document.getElementById(woofSnapshot.key)
  updateWoofRow(row, woofSnapshot.val())
})
woofsRef.on('child_removed', function (woofSnapshot) {
  var row = document.getElementById(woofSnapshot.key)
  deleteWoofRow(row)
})

// Event listeners to add a new woof
woofCreate.addEventListener('click', createWoof)
woofText.addEventListener('keypress', function (event) {
  if (event.keyCode === 13) createWoof()
})
