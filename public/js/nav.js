(() => {
    const header = document.querySelector('[data-header]');
    if (!header) {
        return;
    }

    const nav = header.querySelector('[data-nav]');
    const toggle = header.querySelector('[data-nav-toggle]');

    if (!nav || !toggle) {
        return;
    }

    const setOpen = (open) => {
        header.setAttribute('data-open', open ? 'true' : 'false');
    };

    toggle.addEventListener('click', () => {
        const isOpen = header.getAttribute('data-open') === 'true';
        setOpen(!isOpen);
    });

    nav.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            setOpen(false);
        });
    });
})();
