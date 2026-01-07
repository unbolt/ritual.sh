// Add copy buttons to all code blocks
document.addEventListener("DOMContentLoaded", function () {
  // Find all <pre> elements that contain <code>
  const codeBlocks = document.querySelectorAll("pre code");

  codeBlocks.forEach((codeBlock) => {
    const pre = codeBlock.parentElement;

    // Create wrapper for positioning
    const wrapper = document.createElement("div");
    wrapper.style.position = "relative";

    // Wrap the pre element
    pre.parentNode.insertBefore(wrapper, pre);
    wrapper.appendChild(pre);

    // Create copy button
    const copyButton = document.createElement("button");
    copyButton.className = "code-copy-btn";
    copyButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
    `;
    copyButton.setAttribute("aria-label", "Copy code to clipboard");

    // Add click handler
    copyButton.addEventListener("click", async () => {
      const code = codeBlock.textContent;

      try {
        await navigator.clipboard.writeText(code);

        // Show success feedback
        copyButton.classList.add("copied");

        // Reset after 2 seconds
        setTimeout(() => {
          copyButton.classList.remove("copied");
        }, 2000);
      } catch (err) {
        console.error("Failed to copy code:", err);

        // Fallback for older browsers
        const textArea = document.createElement("textarea");
        textArea.value = code;
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";
        document.body.appendChild(textArea);
        textArea.select();

        try {
          document.execCommand("copy");
          copyButton.classList.add("copied");

          setTimeout(() => {
            copyButton.classList.remove("copied");
          }, 2000);
        } catch (err2) {
          console.error("Fallback copy failed:", err2);
        }

        document.body.removeChild(textArea);
      }
    });

    wrapper.appendChild(copyButton);
  });
});
