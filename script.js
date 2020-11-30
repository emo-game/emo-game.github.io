// Map chaque source de masque avec son émotion
const EMOTIONS_BY_MASK = {
  '01-happy.png': 'happy',
  '01-neutre.png': 'neutral',
  '01-angry.png' : 'angry',
  '01-fearful.png' : 'fearful',
  '01-sad.png' : 'sad',

  '02-happy.png': 'happy',
  '02-neutre.png': 'neutral',
  '02-angry.png' : 'angry',
  '02-fearful.png' : 'fearful',
  '02-sad.png' : 'sad',

  '03-happy.png': 'happy',
  '03-neutre.png': 'neutral',
  '03-angry.png' : 'angry',
  '03-fearful.png' : 'fearful',
  '03-sad.png' : 'sad',
}

let CURRENT_MASK = null
let CURRENT_BANDEAU = null
let SCORE = 0
let TIMELINE_INDEX = 0 

const TIMELINE = [
  { duration : 4000},
  { maskSrc: '3.png', duration: 800 },
  { maskSrc: '2.png', duration: 800 },
  { maskSrc: '1.png', duration: 800 },
  { maskSrc: 'GO.png', duration: 800 },

  { maskSrc: '01-happy.png', duration: 5000 },
  { maskSrc: '01-neutre.png',  duration: 5000 },
  { maskSrc: '01-angry.png', duration: 5000 },
  { maskSrc: '01-sad.png', duration: 5000 },
  { maskSrc: '01-fearful.png', duration: 5000 },

  { maskSrc: '03-neutre.png', duration: 3000 },
  { maskSrc: '01-angry.png', duration: 2000 },
  { maskSrc: '01-sad.png', duration: 3000 },

  { maskSrc: '02-angry.png', duration: 3000 },
  { maskSrc: '02-sad.png', duration: 2000 },
  { maskSrc: '02-fearful.png', duration: 2000 },
  { maskSrc: '03-angry.png', duration: 3000 },
  { maskSrc: '03-sad.png', duration: 2000 },

  { maskSrc: '01-angry.png', duration: 1000 },
  { maskSrc: '01-sad.png', duration: 1000 },

  { maskSrc: '02-fearful.png', duration: 1000 },
  { maskSrc: '03-sad.png', duration: 500 },
  { maskSrc: '01-neutre.png',  duration: 500 },
  { maskSrc: '02-happy.png', duration: 1000 },
  { maskSrc: '01-angry.png', duration: 500 },
  { maskSrc: '03-sad.png', duration: 500 },
  { maskSrc: '03-fearful.png', duration: 500 },
  { maskSrc: '02-fearful.png', duration: 500 },
  { maskSrc: '03-happy.png', duration: 500 },
  { maskSrc: '02-neutre.png', duration: 500 },
  { maskSrc: '03-angry.png', duration: 500 },
  { maskSrc: '02-angry.png', duration: 500 },
  { maskSrc: '01-fearful.png', duration: 500 },
  { maskSrc: '01-sad.png', duration: 500 },

  { maskSrc: '02-happy.png', duration: 2000 },
  { maskSrc: '02-sad.png', duration: 2000 },
  { maskSrc: '03-sad.png', duration: 2000 },
  { maskSrc: '02-neutre.png', duration: 2000 },
  { maskSrc: '03-fearful.png', duration: 2000 },

]

const TIMELINE_BANDEAU = [
  { duration : 4000},
  { duration : 800},
  { duration : 800},
  { duration : 800},
  { duration : 800},
  { duration : 1000},

  { bandeauSrc: 'heureux.png', duration: 5000 }, 
  { bandeauSrc: 'neutre.png', duration: 5000 },
  { bandeauSrc: 'colerique.png', duration: 5000 },
  { bandeauSrc: 'triste.png', duration: 5000 },
  { bandeauSrc: 'effraye.png', duration: 5000 },

  { bandeauSrc: 'neutre.png', duration: 3000 },
  { bandeauSrc: 'colerique.png', duration: 2000 },
  { bandeauSrc: 'triste.png', duration: 3000 },

  { bandeauSrc: 'colerique.png', duration: 3000 },
  { bandeauSrc: 'triste.png', duration: 2000 },
  { bandeauSrc: 'effraye.png', duration: 2000 },
  { bandeauSrc: 'colerique.png', duration: 3000 },
  { bandeauSrc: 'triste.png', duration: 2000 },

  { bandeauSrc: 'colerique.png', duration: 1000 },
  { bandeauSrc: 'triste.png', duration: 1000 },

  { bandeauSrc: 'effraye.png', duration: 1000 },
  { bandeauSrc: 'triste.png', duration: 500 },
  { bandeauSrc: 'neutre.png',  duration: 500 },
  { bandeauSrc: 'heureux.png', duration: 1000 },
  { bandeauSrc: 'colerique.png', duration: 500 },
  { bandeauSrc: 'triste.png', duration: 500 },
  { bandeauSrc: 'effraye.png', duration: 500 },
  { bandeauSrc: 'effraye.png', duration: 500 },
  { bandeauSrc: 'heureux.png', duration: 500 },
  { bandeauSrc: 'neutre.png', duration: 500 },
  { bandeauSrc: 'colerique.png', duration: 500 },
  { bandeauSrc: 'colerique.png', duration: 500 },
  { bandeauSrc: 'effraye.png', duration: 500 },
  { bandeauSrc: 'triste.png', duration: 500 },

  { bandeauSrc: 'heureux.png', duration: 2000 },
  { bandeauSrc: 'triste.png', duration: 2000 },
  { bandeauSrc: 'triste.png', duration: 2000 },
  { bandeauSrc: 'neutre.png', duration: 2000 },
  { bandeauSrc: 'effraye.png', duration: 2000 },

]

