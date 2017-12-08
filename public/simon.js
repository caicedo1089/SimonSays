////INCIO - Idioma
//Definiendo la clase utilizando prototipos
function Lang(language = 'es')
{
  this.diccionary = {}
  this.keyNotFound = []

  if(language == 'en')
  {
    //Se puede cargar json con el idioma
    this.diccionary = {
      'Hola': 'hi'
    }
  }
}

Lang.prototype.get = function get(key)
{
  let result = this.diccionary[key]

  if(!result)
  {
    this.keyNotFound.push(key)
  }
  else
  {
    result = key
  }

  return result
}
////FIN - Idioma

////INICIO - Utils
// Definiendo la clase utilizando Object.create
const Utils = {
  init: function init (ver = '0.1.0')
  {
    let obj = Object.create(this)
    
    obj.ver = ver;

    return obj
  },
  
  generateKeys: function generateKeys (levels = 15) 
  {
    let result = []
    let iRandomKey = this.iGenerateRandomKey(levels)
    let randomKey
    
    while(randomKey = iRandomKey.next() && !randomKey.done)
    {
      result.push(randomKey.value)
    }
    
    return result
    //return new Array(levels).fill(0).map(generateRandomKey)
  },

  generateRandomMinMax: function generateRandomKey (min = 65, max = 90) 
  {
    return Math.round(Math.random() * (max - min) + min)
  },

  iGenerateRandomKey: function iGenerateRandomKey(levelMax = 15)
  {
    let level = 0
    let generateRandomKey = this.generateRandomMinMax
    
    //Closure
    return {
      next: function() 
      {
        let result = {
          done: ++level == levelMax
        }

        if(!result.done)
          result['value'] = generateRandomKey()
        
        return result
      }
    }
  }
}
////FIN - Utils

////INICIO - App
class App {
  
  constructor(utils)
  {
    this.utils = utils
    this.lang = new Lang()

    this.levels = 15
    this.keys = []
  }
  
}
////FIN - App

let myApp = new App( Utils )

let levels
let keys
let keysSpeed
const keyboardKeys = document.querySelectorAll('.key')
const keyboardKeysLength = keyboardKeys.length
let levelbox = document.getElementById('levelbox')
let keyboard = document.getElementById('keyboard')

function setLevel (levelNumber) 
{
  levelbox.className = 'levelbox'
  keyboard.classList.add('active')
  switch (levelNumber) {
    case 1:
      levels = 5
      keysSpeed = 1000
      break
    case 2:
      levels = 10
      keysSpeed = 600
      break
    default:
      levels = 15
      keysSpeed = 300
  }
  keys = generateKeys(levels)
  nextLevel(0)
}

function nextLevel (currentLevel) 
{
  if (currentLevel == levels) {
    return swal({
      title: 'You won!',
      type: 'success',
      text: `Do you want to play again?`,
      showCancelButton: true,
      confirmButtomText: 'Yes',
      cancelButtonText: 'No',
      closeOnConfirm: true
    }, function (ok) {
      if (ok) {
        levelbox.classList.add('active')
        keyboard.className = 'keyboard'
      }
    })
  }

  swal({
    timer: 1000,
    title: `Level ${currentLevel + 1} / ${levels}`,
    showConfirmButton: false
  })

  // Computer shows the current sequence
  for (let i = 0; i <= currentLevel; i++) {
    setTimeout(() => activate(keys[i]), keysSpeed * (i + 1) + 1000)
  }

  // Pointer is on first sequence position
  let i = 0
  let currentKeyCode = keys[i]
  window.addEventListener('keydown', onkeydown)
  for (let k = 0; k < keyboardKeysLength; k++) {
    keyboardKeys[k].addEventListener('click', onclick)
  }

  function onkeydown (ev) {
    keyPressed(ev.keyCode)
  }

  function onclick (ev) {
    keyPressed(ev.target.innerHTML.toUpperCase().charCodeAt(0))
  }

  function keyPressed (key) {
    if (key == currentKeyCode) {
      activate(currentKeyCode, { success: true })
      i++
      if (i > currentLevel) {
        window.removeEventListener('keydown', onkeydown)
        for (let k = 0; k < keyboardKeysLength; k++) {
          keyboardKeys[k].removeEventListener('click', onclick)
        }
        setTimeout(() => nextLevel(i), 1500)
      }
      currentKeyCode = keys[i]
    } else {
      activate(key, { fail: true })
      window.removeEventListener('keydown', onkeydown)
      for (let k = 0; k < keyboardKeysLength; k++) {
        keyboardKeys[k].removeEventListener('click', onclick)
      }
      setTimeout(() => swal({
        title: 'You lost :(',
        type: 'error',
        text: `You pushed ${String.fromCharCode(key).toUpperCase()} and you should push ${String.fromCharCode(keys[i])}\n\nDo you want to try again?`,
        showCancelButton: true,
        confirmButtomText: 'Yes',
        cancelButtonText: 'No',
        closeOnConfirm: true
      }, function (ok) {
        if (ok) {
          levelbox.classList.add('active')
          keyboard.className = 'keyboard'
        }
      }), 1000)
    }
  }
}

function generateRandomKey () 
{
  const min = 65
  const max = 90
  return Math.round(Math.random() * (max - min) + min)
}

function generateKeys (levels) 
{
  return new Array(levels).fill(0).map(generateRandomKey)
}

function getElementByKeyCode (keyCode) 
{
  return document.querySelector(`[data-key="${keyCode}"]`)
}

function activate (keyCode, opts = {}) 
{
  const el = getElementByKeyCode(keyCode)
  el.classList.add('active')
  if (opts.success) {
    el.classList.add('success')
  } else if (opts.fail) {
    el.classList.add('fail')
  }
  setTimeout(() => deactivate(el), 500)
}

function deactivate (el) 
{
  el.className = 'key'
}
