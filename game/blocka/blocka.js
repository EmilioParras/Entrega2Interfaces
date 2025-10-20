/*==== Abrir y cerrar paneles laterales===== */

const hamburguerBtn = document.getElementById("hamburguer-button")
const configBtn = document.getElementById("config-button")
const hamburguerSection = document.querySelector(".hamburguer-section")
const configSection = document.querySelector(".config-section")
const mainContent = document.querySelector("main")

function updateMainLayout() {
  const leftVisible = !hamburguerSection.classList.contains("hamburguer-hidden")
  const rightVisible = !configSection.classList.contains("config-hidden")

  mainContent.classList.remove("expand-left", "expand-right", "expand-none", "expand-both")

  if (!leftVisible && !rightVisible) {
    mainContent.classList.add("expand-none")
  } else if (!leftVisible && rightVisible) {
    mainContent.classList.add("expand-right")
  } else if (leftVisible && !rightVisible) {
    mainContent.classList.add("expand-left")
  } else if (leftVisible && rightVisible) {
    mainContent.classList.add("expand-both")
  }
}

hamburguerBtn.addEventListener("click", () => {
  hamburguerSection.classList.toggle("hamburguer-hidden")
  updateMainLayout()
})

configBtn.addEventListener("click", () => {
  configSection.classList.toggle("config-hidden")
  updateMainLayout()
})

updateMainLayout()

// ==== BLOCKA LOGICA CON CANVAS ====

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
let selectedImage = null
let timerInterval = null
let timeElapsed = 0
let gameActive = false
let helpUsed = false
let selectedFilter = "none"

// Variables del canvas
let canvas = null
let ctx = null
let pieces = []
let rows = 0
let cols = 0
let pieceWidth = 0
let pieceHeight = 0
const gap = 5
let boardWidth = 600
let boardHeight = 400

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

  let rounds = 15
  const randomFinal = Math.floor(Math.random() * images.length)

  const interval = setInterval(() => {
    images.forEach((img) => {
      img.style.transform = "scale(1)"
      img.style.opacity = "0.5"
    })

    const randomIndex = Math.floor(Math.random() * images.length)
    const selectedImageEl = images[randomIndex]
    selectedImageEl.style.transform = "scale(1.3)"
    selectedImageEl.style.opacity = "1"

    rounds--

    if (rounds === 0) {
      clearInterval(interval)

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

      setTimeout(() => {
        gallery.classList.add("hidden")
        console.log("Imagen seleccionada:", selectedImagePath)

        const gamePieces = document.getElementById("game-pieces")
        gamePieces.classList.add("visible")
        gamePieces.classList.remove("hidden")
      }, 3000)
    }
  }, 300)
})

const pieceButtons = document.querySelectorAll(".cant-pieces")
const gamePiecesSection = document.getElementById("game-pieces")
const gameExecutionSection = document.getElementById("game-execution")

pieceButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const pieceCount = Number.parseInt(button.textContent)

    gamePiecesSection.classList.add("hidden")
    gamePiecesSection.classList.remove("visible")

    showPreGameScreen(pieceCount)
  })
})

function showPreGameScreen(pieceCount) {
  gameExecutionSection.innerHTML = `
    <div class="game-image-center">
      <img src="${selectedImagePath}" alt="Selected Image" id="preview-image">
      <h2 style="color: white; margin-top: 20px;">Dividir en ${pieceCount} piezas</h2>
      <button class="start-game-button">COMENZAR A JUGAR</button>
    </div>
  `

  gameExecutionSection.classList.remove("hidden")
  gameExecutionSection.classList.add("visible")

  const startButton = gameExecutionSection.querySelector(".start-game-button")
  startButton.addEventListener("click", () => {
    startGame(pieceCount)
  })
}

