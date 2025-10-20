/*==== Abrir y cerrar paneles laterales===== */

const hamburguerBtn = document.getElementById("hamburguer-button");
const configBtn = document.getElementById("config-button");
const hamburguerSection = document.querySelector(".hamburguer-section");
const configSection = document.querySelector(".config-section");
const mainContent = document.querySelector("main");
const footer = document.querySelector(".footer-links-section");
const rigthsReserved = document.querySelector(".footer-rigths-reserved");

function updateMainLayout() {
  const leftVisible = !hamburguerSection.classList.contains("hamburguer-hidden");
  const rightVisible = !configSection.classList.contains("config-hidden");

  mainContent.classList.remove("expand-left", "expand-right", "expand-none", "expand-both");

  if (!leftVisible && !rightVisible) {
    mainContent.classList.add("expand-none");
  } else if (!leftVisible && rightVisible) {    
    mainContent.classList.add("expand-right");
  } else if (leftVisible && !rightVisible) {
    mainContent.classList.add("expand-left");
  } else if (leftVisible && rightVisible){
    mainContent.classList.add("expand-both");
  }
}

hamburguerBtn.addEventListener("click", () => {
  hamburguerSection.classList.toggle("hamburguer-hidden");
  updateMainLayout();
});

configBtn.addEventListener("click", () => {
  configSection.classList.toggle("config-hidden");
  updateMainLayout();
});

updateMainLayout();

// ==== BLOCKA LOGICA ====

const playButton = document.querySelector(".play-button")
const gallery = document.querySelector(".gallery")
const gameNotPlaying = document.querySelector(".game-center-info")

const imageLevels = [
  "images/imageLevels/imageLvl1.jpg",
  "images/imageLevels/imageLvl2.jpeg",
  "images/imageLevels/imageLvl3.jpg",
  "images/imageLevels/imageLvl4.jpg",
  "images/imageLevels/imageLvl5.jpg",
  "images/imageLevels/imageLvl6.jpg",
]

let selectedImagePath = ""

let timerInterval = null
let timeElapsed = 0
let gameActive = false

// Mostrar galería al hacer click en "JUGAR"
playButton.addEventListener("click", () => {
  gallery.innerHTML = ""
  gallery.classList.remove("hidden")
  gameNotPlaying.classList.add("hidden")

  imageLevels.forEach((path) => {
    const img = document.createElement("img")
    img.src = path
    img.alt = "level image"
    gallery.appendChild(img)
  })

  const images = gallery.querySelectorAll("img")

  let rounds = 15 // cuántas imágenes pasa antes de elegir la final
  const randomFinal = Math.floor(Math.random() * images.length)

  const interval = setInterval(() => {
    images.forEach((img) => {
      img.style.transform = "scale(1)"
      img.style.opacity = "0.5"
    })

    // Elige una imagen aleatoria para agrandar
    const randomIndex = Math.floor(Math.random() * images.length)
    const selectedImage = images[randomIndex]
    selectedImage.style.transform = "scale(1.3)"
    selectedImage.style.opacity = "1"

    rounds--

    // Cuando pasan las 15 rondas
    if (rounds == 0) {
      clearInterval(interval)

      // Resalta la imagen elegida y opaca las otras
      images.forEach((img, i) => {
        if (i === randomFinal) {
          img.style.transition = "all 0.5s ease"
          img.style.transform = "scale(1.8)"
          img.style.filter = "brightness(1.4)"
          img.style.boxShadow = "0 0 40px 10px rgba(255, 255, 255, 0.8)"
          img.style.zIndex = "10"
        } else {
          img.style.opacity = "0"
          img.style.transition = "opacity 0.5s ease"
        }
      })

      selectedImagePath = imageLevels[randomFinal]

      // Después de 3 segundos ocualta la galeria
      setTimeout(() => {
        gallery.classList.add("hidden")
        console.log("Imagen seleccionada:", selectedImagePath)

        // Mostrar la selección de piezas.
        const gamePieces = document.getElementById("game-pieces")
        gamePieces.classList.add("visible")
        gamePieces.classList.remove("hidden")
      }, 3000)
    }
  }, 300) // Cada 0.300s cambia de imagen.
})

