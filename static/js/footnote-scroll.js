(function() {
  // Handle smooth scrolling for all footnote links (both directions)
  document.addEventListener('DOMContentLoaded', function() {
    // Get all footnote links (both references and backlinks)
    const footnoteLinks = document.querySelectorAll('a[href^="#fn:"], a[href^="#fnref:"]');

    footnoteLinks.forEach(function(link) {
      link.addEventListener('click', function(e) {
        e.preventDefault();

        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
          // Calculate position with offset
          const offset = 100; // pixels from top
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - offset;

          // Smooth scroll to position
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });

          // Update URL hash without jumping
          history.pushState(null, null, this.getAttribute('href'));
        }
      });
    });
  });
})();
