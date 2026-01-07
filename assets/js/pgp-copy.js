// PGP Key copy functionality
document.addEventListener('DOMContentLoaded', function() {
  const copyButtons = document.querySelectorAll('.pgp-copy-trigger');

  copyButtons.forEach(button => {
    button.addEventListener('click', async function() {
      const feedback = button.closest('.contact-pgp').querySelector('.pgp-copy-feedback');

      try {
        const response = await fetch('/publickey.asc');
        const pgpKey = await response.text();

        await navigator.clipboard.writeText(pgpKey);

        feedback.textContent = 'PGP key copied to clipboard!';
        feedback.classList.add('show', 'success');

        setTimeout(() => {
          feedback.classList.remove('show');
        }, 3000);
      } catch (err) {
        console.error('Failed to copy PGP key:', err);

        feedback.textContent = 'Failed to copy key';
        feedback.classList.add('show', 'error');

        setTimeout(() => {
          feedback.classList.remove('show');
        }, 3000);
      }
    });
  });
});
