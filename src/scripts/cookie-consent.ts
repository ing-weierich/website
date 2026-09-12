/**
 * Consent-Verwaltung für die Website.
 *
 * Portiert aus PR #7 (public/js/cookie-consent.js). Statt eines globalen IIFE
 * ist es jetzt ein ES-Modul: Skripte, die Consent brauchen, importieren es
 * (siehe analytics.ts) und bekommen damit garantiert die richtige
 * Ausführungsreihenfolge. `window.cookieConsent` bleibt für Inline-Skripte
 * und externe Einbindungen erhalten.
 */

export interface ConsentCategoryInput {
    id: string;
    title?: string;
    description?: string;
    required?: boolean;
}

interface ConsentCategory {
    id: string;
    title: string;
    description: string;
    required: boolean;
}

type ConsentChoices = Record<string, boolean>;

export interface CookieConsentApi {
    register(category: ConsentCategoryInput): CookieConsentApi;
    get(id: string): boolean;
    all(): ConsentChoices;
    onConsent(id: string, callback: () => void): () => void;
    openSettings(): void;
    hasDecision(): boolean;
}

declare global {
    interface Window {
        cookieConsent?: CookieConsentApi;
    }
}

const STORAGE_KEY = 'cookie-consent';
const STORAGE_VERSION = 1;

// Registrierte Consent-Kategorien. Erweiterbar über
// window.cookieConsent.register({ id, title, description }) bzw. über den
// Import dieses Moduls. Die Kategorie "necessary" ist immer vorhanden.
const categories: ConsentCategory[] = [];
// Callbacks, die auf die Einwilligung einer Kategorie warten: { id -> [fn, ...] }
const listeners: Record<string, Array<() => void>> = {};

let choices: ConsentChoices | null = null; // null, solange keine Entscheidung vorliegt
let rendered = false;

const readStored = (): ConsentChoices | null => {
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            return null;
        }
        const parsed = JSON.parse(raw);
        if (!parsed || parsed.version !== STORAGE_VERSION || typeof parsed.choices !== 'object') {
            return null;
        }
        return parsed.choices as ConsentChoices;
    } catch (err) {
        return null;
    }
};

const persist = () => {
    try {
        window.localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
                version: STORAGE_VERSION,
                choices,
                timestamp: new Date().toISOString(),
            })
        );
    } catch (err) {
        /* Storage nicht verfügbar (privater Modus) — Consent gilt nur für die Session */
    }
};

const isGranted = (id: string): boolean => {
    const category = categories.find((entry) => entry.id === id);
    if (category && category.required) {
        return true;
    }
    return Boolean(choices && choices[id]);
};

const notify = (id: string) => {
    if (!isGranted(id) || !listeners[id]) {
        return;
    }
    const pending = listeners[id];
    listeners[id] = [];
    pending.forEach((fn) => {
        try {
            fn();
        } catch (err) {
            /* ein Consumer-Callback darf die Consent-Verwaltung nicht kippen */
        }
    });
};

const notifyAll = () => {
    categories.forEach((category) => notify(category.id));
};

/**
 * Gibt es überhaupt etwas einzuwilligen? Solange nur die notwendige Kategorie
 * registriert ist, speichert die Seite nichts Einwilligungspflichtiges — dann
 * wird weder ein Banner gezeigt noch der "Cookie-Einstellungen"-Opener.
 */
const hasOptionalCategories = (): boolean => categories.some((category) => !category.required);

// --- DOM ---------------------------------------------------------------------

const els: {
    root?: HTMLElement | null;
    options?: HTMLElement | null;
    toggleOptions?: HTMLElement | null;
    save?: HTMLElement | null;
    accept?: HTMLElement | null;
    reject?: HTMLElement | null;
} = {};

const cacheEls = (): boolean => {
    els.root = document.querySelector<HTMLElement>('[data-cookie-consent]');
    if (!els.root) {
        return false;
    }
    els.options = els.root.querySelector<HTMLElement>('[data-cookie-options]');
    els.toggleOptions = els.root.querySelector<HTMLElement>('[data-cookie-toggle-options]');
    els.save = els.root.querySelector<HTMLElement>('[data-cookie-save]');
    els.accept = els.root.querySelector<HTMLElement>('[data-cookie-accept]');
    els.reject = els.root.querySelector<HTMLElement>('[data-cookie-reject]');
    return true;
};

const renderOptions = () => {
    if (!els.options) {
        return;
    }
    els.options.innerHTML = '';
    categories.forEach((category) => {
        const inputId = `cookie-cat-${category.id}`;
        const row = document.createElement('div');
        row.className = 'cookie-option';

        const label = document.createElement('label');
        label.className = 'cookie-option-label';
        label.setAttribute('for', inputId);

        const input = document.createElement('input');
        input.type = 'checkbox';
        input.id = inputId;
        input.className = 'cookie-option-input';
        input.setAttribute('data-cookie-category', category.id);
        input.checked = isGranted(category.id);
        if (category.required) {
            input.checked = true;
            input.disabled = true;
            input.setAttribute('aria-disabled', 'true');
        }

        const title = document.createElement('span');
        title.className = 'cookie-option-title';
        title.textContent = category.title;

        label.appendChild(input);
        label.appendChild(title);
        row.appendChild(label);

        if (category.description) {
            const desc = document.createElement('p');
            desc.className = 'cookie-option-desc';
            desc.textContent = category.description;
            row.appendChild(desc);
        }

        els.options!.appendChild(row);
    });
};

