// JavaScript for fade-in animation for text elements
document.addEventListener('DOMContentLoaded', function() {
// Text fade-in
const textElements = Array.from(document.querySelectorAll('.fade-in'));
textElements.sort((a, b) => parseInt(a.getAttribute('data-order'), 10) - parseInt(b.getAttribute('data-order'), 10));
let textDelay = 0.3; // Initial delay for the first text element
textElements.forEach((element, index) => {
const currentElementDelay = textDelay + index * 0.4; // Stagger subsequent text elements
element.style.transitionDelay = `${currentElementDelay}s`;
setTimeout(() => {
element.classList.add('visible');
}, currentElementDelay * 1000);
});

// Set current year in footer
document.getElementById('current-year').textContent = new Date().getFullYear();
});

// Function to add or remove the <br> tag based on screen width
function updateCopyrightLineBreak() {
    const copyrightElement = document.getElementById('copyright-text'); // We'll add an ID to your paragraph
    const mobileBreakpoint = 800; // Match your mobile media query breakpoint (or adjust as needed)
    const breakTag = '<br>';

    if (copyrightElement) {
        // Check if screen width is less than the mobile breakpoint
        if (window.innerWidth < mobileBreakpoint) {
            // Check if the <br> tag is NOT already present
            if (!copyrightElement.innerHTML.includes(breakTag)) {
                // Find the position to insert the <br> (e.g., after the first sentence)
                // This is a simple example, you might need to adjust based on your exact text
                const text = copyrightElement.textContent;
                const firstSentenceEnd = text.indexOf('. '); // Find the end of the first sentence
                if (firstSentenceEnd !== -1) {
                    copyrightElement.innerHTML = text.substring(0, firstSentenceEnd + 1) + breakTag + text.substring(firstSentenceEnd + 1).trim();
                } else {
                    // If no period found, just add <br> before "All rights reserved."
                     const allRightsIndex = text.indexOf('All rights reserved.');
                     if (allRightsIndex !== -1) {
                          copyrightElement.innerHTML = text.substring(0, allRightsIndex).trim() + breakTag + text.substring(allRightsIndex);
                     }
                }
            }
        } else {
            // If screen width is desktop or tablet, remove the <br> tag if it exists
            copyrightElement.innerHTML = copyrightElement.textContent; // Reset to original text
        }
    }
}

// Run the function on page load
window.addEventListener('load', updateCopyrightLineBreak);

// Run the function on window resize
window.addEventListener('resize', updateCopyrightLineBreak);