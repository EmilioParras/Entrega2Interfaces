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

const playButton = document.querySelector(".play-button");
const gallery = document.querySelector(".gallery");
const gameNotPlaying = document.querySelector(".game-center-info")

const imageLevels = [
  "images/imageLevels/imageLvl1.jpg",
  "images/imageLevels/imageLvl2.jpeg",
  "images/imageLevels/imageLvl3.jpg",
  "images/imageLevels/imageLvl4.jpg",
  "images/imageLevels/imageLvl5.jpg",
  "images/imageLevels/imageLvl6.jpg"
];

// Mostrar galería al hacer click en "JUGAR"
playButton.addEventListener("click", () => {
  gallery.innerHTML = "";
  gallery.classList.remove("hidden");
  gameNotPlaying.classList.add("hidden");


  imageLevels.forEach(path => {
    const img = document.createElement("img");
    img.src = path;
    img.alt = "level image";
    gallery.appendChild(img);
  });

  const images = gallery.querySelectorAll("img");

  let rounds = 15; // cuántas imágenes pasa antes de elegir la final
  const randomFinal = Math.floor(Math.random() * images.length);

  const interval = setInterval(() => {
    images.forEach(img => {
      img.style.transform = "scale(1)";
      img.style.opacity = "0.5";
    });

    // Elige una imagen aleatoria para agrandar
    const randomIndex = Math.floor(Math.random() * images.length);
    const selectedImage = images[randomIndex];
    selectedImage.style.transform = "scale(1.3)";
    selectedImage.style.opacity = "1";

    rounds--;

    // Cuando pasan las 15 rondas
    if (rounds == 0) {
      clearInterval(interval);

      // Resalta la imagen elegida y opaca las otras
      images.forEach((img, i) => {
        if (i === randomFinal) {
          img.style.transition = "all 0.5s ease";
          img.style.transform = "scale(1.8)";
          img.style.filter = "brightness(1.4)";
          img.style.boxShadow = "0 0 40px 10px rgba(255, 255, 255, 0.8)";
          img.style.zIndex = "10";
        } else {
          img.style.opacity = "0";
          img.style.transition = "opacity 0.5s ease";
        }
      });

      // Despues de 3 segundos ocualta la galeria
      setTimeout(() => {
      gallery.classList.add("hidden");
      console.log("Imagen seleccionada:", imageLevels[randomFinal]);

      // Mostrar la seleccion de piezas.
      const gamePieces = document.getElementById("game-pieces");
      gamePieces.classList.add("visible");
      gamePieces.classList.remove("hidden");
       }, 3000);
    }
  }, 300); // Cada 0.300s cambia de imagen.
});

