// Map chaque source de masque avec son émotion
const EMOTIONS_BY_MASK = {
  '01-happy.png': 'happy',
  '01-neutre.png': 'neutral',
  '02-happy.png': 'happy',
  '02-neutre.png': 'neutral',
  '03-happy.png': 'happy',
  '04-neutre.png': 'neutral'
}

let CURRENT_MASK = null
let SCORE = 0
let TIMELINE_INDEX = 0
const TIMELINE = [
  { duration : 5000},
  { maskSrc: '01-happy.png', duration: 5000 },
  { maskSrc: '01-neutre.png',  duration: 5000 },
  { maskSrc: '02-happy.png', duration: 5000 },
  { maskSrc: '02-neutre.png', duration: 5000 },
  { maskSrc: '03-happy.png', duration: 5000 },
  { maskSrc: '04-neutre.png', duration: 5000 }
]

document.addEventListener('click', () => nextMask()) // DEBUG

function update () {
  document.body.classList.remove('great')

  if (CURRENT_MASK && window.CURRENT_EXPRESSIONS.active) {
    // console.log('update !')
    const emotionName = EMOTIONS_BY_MASK[CURRENT_MASK.src]
    const emotion = window.CURRENT_EXPRESSIONS[emotionName]

    // Trigger quand on fait plus ou moins bien
    if (emotion > 0 && emotion <= 0.90) { 
     document.body.classList.add('notBad')

      SCORE += 1
      CURRENT_MASK.classList.add('isNotBad')
    }

    if (emotion > 0.90) { 
      document.body.classList.add('great')

      // TODO: implémenter un système de point
      // score += un certain de nombre de points
      SCORE += 5
      CURRENT_MASK.classList.add('isGreat')
    }

  }
}
  

function nextMask () {
  if (CURRENT_MASK) {
    CURRENT_MASK.remove()
  }


  if (TIMELINE_INDEX >= TIMELINE.length) {
    console.log('Fin du jeu, score final = ' + SCORE)
    // window.location = 'win.html?score=' + SCORE
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
    }
  })
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


// FaceAPI
const video = document.getElementById('video')
Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
  faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
  faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
  faceapi.nets.faceExpressionNet.loadFromUri('/models'),
]).then(() => {
  navigator.getUserMedia({
     video: {} 
    }, 
    stream => {
      video.srcObject = stream
    }, 
    err => console.error(err)
  )

  nextMask()
})


video.addEventListener('play',()=> {
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
      } else {
        window.CURRENT_EXPRESSIONS = { active: false }
      }

      update()
    },1000)
})
