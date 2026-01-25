(() => {
    const sliders = document.querySelectorAll('[data-slider]');

    sliders.forEach((slider) => {
        const track = slider.querySelector('[data-slider-track]');
        const slides = slider.querySelectorAll('[data-slide]');
        const prev = slider.querySelector('[data-slider-prev]');
        const next = slider.querySelector('[data-slider-next]');

        if (!track || slides.length === 0 || !prev || !next) {
            return;
        }

        let index = 0;

        const update = () => {
            track.style.transform = `translateX(-${index * 100}%)`;
        };

        prev.addEventListener('click', () => {
            index = (index - 1 + slides.length) % slides.length;
            update();
        });

        next.addEventListener('click', () => {
            index = (index + 1) % slides.length;
            update();
        });
    });
})();
