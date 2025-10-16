const API_URL = "https://vj.interfaces.jima.com.ar/api/v2"
const MAIN_CONTENT = document.querySelector(".main-content")
const LOADING = document.getElementById("loading-screen")

function getGames(done) {
  fetch(API_URL)
    .then((response) => response.json())
    .then((games) => {
      console.log(games) 
      done(games)  
    })
    .catch((err) => {
      LOADING.textContent = "Error loading games."
      console.error("Error al cargar los juegos:", err)
    })
}

function createCard(game) {
  const gameCard = document.createElement("div")
  gameCard.classList.add("game-card")

  gameCard.innerHTML = `
        <img src="${game.background_image_low_res}" alt="${game.name}">
        <p>${game.name}</p>
    `

  return gameCard
}

function createSection(genreName) {
  const section = document.createElement("section")
  section.classList.add("genre-section")

  section.innerHTML = 
        `
          <h2>${genreName}</h2>
          <div class="carousel-section">
            <button class="carousel-btn btn-left">&#8249;</button>
            <div class="carousel" id="carousel-${genreName.toLowerCase()}"></div>
            <button class="carousel-btn btn-right">&#8250;</button>
          </div>
        `
  return section
}

getGames((games) => {
  const genresMap = {}

  // --- Agrupo los juegos por genero. ---
  games.forEach((game) => {
    game.genres.forEach((genre) => {
      if (!genresMap[genre.name]) {
        genresMap[genre.name] = []
      }
      genresMap[genre.name].push(game)
    })
  })

  // --- Por cada genero creo una seccion. ---
  Object.keys(genresMap).forEach((genreName) => {
    const section = createSection(genreName)
    MAIN_CONTENT.appendChild(section)

    const carousel = section.querySelector(".carousel")
    const leftBtn = section.querySelector(".btn-left")
    const rightBtn = section.querySelector(".btn-right")

    const gamesToShow = genresMap[genreName].slice()

    gamesToShow.forEach((game) => {
      carousel.appendChild(createCard(game))
    })

  function ejecutarAnimacion() {
    const cards = carousel.querySelectorAll(".game-card")

    cards.forEach((card) => {
      card.classList.remove("animate")
      void card.offsetWidth
      card.classList.add("animate")

      setTimeout(() => {
        card.classList.remove("animate")
      }, 600)
    })
  }

    const scrollAmount = 1000
    leftBtn.addEventListener("click", () => {
      carousel.scrollBy({ left: -scrollAmount, behavior: "smooth" })
      ejecutarAnimacion();
    })
    rightBtn.addEventListener("click", () => {
      carousel.scrollBy({ left: scrollAmount, behavior: "smooth" })
      ejecutarAnimacion();
    })
  })
})


/*==== Abrir y cerrar paneles laterales===== */

const hamburguerBtn = document.getElementById("hamburguer-button");
const friendsBtn = document.getElementById("friends-button");
const hamburguerSection = document.querySelector(".hamburguer-section");
const friendsSection = document.querySelector(".friends-section");
const mainContent = document.querySelector(".main-content-wrapper");

function updateMainLayout() {
  const leftVisible = !hamburguerSection.classList.contains("hamburguer-hidden");
  const rightVisible = !friendsSection.classList.contains("friends-hidden");

  mainContent.classList.remove("expand-left", "expand-right", "none-expand");

  if (!leftVisible && !rightVisible) {
    mainContent.classList.add("none-expand");
  } else if (!leftVisible && rightVisible) {
    mainContent.classList.add("expand-right");
  } else if (leftVisible && !rightVisible) {
    mainContent.classList.add("expand-left");
  } else if (leftVisible && rightVisible){
    mainContent.classList.add("expand-left");
    mainContent.classList.add("expand-right");
  }
}

hamburguerBtn.addEventListener("click", () => {
  hamburguerSection.classList.toggle("hamburguer-hidden");
  updateMainLayout();
});

friendsBtn.addEventListener("click", () => {
  friendsSection.classList.toggle("friends-hidden");
  updateMainLayout();
});

updateMainLayout();