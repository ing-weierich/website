(() => {
    const items = document.querySelectorAll('[data-accordion-item]');

    items.forEach((item) => {
        const toggle = item.querySelector('[data-accordion-toggle]');
        if (!toggle) {
            return;
        }

        toggle.addEventListener('click', () => {
            const container = item.parentElement;
            if (container) {
                container.querySelectorAll('[data-accordion-item]').forEach((other) => {
                    if (other !== item) {
                        other.removeAttribute('data-open');
                    }
                });
            }

            if (item.getAttribute('data-open') === 'true') {
                item.removeAttribute('data-open');
            } else {
                item.setAttribute('data-open', 'true');
            }
        });
    });
})();