function startGame(pieceCount) {
  helpUsed = false

  const availableFilters = ["none", "grayscale(100%)", "brightness(130%)", "invert(100%)"]
  selectedFilter = availableFilters[Math.floor(Math.random() * availableFilters.length)]
  console.log("Filtro aplicado:", selectedFilter)

  if (pieceCount === 4) {
    rows = 2
    cols = 2
    boardWidth = 400
    boardHeight = 400
  } else if (pieceCount === 6) {
    rows = 2
    cols = 3
    boardWidth = 600
    boardHeight = 400
  } else if (pieceCount === 8) {
    rows = 2
    cols = 4
    boardWidth = 800
    boardHeight = 400
  }

  pieceWidth = (boardWidth - gap * (cols - 1)) / cols
  pieceHeight = (boardHeight - gap * (rows - 1)) / rows

  gameExecutionSection.innerHTML = `
    <div style="display:flex; align-items:center; gap:10px;">
      <div class="game-timer" id="game-timer">
        <span class="timer-label">Tiempo:</span>
        <span class="timer-value" id="timer-value">0</span>
      </div>
      <div class="help-button-section">
        <span class="help-button" id="help-button"><img src="./images/Icons/ayudaJuego.png"></span>
      </div>
    </div>
    <div class="game-board-container">
      <canvas id="game-canvas" width="${boardWidth}" height="${boardHeight}" style="border: 2px solid #26EE00; border-radius: 10px; cursor: pointer;"></canvas>
    </div>
  `

  canvas = document.getElementById("game-canvas")
  ctx = canvas.getContext("2d")

  const helpButton = document.getElementById("help-button")
  helpButton.addEventListener("click", useHelp)

  selectedImage = new Image()
  selectedImage.crossOrigin = "anonymous"
  selectedImage.onload = () => {
    initializePieces()
    shufflePieces()
    drawBoard()
    startTimer()
  }
  selectedImage.src = selectedImagePath

  canvas.addEventListener("click", handleCanvasClick)
  canvas.addEventListener("contextmenu", handleCanvasRightClick)
}

function initializePieces() {
  pieces = []
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      pieces.push({
        originalRow: row,
        originalCol: col,
        rotation: 0,
        gridIndex: pieces.length,
        locked: false,
      })
    }
  }
}

function drawBoard() {
  ctx.clearRect(0, 0, boardWidth, boardHeight)

  pieces.forEach((piece, index) => {
    const gridRow = Math.floor(index / cols)
    const gridCol = index % cols

    const x = gridCol * (pieceWidth + gap)
    const y = gridRow * (pieceHeight + gap)

    drawPiece(piece, x, y)
  })
}

function drawPiece(piece, x, y) {
  ctx.save()

  ctx.translate(x + pieceWidth / 2, y + pieceHeight / 2)
  ctx.rotate((piece.rotation * Math.PI) / 180)

  ctx.strokeStyle = piece.locked ? "#FFD700" : "#26EE00"
  ctx.lineWidth = 2
  ctx.strokeRect(-pieceWidth / 2, -pieceHeight / 2, pieceWidth, pieceHeight)

  if (selectedFilter !== "none") {
    ctx.filter = selectedFilter
  }

  const sourceX = piece.originalCol * (selectedImage.width / cols)
  const sourceY = piece.originalRow * (selectedImage.height / rows)
  const sourceWidth = selectedImage.width / cols
  const sourceHeight = selectedImage.height / rows

  ctx.drawImage(
    selectedImage,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    -pieceWidth / 2,
    -pieceHeight / 2,
    pieceWidth,
    pieceHeight,
  )

  ctx.filter = "none"

  ctx.restore()
}

function handleCanvasClick(e) {
  if (!gameActive) return

  const rect = canvas.getBoundingClientRect()
  const mouseX = e.clientX - rect.left
  const mouseY = e.clientY - rect.top

  const pieceIndex = getPieceAtPosition(mouseX, mouseY)
  if (pieceIndex !== -1) {
    if (pieces[pieceIndex].locked) {
      return
    }
    rotatePiece(pieceIndex, -90)
    drawBoard()
    checkWin()
  }
}

