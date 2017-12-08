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
    let randomKey = iRandomKey.next()
    
    while(!randomKey.done)
    {
      result.push(randomKey.value)
      randomKey = iRandomKey.next()
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
    //Cargamos el tratado de las funcionalidades comunes y el lenguaje
    this.utils = utils
    this.lang = new Lang()

    //Cargamos las vistas
    this.$body = document.querySelectorAll('body')[0]
    this.initView(this.$body)

    //Atributos comunes
    this.levels = 15
    this.keys = this.utils.generateKeys(this.levels)
    this.keysSpeed = 1000

    this.$keyboardKeys = document.querySelectorAll('.key')
    this.keyboardKeysLength = this.$keyboardKeys.length
    this.$levelbox = document.getElementById('levelbox')
    this.$keyboard = document.getElementById('keyboard')
  }
  
  initView($body)
  {
    let view1 = `
    <div id="levelbox" class="levelbox active">
      <h1>Welcome!</h1>
      <p>What level would you like to play?</p>
      <div class="buttonsbox">
        <div class="level" onclick="myApp.setLevel(1)">Easy</div>
        <div class="level" onclick="myApp.setLevel(2)">Medium</div>
        <div class="level" onclick="myApp.setLevel(3)">Hard</div>
      </div>
    </div>
    `

    let view2 = `
    <div id="keyboard" class="keyboard">
      <div class="row">
        <div class="key" data-key="81">q</div>
        <div class="key" data-key="87">w</div>
        <div class="key" data-key="69">e</div>
        <div class="key" data-key="82">r</div>
        <div class="key" data-key="84">t</div>
        <div class="key" data-key="89">y</div>
        <div class="key" data-key="85">u</div>
        <div class="key" data-key="73">i</div>
        <div class="key" data-key="79">o</div>
        <div class="key" data-key="80">p</div>
      </div>
      <div class="row">
        <div class="key" data-key="65">a</div>
        <div class="key" data-key="83">s</div>
        <div class="key" data-key="68">d</div>
        <div class="key" data-key="70">f</div>
        <div class="key" data-key="71">g</div>
        <div class="key" data-key="72">h</div>
        <div class="key" data-key="74">j</div>
        <div class="key" data-key="75">k</div>
        <div class="key" data-key="76">l</div>
      </div>
      <div class="row last">
        <div class="key" data-key="90">z</div>
        <div class="key" data-key="88">x</div>
        <div class="key" data-key="67">c</div>
        <div class="key" data-key="86">v</div>
        <div class="key" data-key="66">b</div>
        <div class="key" data-key="78">n</div>
        <div class="key" data-key="77">m</div>
      </div>
    </div>
    `

    //Agregamos el menú inicial
    $body.innerHTML += view1

    //Agregamos el teclado
    $body.innerHTML += view2
  }

  setLevel (levelNumber)
  {
    this.$levelbox.className = 'levelbox'
    this.$keyboard.classList.add('active')

    switch (levelNumber) {
      case 1:
        this.levels = 5
        this.keysSpeed = 1000
        break
      case 2:
        this.levels = 10
        this.keysSpeed = 600
        break
      default:
        this.levels = 15
        this.keysSpeed = 300
    }

    this.keys = this.utils.generateKeys(this.levels)
    
    this.nextLevel(0)
  }

  nextLevel (currentLevel) 
  {
    if (currentLevel == this.levels)
    {
      return swal({
        title: 'You won!',
        type: 'success',
        text: `Do you want to play again?`,
        showCancelButton: true,
        confirmButtomText: 'Yes',
        cancelButtonText: 'No',
        closeOnConfirm: true
      }, 
      function (ok) 
      {
        if (ok) 
        {
          this.$levelbox.classList.add('active')
          this.$keyboard.className = 'keyboard'
        }
      })
    }
  
    swal({
      timer: 1000,
      title: `Level ${currentLevel + 1} / ${this.levels}`,
      showConfirmButton: false
    })
  
    // Computer shows the current sequence
    for (let i = 0; i <= currentLevel; i++) 
    {
      setTimeout(
        (key) => this.activate(key), 
        this.keysSpeed * (i + 1) + 1000, 
        this.keys[i]
      )
    }
  
    // Pointer is on first sequence position
    let i = 0
    let currentKeyCode = this.keys[i]
    window.addEventListener('keydown', onkeydown)
    for (let k = 0; k < this.keyboardKeysLength; k++) 
    {
      this.$keyboardKeys[k].addEventListener('click', onclick)
    }
  
    function onkeydown (ev) 
    {
      keyPressed(ev.keyCode)
    }
  
    function onclick (ev) 
    {
      keyPressed(ev.target.innerHTML.toUpperCase().charCodeAt(0))
    }
    let _this = this
    function keyPressed (key) 
    {
      console.log('this in keyPressed:', this)
      if (key == currentKeyCode) {
        _this.activate(currentKeyCode, { success: true })
        i++
        if (i > currentLevel) 
        {
          window.removeEventListener('keydown', onkeydown)
          for (let k = 0; k < _this.keyboardKeysLength; k++) 
          {
            _this.$keyboardKeys[k].removeEventListener('click', onclick)
          }
          setTimeout(() => _this.nextLevel(i), 1500)
        }
        currentKeyCode = _this.keys[i]
      } 
      else 
      {
        _this.activate(key, { fail: true })
        
        window.removeEventListener('keydown', onkeydown)
        
        for (let k = 0; k < _this.keyboardKeysLength; k++) 
        {
          _this.$keyboardKeys[k].removeEventListener('click', onclick)
        }

        setTimeout(
          () => swal(
            {
              title: 'You lost :(',
              type: 'error',
              text: `You pushed ${String.fromCharCode(key).toUpperCase()} and you should push ${String.fromCharCode(_this.keys[i])}\n\nDo you want to try again?`,
              showCancelButton: true,
              confirmButtomText: 'Yes',
              cancelButtonText: 'No',
              closeOnConfirm: true
            }, 
            function (ok) 
            {
              if (ok) 
              {
                _this.$levelbox.classList.add('active')
                _this.$keyboard.className = 'keyboard'
              }
            }
          ), 
          1000
        )
      }
    }
  }

  getElementByKeyCode (keyCode) 
  {
    return document.querySelector(`[data-key="${keyCode}"]`)
  }

  activate (keyCode, opts = {}) 
  {
    const $el = this.getElementByKeyCode(keyCode)
    
    $el.classList.add('active')
    
    if (opts.success) {
      $el.classList.add('success')
    } else if (opts.fail) {
      $el.classList.add('fail')
    }

    setTimeout(($el) => this.deactivate($el), 500, $el)
  }
  
  deactivate ($el) 
  {
    $el.className = 'key'
  }
}
////FIN - App

//Se activa la aplicación
let myApp = new App( Utils )
