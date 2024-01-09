document.addEventListener("DOMContentLoaded", function() {
    setTimeout(function() {
    // Get all elements with the class 'fade-in'
        var elements = document.querySelectorAll('.fade-in');
    
        // Options for the IntersectionObserver
        var options = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5,
        };
    
        // Callback function to handle the intersection
        function handleIntersection(entries, observer) {
        entries.forEach(function(entry) {
            console.log('Intersection triggered');
            if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
            }
        });
        }
    
        // Create an IntersectionObserver with the callback and options
        var observer = new IntersectionObserver(handleIntersection, options);
    
        // Observe each element
        elements.forEach(function (element) {
            var duration = element.dataset.duration || 1; // Default duration is 1s
            element.style.transition = `opacity ${duration}s ease-in-out`;
            observer.observe(element);
        });
        console.log("load-in-animations.js loaded");
    }, 100);
  });