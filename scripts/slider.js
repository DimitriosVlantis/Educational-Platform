class Slider {
    #_containerSectionName;
    #_containerSection;
    #_leftArrow;
    #_rightArrow;
    #_cards;
    #_direction = {
        left: 'left',
        right: 'right'
    };
    #_shouldSlide = true;
    #_breakpoints = [{breakpoint: {min: 0, max: Infinity}, cards: 0}];
    #_slots;
    #_positions;
    #_numOfVisibleCards;

    constructor(containerSection, breakpoints) {
        this.#_containerSectionName = containerSection;
        this.#_containerSection = document.querySelector(`#${this.#_containerSectionName}`);
        this.#_leftArrow = this.#_containerSection.querySelector(".left.arrow");
        this.#_rightArrow = this.#_containerSection.querySelector(".right.arrow");
        this.#_cards = this.#_containerSection.querySelectorAll(".card");
        this.#_breakpoints = breakpoints;
        this.#initialize();
    }

    #initialize() {
        this.#setCards();
        this.#setVisibility();
        this.#setAriaSlideNumbers();
        this.#setAriaAttributes();
        this.#addEventListeners();
    }

    #setCards() {
        this.#createSlots();
        this.#populateSlots();
        this.#createPositions();
        const buttonControl = this.#_containerSection.querySelector('.slider-controls');
        if (this.#_numOfVisibleCards === this.#_cards.length) {
            if (buttonControl.classList.contains('visible')) {
                buttonControl.classList.remove('visible');
            }
            buttonControl.classList.add('hidden');
            for (const [index, card] of this.#_cards.entries()) {
                card.style.left = `${this.#calculatePosition(index + 1)}px`;
            }
        } else {
            if (buttonControl.classList.contains('hidden')) {
                buttonControl.classList.remove('hidden');
                buttonControl.classList.add('visible');
            }
            for (const [index, card] of this.#_slots.entries()) {
                card.style.left = `${this.#_positions[index]}px`;
            }
        }
        this.#setVisibility(0);
    }

    #createSlots() {
        for (const el of this.#_breakpoints) {
            if (window.innerWidth >= el.breakpoint.min && window.innerWidth < el.breakpoint.max) {
                this.#_numOfVisibleCards = Math.min(el.cards, this.#_cards.length);
                let arrayLength = this.#_cards.length;
                arrayLength +=  this.#_cards.length === this.#_numOfVisibleCards ? 1 : 0;
                this.#_slots = new Array(arrayLength);
                break;
            }
        }
    }

    #calculatePosition(slot) {
        const cardWidth = this.#_cards[0].getBoundingClientRect().width;
        return (Math.min(window.outerWidth, window.innerWidth) / this.#_numOfVisibleCards) * (slot - 0.5)
            - cardWidth / 2;
    }

    #createPositions() {
        this.#_positions = new Array(this.#_slots.length);
        for (let i = 0; i < this.#_positions.length; ++i) {
            this.#_positions[i] = this.#calculatePosition(i);
        }
    }

    #populateSlots() {
        let cardIndex = 0;
        for (let i = 1; i < this.#_slots.length; ++i) {
            this.#_slots[i] = this.#_cards[cardIndex++];
        }
        if (this.#_slots.length === this.#_cards.length) {
            this.#_slots[0] = this.#_cards[this.#_cards.length - 1];
        }
    }

    #shiftCards(direction) {
        const isLeft = direction === this.#_direction.left;
        if (isLeft) {
            const card = this.#_slots.shift();
            this.#_slots.push(card);
        } else {
            const card = this.#_slots.pop();
            this.#_slots.unshift(card);
        }

        for (const [index, card] of this.#_slots.entries()) {
            if (index > 0 && index <= this.#_numOfVisibleCards) {
                if (card.classList.contains('visible')) continue;
                card.classList.add('visible');
            } else {
                if (!card.classList.contains('visible')) continue;
                card.classList.remove('visible');
            }
        }
    }

    #animateOuterRightCard() {
        const card = this.#_slots[0];
        if (this.#_cards.length < this.#_numOfVisibleCards + 2) {
            card.classList.add(`${this.#_direction.left}`);
            card.style.left = `${this.#calculatePosition(this.#_numOfVisibleCards + 1)}px`;
            setTimeout(() => {
                card.classList.remove(`${this.#_direction.left}`);
                card.style.left = `${this.#_positions[0]}px`;
            }, 1000);
        } else {
            card.style.left = `${this.#_positions[0]}px`;
        }
    }

    #animateOuterLeftCard() {
        const card = this.#_slots[this.#_cards.length - 1];
        if (this.#_cards.length < this.#_numOfVisibleCards + 2) {
            card.style.left = `${this.#calculatePosition(this.#_numOfVisibleCards + 1)}px`;
            setTimeout(() => {
                card.classList.add(`${this.#_direction.left}`);
                card.style.left = `${this.#_positions[this.#_cards.length - 1]}px`;
            }, 1);
            setTimeout(() => {
                card.classList.remove(`${this.#_direction.left}`);
            }, 1000);
        } else {
            card.style.left = `${this.#_positions[this.#_cards.length - 1]}px`;
        }
    }

    #animateCards(direction) {
        const isLeft = direction === this.#_direction.left;
        this.#shiftCards(direction);

        for (let index = 0; index < this.#_slots.length; ++index) {
            if (isLeft && index === this.#_slots.length - 1) {
                this.#animateOuterLeftCard();
                continue;
            }
            if (!isLeft && index === 0) {
                this.#animateOuterRightCard();
                continue;
            }
            const card = this.#_slots[index];
            setTimeout(() => {
                card.classList.add(`${this.#_direction.left}`);
                card.style.left = `${this.#_positions[index]}px`;
            }, 1);
            setTimeout(() => {
                card.classList.remove(`${this.#_direction.left}`);
            }, 1000);
        }
        this.#setVisibility();
    }

    #setVisibility(timeout = 1000) {
        for (const [index, card] of this.#_slots.entries()) {
            if (card === undefined || card === null) continue;
            setTimeout(() => {
                if (index > 0 && index <= this.#_numOfVisibleCards) {
                    if (!card.classList.contains('visible')) {
                        card.classList.add('visible');
                    }
                    if (card.classList.contains('hidden')) {
                        card.classList.remove('hidden');
                    }
                } else {
                    if (!card.classList.contains('hidden')) {
                        card.classList.add('hidden');
                    }
                    if (card.classList.contains('visible')) {
                        card.classList.remove('visible');
                    }
                }
            }, timeout);
        }
    }

    #moveCards(direction) {
        if (this.#_shouldSlide) {
            this.#_shouldSlide = false;
            this.#animateCards(direction);
            this.#setAriaAttributes();
            setTimeout(() => {
                this.#_shouldSlide = true;
            }, 1000);
        }
    }

    #addEventListeners() {
        this.#_leftArrow.addEventListener('click', () => {
            this.#moveCards(this.#_direction.left);
        });
        this.#_rightArrow.addEventListener('click', () => {
            this.#moveCards(this.#_direction.right);
        });
        document.addEventListener('DOMContentLoaded', () => {
            this.#makeCardsStandardHeight();
        });
        window.addEventListener('resize', () => {
            this.#resetHeights();
            this.#makeCardsStandardHeight();
            this.#setCards();
        });
    }

    #resetHeights() {
        this.#_cards.forEach(el => el.style.removeProperty('height'));
    }

    #makeCardsStandardHeight() {
        const maxHeight = (Array.from(this.#_cards)).reduce((maxHeight, curCard) => {
            return Math.max(maxHeight, curCard.getBoundingClientRect().height)
        }, 0);

        this.#_cards.forEach(card => card.style.height = `${maxHeight}px`);
        this.#stretchSliderHeight(maxHeight);
    }

    #stretchSliderHeight(height) {
        this.#_containerSection.querySelector('.slider').style.height = `calc(${height}px + 1em)`;
    }

    #setAriaAttributes() {
        const listItems = this.#_containerSection.querySelectorAll('li[aria-roledescription="slide"]');
        listItems.forEach(item => {
            setTimeout(() => {
                if (item.querySelector('.card').classList.contains('visible')) {
                    item.setAttribute('aria-hidden', 'false');
                } else {
                    item.setAttribute('aria-hidden', 'true');
                }
            }, 1000);
        });
    }

    #setAriaSlideNumbers() {
        const listItems = this.#_containerSection.querySelectorAll('li[aria-roledescription="slide"]');
        listItems.forEach((item, index) => {
            item.setAttribute('aria-label', `${index + 1} of ${listItems.length}`);
        });
    }
}

export default Slider;