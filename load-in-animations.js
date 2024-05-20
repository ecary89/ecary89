document.addEventListener('DOMContentLoaded', function() {
    // Get all elements with the class 'fade-in'
    var elements = Array.from(document.querySelectorAll('.fade-in'));

    // Sort elements based on their data-order attribute
    elements.sort(function(a, b) {
        return a.getAttribute('data-order') - b.getAttribute('data-order');
    });

    // Define the initial delay before the first element starts to fade in
    var initialDelay = 0.3; // in seconds

    // Apply fade-in effect in the specified order
    elements.forEach(function(element, index) {
        var delay = initialDelay + index * 0.3; // Adjust the delay as needed (0.5 seconds between each element)
        element.style.transitionDelay = `${delay}s`;
        setTimeout(() => {
            element.classList.add('visible');
        }, delay * 1000); // Convert seconds to milliseconds for setTimeout
    });
});