document.addEventListener('click', () => nextMask()) // DEBUG

function update () {
  document.body.classList.remove('great')
  document.body.classList.remove('notBad')
  document.body.classList.remove('score-value')

  if (CURRENT_MASK && window.CURRENT_EXPRESSIONS.active) {
    // console.log('update !')
    const emotionName = EMOTIONS_BY_MASK[CURRENT_MASK.src]
    const emotion = window.CURRENT_EXPRESSIONS[emotionName]

    // Trigger quand on fait plus ou moins bien
    if (emotion > 0.2 && emotion <= 0.89) { 
     document.body.classList.add('notBad')

      SCORE += 1
      CURRENT_MASK.classList.add('isNotBad')
      console.log("notBad")
      console.log(SCORE)
    }

    if (emotion > 0.90) { 
      document.body.classList.add('great')

      // TODO: implémenter un système de point
      // score += un certain de nombre de points
  

      SCORE += 5
      CURRENT_MASK.classList.add('isGreat')

    

      console.log("great")
      console.log(SCORE)

    }

    document.querySelector('.score').textContent = SCORE


  }
}
 
function nextMask () {
  if (CURRENT_MASK) {
    CURRENT_MASK.remove()
  }

  if (TIMELINE_INDEX >= TIMELINE.length) {
    console.log('Fin du jeu, score final = ' + SCORE)
    window.location = 'win.html?score=' + SCORE
    return
  }

  const currentFrame = TIMELINE[TIMELINE_INDEX]
  CURRENT_MASK = createMask(currentFrame.maskSrc)
  TIMELINE_INDEX++ 

  anime({
    targets: [CURRENT_MASK],
    right: [-500, window.innerWidth],
    duration: currentFrame.duration,
    easing: 'linear',
    update: function () {

    },
    complete: function () {
      nextMask()
      nextBandeau()
    }
  })
}

  function nextBandeau () {
    if (CURRENT_BANDEAU) {
      CURRENT_BANDEAU.remove()
    }

    const currentFrameB = TIMELINE_BANDEAU[TIMELINE_INDEX]
    CURRENT_BANDEAU = createBandeau(currentFrameB.bandeauSrc)
  }  


// Insère un element masque dans le html
function createMask (src) {
  const maskDiv = document.createElement('div')
  maskDiv.classList.add('mask')
  maskDiv.style.backgroundImage = 'url(img/'+ src +')'
  maskDiv.src = src
  const game = document.querySelector('.game')
  game.appendChild(maskDiv)
  return maskDiv
  }

  // Insère un element bandeau dans le html
function createBandeau(src) {
  const bandeauDiv = document.createElement('div')
  bandeauDiv.classList.add('bandeau')
  bandeauDiv.style.backgroundImage = 'url(img/'+ src +')'
  bandeauDiv.src = src
  const game = document.querySelector('.game')
  game.appendChild(bandeauDiv)
  return bandeauDiv
  }

  

// FaceAPI
const video = document.getElementById('video')
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models'),
]).then(() => {
  navigator.mediaDevices.getUserMedia({
     video: {} 
    }, 
    stream => {
      video.srcObject = stream
    }, 
    err => console.error(err)
  )

  nextMask()
  nextBandeau()
})



video.addEventListener('playing',()=> {
  const canvas = faceapi.createCanvasFromMedia(video)
  document.body.append(canvas)
  const displaySize = { width: video.width, height: video.height }
  faceapi.matchDimensions(canvas,displaySize)
    setInterval(async()=>{
      const detections = await faceapi.detectAllFaces(video, 
      new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks()
      .withFaceExpressions()
      if (detections.length === 1) {
        // const resizedDetections = faceapi.resizeResults(detections,displaySize)
        // canvas.getContext('2d').clearRect(0 ,0 , canvas.width, canvas.height)
        // faceapi.draw.drawDetections(canvas,resizedDetections)
        // faceapi.draw.drawFaceLandmarks(canvas,resizedDetections)
        // faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
        window.CURRENT_EXPRESSIONS = detections[0].expressions
        window.CURRENT_EXPRESSIONS.active = true
        // console.log(CURRENT_EXPRESSIONS)
      } else {
        window.CURRENT_EXPRESSIONS = { active: false }
      }

      update()
    },1000)
})

