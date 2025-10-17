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