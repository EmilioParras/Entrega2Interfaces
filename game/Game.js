const playBtn = document.querySelector('#play');
const overlay = document.querySelector('.running');
const content = document.querySelector('.game-execution');

playBtn.addEventListener("click", toggleMenu);
function toggleMenu() {                                                     
    document.querySelector(".running").classList.toggle("show");
}

overlay.addEventListener("click", function(e){
        if (e.target === overlay) {
    overlay.classList.remove("show");
  }
});