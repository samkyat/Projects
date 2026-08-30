import { CANADIAN_DENOMINATIONS } from './MathModes.js';
import { formatCurrencyDisplay } from './currencyEngine.js';

export class MoneySelector {
    constructor({ buttonContainer, selectionContainer, totalElement, countElement, clearButton }) {
        this.buttonContainer = buttonContainer;
        this.selectionContainer = selectionContainer;
        this.totalElement = totalElement;
        this.countElement = countElement;
        this.clearButton = clearButton;
        this.denominations = CANADIAN_DENOMINATIONS;
        this.selected = [];
        this.onChange = null;
        this.bindEvents();
        this.renderButtons();
        this.clearButton.addEventListener('click', () => this.clear());
    }

    bindEvents() {
        this.buttonContainer.addEventListener('click', (event) => {
            const button = event.target.closest('button[data-cents]');
            if (!button) return;

            const denomination = this.denominations.find(
                item => String(item.cents) === String(button.dataset.cents)
            );

            if (denomination) {
                this.add(denomination);
            }
        });

        this.selectionContainer.addEventListener('click', (event) => {
            const button = event.target.closest('button[data-index]');
            if (!button) return;

            const index = Number(button.dataset.index);
            if (!Number.isNaN(index)) {
                this.remove(index);
            }
        });
    }

    renderButtons() {
        this.buttonContainer.innerHTML = '';
        this.denominations.forEach(denomination => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = `money-button ${denomination.type} money-${denomination.cents}`;
            const visual = document.createElement('span');
            visual.className = 'money-visual';
            visual.setAttribute('aria-hidden', 'true');
            const label = document.createElement('span');
            label.className = 'money-label';
            label.innerText = denomination.label;
            button.append(visual, label);
            button.setAttribute('aria-label', `Add ${denomination.label}`);
            button.dataset.cents = denomination.cents;
            this.buttonContainer.appendChild(button);
        });
    }

    setDenominations(denominations) {
        this.denominations = denominations;
        this.renderButtons();
    }

    focusFirstButton() {
        const firstButton = this.buttonContainer.querySelector('button:not(:disabled)');
        if (firstButton) firstButton.focus();
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

    setDisabled(disabled) {
        this.buttonContainer.querySelectorAll('button').forEach(button => {
            button.disabled = disabled;
        });
        this.selectionContainer.querySelectorAll('button').forEach(button => {
            button.disabled = disabled;
        });
        this.clearButton.disabled = disabled;
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
            removeButton.dataset.index = String(index);
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
    return formatCurrencyDisplay(cents);
}