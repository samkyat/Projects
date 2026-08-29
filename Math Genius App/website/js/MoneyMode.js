import { CANADIAN_DENOMINATIONS } from './MathModes.js';

export class MoneySelector {
    constructor({ buttonContainer, selectionContainer, totalElement, countElement, clearButton }) {
        this.buttonContainer = buttonContainer;
        this.selectionContainer = selectionContainer;
        this.totalElement = totalElement;
        this.countElement = countElement;
        this.clearButton = clearButton;
        this.selected = [];
        this.onChange = null;
        this.renderButtons();
        this.clearButton.addEventListener('click', () => this.clear());
    }

    renderButtons() {
        this.buttonContainer.innerHTML = '';
        CANADIAN_DENOMINATIONS.forEach(denomination => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = `money-button ${denomination.type}`;
            button.innerText = denomination.label;
            button.dataset.cents = denomination.cents;
            button.addEventListener('click', () => this.add(denomination));
            this.buttonContainer.appendChild(button);
        });
    }

    add(denomination) {
        this.selected.push(denomination);
        this.update();
    }

    remove(index) {
        this.selected.splice(index, 1);
        this.update();
    }

    clear() {
        this.selected = [];
        this.update();
    }

    update() {
        const totalCents = this.selected.reduce((total, denomination) => total + denomination.cents, 0);
        this.totalElement.innerText = formatMoney(totalCents);
        this.countElement.innerText = `${this.selected.length} piece${this.selected.length === 1 ? '' : 's'}`;
        this.selectionContainer.innerHTML = '';

        this.selected.forEach((denomination, index) => {
            const removeButton = document.createElement('button');
            removeButton.type = 'button';
            removeButton.className = 'selected-money';
            removeButton.innerText = `${denomination.label} ×`;
            removeButton.setAttribute('aria-label', `Remove ${denomination.label}`);
            removeButton.addEventListener('click', () => this.remove(index));
            this.selectionContainer.appendChild(removeButton);
        });

        if (this.onChange) {
            this.onChange({ totalCents, pieceCount: this.selected.length });
        }
    }

    reset() {
        this.clear();
    }

    getAnswer() {
        return {
            totalCents: this.selected.reduce((total, denomination) => total + denomination.cents, 0),
            pieceCount: this.selected.length
        };
    }
}

export function formatMoney(cents) {
    return `$${(cents / 100).toFixed(2)}`;
}