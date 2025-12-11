if (document.getElementById("starfield")) {
  let starfield = document.getElementById("starfield");
  let numStars = parseInt(starfield.dataset.stars) || 200;

  // Create static twinkling stars
  for (let i = 0; i < numStars; i++) {
    const star = document.createElement("div");
    star.className = "star";
    // Random size
    const sizeClass =
      Math.random() < 0.7 ? "small" : Math.random() < 0.9 ? "medium" : "large";
    star.classList.add(sizeClass);
    // Random position
    star.style.left = Math.random() * 100 + "%";
    star.style.top = Math.random() * 100 + "%";
    // Random animation duration (2-6 seconds) and delay
    star.style.animationDuration = 2 + Math.random() * 4 + "s";
    star.style.animationDelay = Math.random() * 5 + "s";
    starfield.appendChild(star);
  }
}
