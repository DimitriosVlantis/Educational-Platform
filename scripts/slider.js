class Slider {
    #_leftElement;
    #_rightElement;
    #_visible;
    #_containerSectionName;
    #_containerSection;
    #_leftArrow;
    #_rightArrow;
    #_cardArray;
    #_direction = {
        left: 'left',
        right: 'right'
    };
    #_shouldSlide = true;

    constructor(containerSection) {
        this.#_containerSectionName = containerSection;
        this.#_containerSection = document.querySelector(`#${this.#_containerSectionName}`);
        this.#_leftArrow = this.#_containerSection.querySelector(".left.arrow");
        this.#_rightArrow = this.#_containerSection.querySelector(".right.arrow");
        this.#_cardArray = this.#_containerSection.querySelectorAll(".card");
        this.#setAriaSlideNumbers();
        this.#calcOrder();
        this.#setClassesAfterAnimation();
        this.#setAriaAttributes();
        this.#addEventListeners();
    }

    /*
    * 1. Add to visible element arrow direction class
    * 2. Add to !(arrow direction) element visible class
    * 3. Remove from !(arrow direction) element !(arrow direction) class
    * 4. Wait 250ms
    * 5. Remove visible class from outbound element
    * 6. Recompute positions
    * 7. Add hidden classes
    * 8. Remove direction classes
    * 9. Re-add direction classes
    * */

    #calcOrder() {
        if (this.#_visible !== null && this.#_visible !== undefined) {
            this.#_visible.classList.remove('visible');
        }
        for (let i = 0; i < this.#_cardArray.length; ++i) {
            if (this.#_cardArray[i].classList.contains("visible")) {
                if (i === 0) {
                    this.#_leftElement = this.#_cardArray[this.#_cardArray.length - 1];
                } else {
                    this.#_leftElement = this.#_cardArray[i - 1];
                }
                if (i === this.#_cardArray.length - 1) {
                    this.#_rightElement = this.#_cardArray[0];
                } else {
                    this.#_rightElement = this.#_cardArray[i + 1];
                }
                this.#_visible = this.#_cardArray[i];
                break;
            }
        }
    }

    #setClassesAfterAnimation() {
        this.#_cardArray.forEach(card => {
            if (!card.classList.contains('visible') && !card.classList.contains('hidden')) {
                card.classList.add('hidden');
            }
            if (card.classList.contains(`${this.#_direction.left}`)) {
                card.classList.remove(`${this.#_direction.left}`);
            }
            if (card.classList.contains(`${this.#_direction.right}`)) {
                card.classList.remove(`${this.#_direction.right}`);
            }
        });

        this.#_rightElement.classList.add(`${this.#_direction.right}`);
        this.#_leftElement.classList.add(`${this.#_direction.left}`);
    }

    #setClassesBeforeAnimation(direction) {
        const inboundElement = direction === this.#_direction.right ? this.#_leftElement : this.#_rightElement;
        const outboundElement = this.#_visible;
        const oppositeDirection = direction === this.#_direction.right ? this.#_direction.left : this.#_direction.right;

        outboundElement.classList.add(`${direction}`);
        inboundElement.classList.remove('hidden');
        inboundElement.classList.add('visible');
        inboundElement.classList.remove(`${oppositeDirection}`);
    }

    #moveCards(direction) {
        if (this.#_shouldSlide) {
            this.#_shouldSlide = false;
            this.#setClassesBeforeAnimation(direction);
            setTimeout(() => {
                this.#calcOrder();
                this.#setClassesAfterAnimation(direction);
                this.#setAriaAttributes();
            }, 250);
            setTimeout(() => {
                this.#_shouldSlide = true;
            }, 500);
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
        });
    }

    #resetHeights() {
        this.#_cardArray.forEach(el => el.style.removeProperty('height'));
    }

    #makeCardsStandardHeight() {
        const maxHeight = (Array.from(this.#_cardArray)).reduce((maxHeight, curCard) => {
            return Math.max(maxHeight, curCard.getBoundingClientRect().height)
        }, 0);

        this.#_cardArray.forEach(card => card.style.height = `${maxHeight}px`);
        this.#stretchSliderHeight(maxHeight);
    }

    #stretchSliderHeight(height) {
        this.#_containerSection.querySelector('.slider').style.height = `${height}px`;
    }

    #setAriaAttributes() {
        const listItems = this.#_containerSection.querySelectorAll('li[aria-roledescription="slide"]');
        listItems.forEach(item => {
            if (item.querySelector('.card').classList.contains('visible')) {
                item.setAttribute('aria-hidden', 'false');
            } else {
                item.setAttribute('aria-hidden', 'true');
            }
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