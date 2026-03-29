

const slides = document.querySelectorAll(".hero-slide");
const dots = document.querySelectorAll(".dot");
// const navItems = document.querySelectorAll(".bottom-nav-item");
const counters = document.querySelectorAll(".stat-box h2");


// HERO IMGE SLID


let currentIndex = 0;

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.remove("active");
    dots[i].classList.remove("active");
  });

  slides[index].classList.add("active");
  dots[index].classList.add("active");
}

function nextSlide() {
  currentIndex = (currentIndex + 1) % slides.length;
  showSlide(currentIndex);
}

// Auto change every 4 seconds
setInterval(nextSlide, 4000);

// Dot click
dots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    currentIndex = index;
    showSlide(currentIndex);
  });
});



// Animation of numberes
counters.forEach(counter => {
  let target = counter.innerText.replace("+", "").replace("%", "");
  let count = 0;

  const update = () => {
    let increment = target / 100;

    if (count < target) {
      count += increment;
      counter.innerText = Math.floor(count);
      setTimeout(update, 20);
    } else {
      counter.innerText = counter.innerText.includes("%")
        ? target + "%"
        : target + "+";
    }
  };

  update();
});




// ///FOR cllick of mob nav buttons
// navItems.forEach(item => {
//   item.addEventListener("click", () => {
//     navItems.forEach(i => i.classList.remove("active"));
//     item.classList.add("active");
//   });
// });