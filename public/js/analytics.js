(() => {
    // Google Analytics 4 measurement ID. Set it either here or by defining
    // window.GA_MEASUREMENT_ID before this script runs. It looks like
    // "G-XXXXXXXXXX". While it is left as the placeholder, tracking stays off.
    const MEASUREMENT_ID = window.GA_MEASUREMENT_ID || 'G-XXXXXXXXXX';

    // Requires the consent banner (issue #4) to expose window.cookieConsent.
    const consent = window.cookieConsent;
    if (!consent || typeof consent.register !== 'function') {
        return;
    }

    // Register the analytics category so it appears in the consent preferences.
    // The banner is category-agnostic; this is the whole extension point.
    consent.register({
        id: 'analytics',
        title: 'Statistik',
        description:
            'Hilft uns mit Google Analytics zu verstehen, wie die Website genutzt wird. ' +
            'Wird erst nach Ihrer Einwilligung geladen.',
        required: false,
    });

    const idConfigured = MEASUREMENT_ID && MEASUREMENT_ID !== 'G-XXXXXXXXXX';

    let started = false;

    const gtag = function () {
        window.dataLayer.push(arguments);
    };

    // Base events beyond the automatic page_view: contact clicks (the site's
    // phone/e-mail links) and outbound links.
    const trackBaseEvents = () => {
        document.addEventListener('click', (event) => {
            const target = event.target;
            const link = target && target.closest ? target.closest('a[href]') : null;
            if (!link) {
                return;
            }
            const href = link.getAttribute('href') || '';

            if (href.indexOf('mailto:') === 0) {
                gtag('event', 'contact', { method: 'email', link_url: href });
            } else if (href.indexOf('tel:') === 0) {
                gtag('event', 'contact', { method: 'phone', link_url: href });
            } else if (/^https?:\/\//i.test(href) && link.hostname !== window.location.hostname) {
                gtag('event', 'click', {
                    outbound: true,
                    link_domain: link.hostname,
                    link_url: href,
                });
            }
        });
    };

    const start = () => {
        if (started) {
            return;
        }
        started = true;

        // Always wire up base-event tracking; individual events no-op safely
        // until gtag.js has loaded and flushed the dataLayer.
        window.dataLayer = window.dataLayer || [];
        window.gtag = gtag;
        trackBaseEvents();

        if (!idConfigured) {
            // Consent granted but no real property configured yet — do not load
            // gtag.js with an invalid ID.
            if (window.console && console.warn) {
                console.warn('[analytics] Consent granted, but no Google Analytics ID is configured.');
            }
            return;
        }

        gtag('js', new Date());
        gtag('config', MEASUREMENT_ID);

        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(MEASUREMENT_ID);
        document.head.appendChild(script);
    };

    // Load only once the visitor has consented to the analytics category
    // (fires immediately if consent was already stored from a previous visit).
    consent.onConsent('analytics', start);
})();