function handleCanvasRightClick(e) {
  e.preventDefault()
  if (!gameActive) return

  const rect = canvas.getBoundingClientRect()
  const mouseX = e.clientX - rect.left
  const mouseY = e.clientY - rect.top

  const pieceIndex = getPieceAtPosition(mouseX, mouseY)
  if (pieceIndex !== -1) {
    if (pieces[pieceIndex].locked) {
      return
    }
    rotatePiece(pieceIndex, 90)
    drawBoard()
    checkWin()
  }
}

function getPieceAtPosition(x, y) {
  const col = Math.floor(x / (pieceWidth + gap))
  const row = Math.floor(y / (pieceHeight + gap))

  if (col >= 0 && col < cols && row >= 0 && row < rows) {
    return row * cols + col
  }
  return -1
}

function rotatePiece(index, degrees) {
  const piece = pieces[index]
  piece.rotation = (piece.rotation + degrees) % 360
  if (piece.rotation < 0) piece.rotation += 360
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

function shufflePieces() {
  for (let i = pieces.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pieces[i], pieces[j]] = [pieces[j], pieces[i]]
  }

  pieces.forEach((piece) => {
    piece.rotation = [0, 90, 180, 270][Math.floor(Math.random() * 4)]
  })
}

function checkWin() {
  const isComplete = pieces.every((piece) => {
    const normalizedRotation = ((piece.rotation % 360) + 360) % 360
    return normalizedRotation === 0
  })

  if (isComplete) {
    stopTimer()

    setTimeout(() => {
      canvas.width = boardWidth
      canvas.height = boardHeight
      if (selectedFilter !== "none") {
        ctx.filter = selectedFilter
      }
      ctx.drawImage(selectedImage, 0, 0, boardWidth, boardHeight)
      ctx.filter = "none"

      setTimeout(() => {
        showGameOver(true)
      }, 3000)
    }, 500)
  }
}

function useHelp() {
  if (helpUsed || !gameActive) return

  const incorrectPiece = pieces.find((piece) => {
    const normalizedRotation = ((piece.rotation % 360) + 360) % 360
    return normalizedRotation !== 0
  })

  if (!incorrectPiece) {
    return
  }

  incorrectPiece.rotation = 0
  incorrectPiece.locked = true

  timeElapsed += 5
  const timerValue = document.getElementById("timer-value")
  timerValue.textContent = timeElapsed

  helpUsed = true
  const helpButton = document.getElementById("help-button")
  helpButton.style.opacity = "0.3"
  helpButton.style.cursor = "not-allowed"
  helpButton.style.pointerEvents = "none"

  drawBoard()
  checkWin()
}

function showGameOver(won) {
  stopTimer()

  const message = won ? "¡Felicidades! Has completado el puzzle 🎉" : "¡Tiempo agotado! Has perdido 😢"
  const messageColor = won ? "#26EE00" : "#ff0000"

  gameExecutionSection.innerHTML = `
    <div class="game-over-screen">
      <h1 style="color: ${messageColor}; font-size: 48px; text-align: center;">${message}</h1>
      <button class="start-game-button" id="play-again-button">JUGAR DE NUEVO</button>
    </div>
  `

  const playAgainButton = document.getElementById("play-again-button")
  playAgainButton.addEventListener("click", () => {
    selectedImagePath = ""
    selectedImage = null
    timeElapsed = 0
    gameActive = false
    helpUsed = false
    selectedFilter = "none"
    pieces = []

    gameExecutionSection.classList.add("hidden")
    gameExecutionSection.classList.remove("visible")

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
    let rounds = 15
    const randomFinal = Math.floor(Math.random() * images.length)

    const interval = setInterval(() => {
      images.forEach((img) => {
        img.style.transform = "scale(1)"
        img.style.opacity = "0.5"
      })

      const randomIndex = Math.floor(Math.random() * images.length)
      const selectedImageEl = images[randomIndex]
      selectedImageEl.style.transform = "scale(1.3)"
      selectedImageEl.style.opacity = "1"

      rounds--

      if (rounds === 0) {
        clearInterval(interval)

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

        setTimeout(() => {
          gallery.classList.add("hidden")
          const gamePieces = document.getElementById("game-pieces")
          gamePieces.classList.add("visible")
          gamePieces.classList.remove("hidden")
        }, 3000)
      }
    }, 300)
  })
}

