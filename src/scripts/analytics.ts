/**
 * Google Analytics 4, portiert aus PR #8 (public/js/analytics.js).
 *
 * Lädt gtag.js erst nach Einwilligung in die Kategorie "Statistik". Die
 * Consent-Verwaltung wird direkt importiert — dadurch ist garantiert, dass sie
 * vor der Registrierung der Kategorie ausgeführt wurde.
 *
 * Die Measurement-ID kommt aus der Umgebungsvariable PUBLIC_GA_MEASUREMENT_ID
 * (siehe .env.example) oder aus window.GA_MEASUREMENT_ID. Solange nur der
 * Platzhalter gesetzt ist, bleibt das Tracking aus.
 */
import consent from './cookie-consent';

declare global {
    interface Window {
        GA_MEASUREMENT_ID?: string;
        dataLayer?: IArguments[];
        gtag?: (...args: unknown[]) => void;
    }
}

const PLACEHOLDER_ID = 'G-XXXXXXXXXX';
const MEASUREMENT_ID: string =
    window.GA_MEASUREMENT_ID || import.meta.env.PUBLIC_GA_MEASUREMENT_ID || PLACEHOLDER_ID;

const idConfigured = Boolean(MEASUREMENT_ID) && MEASUREMENT_ID !== PLACEHOLDER_ID;

// Ohne konfigurierte Measurement-ID passiert hier nichts: keine Kategorie, kein
// Banner, kein Speichern im Endgerät. Erst mit ID gibt es etwas einzuwilligen.
if (idConfigured) {
    // Kategorie in den Consent-Einstellungen anmelden. Der Banner ist
    // kategorie-agnostisch; das hier ist der gesamte Erweiterungspunkt.
    consent.register({
        id: 'analytics',
        title: 'Statistik',
        description:
            'Hilft uns mit Google Analytics zu verstehen, wie die Website genutzt wird. ' +
            'Wird erst nach Ihrer Einwilligung geladen.',
        required: false,
    });
}

let started = false;

function gtag() {
    // gtag.js erwartet das arguments-Objekt, kein Array.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
}

// Ereignisse über den automatischen page_view hinaus: Kontaktklicks
// (Telefon/E-Mail der Seite) und ausgehende Links.
const trackBaseEvents = () => {
    document.addEventListener('click', (event) => {
        const target = event.target as Element | null;
        const link = target && target.closest ? target.closest('a[href]') : null;
        if (!link) {
            return;
        }
        const href = link.getAttribute('href') || '';

        if (href.indexOf('mailto:') === 0) {
            window.gtag!('event', 'contact', { method: 'email', link_url: href });
        } else if (href.indexOf('tel:') === 0) {
            window.gtag!('event', 'contact', { method: 'phone', link_url: href });
        } else if (/^https?:\/\//i.test(href) && (link as HTMLAnchorElement).hostname !== window.location.hostname) {
            window.gtag!('event', 'click', {
                outbound: true,
                link_domain: (link as HTMLAnchorElement).hostname,
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

    // Basis-Events immer verdrahten; einzelne Events laufen folgenlos ins
    // dataLayer, bis gtag.js geladen ist.
    window.dataLayer = window.dataLayer || [];
    window.gtag = gtag;
    trackBaseEvents();

    window.gtag('js', new Date());
    window.gtag('config', MEASUREMENT_ID);

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(MEASUREMENT_ID);
    document.head.appendChild(script);
};

// Erst laden, wenn in die Kategorie eingewilligt wurde (feuert sofort, wenn
// die Einwilligung aus einem früheren Besuch gespeichert ist).
if (idConfigured) {
    consent.onConsent('analytics', start);
}
