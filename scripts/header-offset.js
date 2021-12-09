function setHeaderOffset() {
    const header = document.querySelector('header');
    const heroSection = document.querySelector('.hero-section');

    heroSection.style.paddingTop = `${header.offsetHeight * 1.15}px`;
}

window.addEventListener('DOMContentLoaded', setHeaderOffset);
window.addEventListener('resize', setHeaderOffset);