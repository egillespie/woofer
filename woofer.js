var woofText = document.getElementById('woof-text')
var woofs = document.getElementById('woofs')
var woofCreate = document.getElementById('woof-button')

function addWoof (id, woof) {
  var template = document.getElementById('woof-template')
  var clone = document.importNode(template.content, true)

  clone.querySelector('.row').id = id
  clone.querySelector('p').textContent = woof.text
  clone.querySelector('.btn-edit').addEventListener('click', showWoofTextbox)
  clone.querySelector('.btn-delete').addEventListener('click', deleteWoof)
  clone.querySelector('input').addEventListener('keyup', editWoof)

  woofs.insertBefore(clone, woofs.firstChild)
  woofText.value = ''
}

function createWoof () {
  var text = woofText.value || ''
  if (!text.trim().length) return

  addWoof(guid(), {
    created_at: new Date().getTime(),
    text: text
  })
}

function showWoofTextbox () {
  var row = this.parentElement.parentElement
  var textbox = row.querySelector('input')
  var form = textbox.parentElement

  textbox.value = row.querySelector('p').textContent
  form.className = form.className.replace('hidden', 'show')
  textbox.focus()
  textbox.select()
}

function editWoof (event) {
  var row = this.parentElement.parentElement
  var textbox = row.querySelector('input')
  var form = textbox.parentElement

  if (event.keyCode === 13) {
    // Enter key pressed
    row.querySelector('p').textContent = textbox.value
    form.className = form.className.replace('show', 'hidden')
  } else if (event.keyCode === 27) {
    // Escape key pressed
    form.className = form.className.replace('show', 'hidden')
  }
}

function deleteWoof () {
  var row = this.parentElement.parentElement
  row.parentElement.removeChild(row)
}

function guid () {
  function s4 () {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4()
}

woofCreate.addEventListener('click', createWoof)
woofText.addEventListener('keypress', function (event) {
  if (event.keyCode === 13) createWoof()
})
