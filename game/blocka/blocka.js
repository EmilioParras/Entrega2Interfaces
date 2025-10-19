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