const collectSelection = (): ConsentChoices => {
    const selection: ConsentChoices = {};
    categories.forEach((category) => {
        if (category.required) {
            selection[category.id] = true;
            return;
        }
        const input = els.options
            ? els.options.querySelector<HTMLInputElement>(`[data-cookie-category="${category.id}"]`)
            : null;
        selection[category.id] = input ? input.checked : Boolean(choices && choices[category.id]);
    });
    return selection;
};

const showOptions = (open: boolean) => {
    if (!els.options || !els.toggleOptions) {
        return;
    }
    els.options.hidden = !open;
    els.toggleOptions.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (els.save) {
        els.save.hidden = !open;
    }
};

const showBanner = () => {
    if (!els.root) {
        return;
    }
    renderOptions();
    els.root.hidden = false;
    // Fokus in den Dialog holen — für Tastatur und Screenreader.
    if (els.accept && typeof els.accept.focus === 'function') {
        els.accept.focus();
    }
};

const hideBanner = () => {
    if (els.root) {
        els.root.hidden = true;
    }
};

const commit = (selection: ConsentChoices) => {
    choices = selection;
    persist();
    hideBanner();
    notifyAll();
};

const acceptAll = () => {
    const selection: ConsentChoices = {};
    categories.forEach((category) => {
        selection[category.id] = true;
    });
    commit(selection);
};

const rejectAll = () => {
    const selection: ConsentChoices = {};
    categories.forEach((category) => {
        selection[category.id] = Boolean(category.required);
    });
    commit(selection);
};

const bindEvents = () => {
    if (els.accept) {
        els.accept.addEventListener('click', acceptAll);
    }
    if (els.reject) {
        els.reject.addEventListener('click', rejectAll);
    }
    if (els.save) {
        els.save.addEventListener('click', () => commit(collectSelection()));
    }
    if (els.toggleOptions) {
        els.toggleOptions.addEventListener('click', () => {
            const open = els.options ? els.options.hidden : false;
            showOptions(open);
        });
    }
    // Jedes Element mit [data-cookie-open] öffnet die Einstellungen erneut,
    // z.B. der "Cookie-Einstellungen"-Button im Footer.
    document.querySelectorAll('[data-cookie-open]').forEach((trigger) => {
        trigger.addEventListener('click', (event) => {
            event.preventDefault();
            api.openSettings();
        });
    });
};

const updateOpeners = () => {
    const visible = hasOptionalCategories();
    document.querySelectorAll<HTMLElement>('[data-cookie-open]').forEach((trigger) => {
        trigger.hidden = !visible;
    });
};

const render = () => {
    if (!cacheEls()) {
        return;
    }
    rendered = true;
    bindEvents();
    updateOpeners();
    if (choices === null && hasOptionalCategories()) {
        showBanner();
    } else {
        renderOptions();
    }
};

// --- Öffentliche API ---------------------------------------------------------

export const api: CookieConsentApi = {
    register(category: ConsentCategoryInput) {
        if (!category || !category.id) {
            return api;
        }
        const existing = categories.find((entry) => entry.id === category.id);
        if (existing) {
            Object.assign(existing, category);
        } else {
            categories.push({
                id: category.id,
                title: category.title || category.id,
                description: category.description || '',
                required: Boolean(category.required),
            });
        }
        if (rendered) {
            renderOptions();
            updateOpeners();
            notify(category.id);
            if (choices === null && hasOptionalCategories()) {
                showBanner();
            }
        }
        return api;
    },
    get(id: string) {
        return isGranted(id);
    },
    all() {
        const snapshot: ConsentChoices = {};
        categories.forEach((category) => {
            snapshot[category.id] = isGranted(category.id);
        });
        return snapshot;
    },
    onConsent(id: string, callback: () => void) {
        if (typeof callback !== 'function') {
            return () => {};
        }
        if (isGranted(id)) {
            callback();
            return () => {};
        }
        listeners[id] = listeners[id] || [];
        listeners[id].push(callback);
        return () => {
            listeners[id] = (listeners[id] || []).filter((fn) => fn !== callback);
        };
    },
    openSettings() {
        if (!rendered || !hasOptionalCategories()) {
            return;
        }
        showBanner();
        showOptions(true);
        if (els.toggleOptions && typeof els.toggleOptions.focus === 'function') {
            els.toggleOptions.focus();
        }
    },
    hasDecision() {
        return choices !== null;
    },
};

// Die immer vorhandene Kategorie "notwendig".
api.register({
    id: 'necessary',
    title: 'Notwendig',
    description:
        'Speichert Ihre Auswahl in diesen Einstellungen lokal in Ihrem Browser. Dafür werden keine Cookies ' +
        'gesetzt; diese Kategorie kann nicht deaktiviert werden.',
    required: true,
});

choices = readStored();
window.cookieConsent = api;

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
} else {
    render();
}

export default api;