const pieceButtons = document.querySelectorAll(".cant-pieces")
const gamePiecesSection = document.getElementById("game-pieces")
const gameExecutionSection = document.getElementById("game-execution")

pieceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const pieceCount = Number.parseInt(button.textContent)

    // Ocultar la selección de piezas
    gamePiecesSection.classList.add("hidden")
    gamePiecesSection.classList.remove("visible")

    // Mostrar la pantalla de ejecución con la imagen y botón de comenzar
    showPreGameScreen(pieceCount)
  })
})

function showPreGameScreen(pieceCount) {
  gameExecutionSection.innerHTML = `
    <div class="game-image-center">
      <img src="${selectedImagePath}" alt="Selected Image">
      <h2 style="color: white; margin-top: 20px;">Dividir en ${pieceCount} piezas</h2>
      <button class="start-game-button">COMENZAR A JUGAR</button>
    </div>
  `

  gameExecutionSection.classList.remove("hidden")
  gameExecutionSection.classList.add("visible")

  // Agregar evento al botón de comenzar
  const startButton = gameExecutionSection.querySelector(".start-game-button")
  startButton.addEventListener("click", () => {
    startGame(pieceCount)
  })
}

function startGame(pieceCount) {
  console.log(`[v0] Iniciando juego con ${pieceCount} piezas`)

  // Calcular filas y columnas según la cantidad de piezas
  let rows, cols
  if (pieceCount === 4) {
    rows = 2
    cols = 2
  } else if (pieceCount === 6) {
    rows = 2
    cols = 3
  } else if (pieceCount === 8) {
    rows = 2
    cols = 4
  }

  console.log(`[v0] Grid: ${cols} columnas x ${rows} filas`)

  gameExecutionSection.innerHTML = `
    <div class="game-timer" id="game-timer">
      <span class="timer-label">Tiempo:</span>
      <span class="timer-value" id="timer-value">0</span>
    </div>
    <div class="game-board-container">
      <div class="game-board" style="
        display: grid;
        grid-template-columns: repeat(${cols}, 1fr);
        grid-template-rows: repeat(${rows}, 1fr);
        gap: 5px;
        width: 600px;
        height: 400px;
      ">
      </div>
    </div>
  `

  const gameBoard = gameExecutionSection.querySelector(".game-board")

  const pieces = []
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const piece = document.createElement("div")
      piece.className = "puzzle-piece"

      const bgPosX = cols > 1 ? (col / (cols - 1)) * 100 : 0
      const bgPosY = rows > 1 ? (row / (rows - 1)) * 100 : 0

      console.log(`[v0] Pieza (${col}, ${row}): bgPos = ${bgPosX}%, ${bgPosY}%`)

      piece.style.cssText = `
        border: 2px solid #26EE00;
        border-radius: 5px;
        cursor: pointer;
        transition: all 0.3s ease;
        overflow: hidden;
        position: relative;
      `

      piece.style.setProperty("--bg-image", `url('${selectedImagePath}')`)
      piece.style.setProperty("--bg-size-x", `${cols * 100}%`)
      piece.style.setProperty("--bg-size-y", `${rows * 100}%`)
      piece.style.setProperty("--bg-pos-x", `${bgPosX}%`)
      piece.style.setProperty("--bg-pos-y", `${bgPosY}%`)
      piece.style.setProperty("--rotation", "0deg")

      piece.dataset.correctPosition = pieces.length
      piece.dataset.rotation = 0
      piece.dataset.correctRotation = 0
      pieces.push(piece)
      gameBoard.appendChild(piece)
    }
  }

  console.log(`[v0] Total de piezas creadas: ${pieces.length}`)
  console.log(`[v0] Background size: ${cols * 100}% x ${rows * 100}%`)

  // Mezclar las piezas
  shufflePieces(pieces, gameBoard)

  startTimer()

  pieces.forEach((piece) => {
    // Click izquierdo - rotar a la izquierda
    piece.addEventListener("click", (e) => {
      e.preventDefault()
      if (!gameActive) return
      rotatePiece(piece, -90)
      checkWin(pieces, rows, cols)
    })

    // Click derecho - rotar a la derecha
    piece.addEventListener("contextmenu", (e) => {
      e.preventDefault()
      if (!gameActive) return
      rotatePiece(piece, 90)
      checkWin(pieces, rows, cols)
    })
  })
}

