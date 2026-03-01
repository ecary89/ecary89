// analytics.js — conversion tracking for erikacary.com
// Sends events to Google Analytics 4 when visitors click contact links.
// GA4 automatically tracks: sessions, page views, and engagement time (time on site).

document.addEventListener('DOMContentLoaded', function () {

    // Helper: fire a GA4 event only if gtag is loaded
    function track(eventName, params) {
        if (typeof gtag === 'function') {
            gtag('event', eventName, params);
        }
    }

    // --- Email click ---
    // Fires a 'generate_lead' event with method: 'email'
    // Find this in GA4 under Events > generate_lead, filtered by event_label = 'email'
    const emailLink = document.querySelector('a[href^="mailto"]');
    if (emailLink) {
        emailLink.addEventListener('click', function () {
            track('generate_lead', {
                event_category: 'contact',
                event_label: 'email'
            });
        });
    }

    // --- LinkedIn click ---
    // Fires a 'generate_lead' event with method: 'linkedin'
    // Find this in GA4 under Events > generate_lead, filtered by event_label = 'linkedin'
    const linkedinLink = document.querySelector('a[href*="linkedin"]');
    if (linkedinLink) {
        linkedinLink.addEventListener('click', function () {
            track('generate_lead', {
                event_category: 'contact',
                event_label: 'linkedin'
            });
        });
    }

});
