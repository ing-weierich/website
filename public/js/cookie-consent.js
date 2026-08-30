(() => {
    const STORAGE_KEY = 'cookie-consent';
    const STORAGE_VERSION = 1;

    // Registered consent categories. Extend the banner by calling
    // window.cookieConsent.register({ id, title, description }) from any script
    // before DOMContentLoaded (deferred scripts run in order), or at runtime to
    // re-render the preferences. The "necessary" category is always present.
    const categories = [];
    // Callbacks waiting for a given category's consent: { id -> [fn, ...] }.
    const listeners = {};

    let choices = null; // null until the visitor has made a decision
    let rendered = false;

    const readStored = () => {
        try {
            const raw = window.localStorage.getItem(STORAGE_KEY);
            if (!raw) {
                return null;
            }
            const parsed = JSON.parse(raw);
            if (!parsed || parsed.version !== STORAGE_VERSION || typeof parsed.choices !== 'object') {
                return null;
            }
            return parsed.choices;
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
            /* storage unavailable (private mode) — consent stays session-only */
        }
    };

    const isGranted = (id) => {
        const category = categories.find((entry) => entry.id === id);
        if (category && category.required) {
            return true;
        }
        return Boolean(choices && choices[id]);
    };

    const notify = (id) => {
        if (!isGranted(id) || !listeners[id]) {
            return;
        }
        const pending = listeners[id];
        listeners[id] = [];
        pending.forEach((fn) => {
            try {
                fn();
            } catch (err) {
                /* a consumer callback must not break consent handling */
            }
        });
    };

    const notifyAll = () => {
        categories.forEach((category) => notify(category.id));
    };

    // --- DOM -----------------------------------------------------------------

    const els = {};

    const cacheEls = () => {
        els.root = document.querySelector('[data-cookie-consent]');
        if (!els.root) {
            return false;
        }
        els.options = els.root.querySelector('[data-cookie-options]');
        els.toggleOptions = els.root.querySelector('[data-cookie-toggle-options]');
        els.save = els.root.querySelector('[data-cookie-save]');
        els.accept = els.root.querySelector('[data-cookie-accept]');
        els.reject = els.root.querySelector('[data-cookie-reject]');
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

            els.options.appendChild(row);
        });
    };

    const collectSelection = () => {
        const selection = {};
        categories.forEach((category) => {
            if (category.required) {
                selection[category.id] = true;
                return;
            }
            const input = els.options
                ? els.options.querySelector(`[data-cookie-category="${category.id}"]`)
                : null;
            selection[category.id] = input ? input.checked : Boolean(choices && choices[category.id]);
        });
        return selection;
    };

    const showOptions = (open) => {
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
        // Move focus into the dialog for keyboard and screen-reader users.
        if (els.accept && typeof els.accept.focus === 'function') {
            els.accept.focus();
        }
    };

    const hideBanner = () => {
        if (els.root) {
            els.root.hidden = true;
        }
    };

    const commit = (selection) => {
        choices = selection;
        persist();
        hideBanner();
        notifyAll();
    };

    const acceptAll = () => {
        const selection = {};
        categories.forEach((category) => {
            selection[category.id] = true;
        });
        commit(selection);
    };

    const rejectAll = () => {
        const selection = {};
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
        // Any element marked [data-cookie-open] re-opens the settings dialog,
        // e.g. a "Cookie-Einstellungen" link in the footer.
        document.querySelectorAll('[data-cookie-open]').forEach((trigger) => {
            trigger.addEventListener('click', (event) => {
                event.preventDefault();
                api.openSettings();
            });
        });
    };

    const render = () => {
        if (!cacheEls()) {
            return;
        }
        rendered = true;
        bindEvents();
        if (choices === null) {
            showBanner();
        } else {
            renderOptions();
        }
    };

    // --- Public API ----------------------------------------------------------

    const api = {
        register(category) {
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
                notify(category.id);
            }
            return api;
        },
        get(id) {
            return isGranted(id);
        },
        all() {
            const snapshot = {};
            categories.forEach((category) => {
                snapshot[category.id] = isGranted(category.id);
            });
            return snapshot;
        },
        onConsent(id, callback) {
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
            if (!rendered) {
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

    // The always-present necessary category.
    api.register({
        id: 'necessary',
        title: 'Notwendig',
        description:
            'Diese Cookies sind für den Betrieb der Website erforderlich und können nicht deaktiviert werden.',
        required: true,
    });

    choices = readStored();
    window.cookieConsent = api;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', render);
    } else {
        render();
    }
})();