function rotatePiece(piece, degrees) {
  const currentRotation = Number.parseInt(piece.dataset.rotation) || 0
  const newRotation = (currentRotation + degrees) % 360
  piece.dataset.rotation = newRotation

  // Aplicar rotación solo al background
  const currentStyle = piece.style.cssText
  const bgImage = piece.style.backgroundImage
  const bgSize = piece.style.backgroundSize
  const bgPosition = piece.style.backgroundPosition

  // Crear un pseudo-elemento para rotar solo el fondo
  piece.style.setProperty("--rotation", `${newRotation}deg`)
}

function startTimer() {
  gameActive = true
  timeElapsed = 0
  const timerValue = document.getElementById("timer-value")

  timerInterval = setInterval(() => {
    timeElapsed++
    timerValue.textContent = timeElapsed

    if (timeElapsed >= 50) {
      timerValue.style.color = "#ff0000"
      timerValue.style.animation = "pulse 1s infinite"
    }

    if (timeElapsed >= 60) {
      clearInterval(timerInterval)
      gameActive = false
      showGameOver(false)
    }
  }, 1000)
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
  gameActive = false
}

function showGameOver(won) {
  stopTimer()

  const message = won ? "¡Felicidades! Has completado el puzzle 🎉" : "¡Tiempo agotado! Has perdido 😢"

  const messageColor = won ? "#26EE00" : "#ff0000"

  gameExecutionSection.innerHTML = `
    <div class="game-over-screen">
      <h1 style="color: ${messageColor}; font-size: 48px; text-align: center;">${message}</h1>
      <button class="start-game-button" onclick="location.reload()">JUGAR DE NUEVO</button>
    </div>
  `
}

function shufflePieces(pieces, container) {
  const shuffled = [...pieces].sort(() => Math.random() - 0.5)
  container.innerHTML = ""
  shuffled.forEach((piece) => {
    const randomRotation = [0, 90, 180, 270][Math.floor(Math.random() * 4)]
    piece.dataset.rotation = randomRotation
    piece.style.setProperty("--rotation", `${randomRotation}deg`)
    container.appendChild(piece)
  })
}

function swapPieces(piece1, piece2) {
  const tempBackground = piece1.style.backgroundPosition
  piece1.style.backgroundPosition = piece2.style.backgroundPosition
  piece2.style.backgroundPosition = tempBackground

  const tempCorrect = piece1.dataset.correctPosition
  piece1.dataset.correctPosition = piece2.dataset.correctPosition
  piece2.dataset.correctPosition = tempCorrect
}

function checkWin(pieces, rows, cols) {
  const isComplete = pieces.every((piece, index) => {
    const correctPosition = Number.parseInt(piece.dataset.correctPosition) === index
    const correctRotation = Number.parseInt(piece.dataset.rotation) === Number.parseInt(piece.dataset.correctRotation)
    return correctPosition && correctRotation
  })

  if (isComplete) {
    stopTimer()

    // Unificar la imagen eliminando bordes y gaps
    const gameBoard = document.querySelector(".game-board")
    gameBoard.style.gap = "0px"

    pieces.forEach((piece) => {
      piece.style.border = "none"
      piece.style.setProperty("--rotation", "0deg")
    })

    // Después de 5 segundos, mostrar mensaje de victoria
    setTimeout(() => {
      showGameOver(true)
    }, 5000)
  }
}