const fullscreenButton = document.getElementById("button-fullScreen")
const controlsButton = document.getElementById("button-controls")
let controlsPopover = null

fullscreenButton.addEventListener("click", () => {
  if (!document.fullscreenElement) {
    // Enter fullscreen
    document.documentElement.requestFullscreen().catch((err) => {
      console.error("Error al intentar entrar en fullscreen:", err)
    })
  } else {
    // Exit fullscreen
    document.exitFullscreen().catch((err) => {
      console.error("Error al intentar salir de fullscreen:", err)
    })
  }
})

controlsButton.addEventListener("click", (e) => {
  e.stopPropagation()

  // Si el popover ya existe, lo eliminamos (toggle)
  if (controlsPopover) {
    controlsPopover.remove()
    controlsPopover = null
    const overlay = document.getElementById("controls-overlay")
    if (overlay) overlay.remove()
    return
  }

  const overlay = document.createElement("div")
  overlay.id = "controls-overlay"
  overlay.style.position = "fixed"
  overlay.style.top = "0"
  overlay.style.left = "0"
  overlay.style.width = "100%"
  overlay.style.height = "100%"
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.7)"
  overlay.style.zIndex = "999"
  document.body.appendChild(overlay)

  // Crear el popover
  controlsPopover = document.createElement("div")
  controlsPopover.className = "controls-popover"
  controlsPopover.innerHTML = `
    <div class="controls-popover-header">
      <h3>Cómo Jugar</h3>
      <button class="controls-close-btn">&times;</button>
    </div>
    <div class="controls-popover-content">
      <div class="control-item">
        <span class="control-icon">🖱️</span>
        <div>
          <strong>Click Izquierdo:</strong>
          <p>Rotar pieza en sentido antihorario (-90°)</p>
        </div>
      </div>
      <div class="control-item">
        <span class="control-icon">🖱️</span>
        <div>
          <strong>Click Derecho:</strong>
          <p>Rotar pieza en sentido horario (+90°)</p>
        </div>
      </div>
      <div class="control-item">
        <span class="control-icon">💡</span>
        <div>
          <strong>Botón de Ayuda:</strong>
          <p>Corrige automáticamente una pieza incorrecta. Suma 5 segundos al tiempo. Solo se puede usar una vez.</p>
        </div>
      </div>
      <div class="control-item">
        <span class="control-icon">🎯</span>
        <div>
          <strong>Objetivo:</strong>
          <p>Rotar todas las piezas a su posición correcta (0°) antes de que se acabe el tiempo (60 segundos).</p>
        </div>
      </div>
    </div>
  `

  document.body.appendChild(controlsPopover)

  // Cerrar al hacer click en el botón de cerrar
  const closeBtn = controlsPopover.querySelector(".controls-close-btn")
  closeBtn.addEventListener("click", () => {
    controlsPopover.remove()
    controlsPopover = null
    overlay.remove()
  })

  overlay.addEventListener("click", () => {
    controlsPopover.remove()
    controlsPopover = null
    overlay.remove()
  })

  // Cerrar al hacer click fuera del popover
  setTimeout(() => {
    document.addEventListener("click", closePopoverOutside)
  }, 0)
})

function closePopoverOutside(e) {
  if (controlsPopover && !controlsPopover.contains(e.target) && e.target !== controlsButton) {
    controlsPopover.remove()
    controlsPopover = null
    const overlay = document.getElementById("controls-overlay")
    if (overlay) overlay.remove()
    document.removeEventListener("click", closePopoverOutside)
  }
}
