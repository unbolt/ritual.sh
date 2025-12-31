// Konami Code Easter Egg
(function () {
  const konamiCode = [
    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight",
    "KeyB",
    "KeyA",
  ];
  let konamiIndex = 0;

  // Create audio element
  const audio = new Audio("/audio/wow.mp3"); // You'll need to add this audio file

  document.addEventListener("keydown", function (e) {
    // Check if the pressed key matches the next key in the sequence
    if (e.code === konamiCode[konamiIndex]) {
      konamiIndex++;

      // If we've completed the sequence
      if (konamiIndex === konamiCode.length) {
        // Play the WOW sound
        audio.currentTime = 0; // Reset to start
        audio.play();

        // Optional: Add some visual feedback
        console.log("🎮 Konami Code activated!");

        // Reset the sequence
        konamiIndex = 0;
      }
    } else {
      // Wrong key, reset the sequence
      konamiIndex = 0;
    }
  });
})();
