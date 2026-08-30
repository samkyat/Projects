export const CANADIAN_CURRENCY_VALUES = {
    nickel: 5,
    dime: 10,
    quarter: 25,
    loonie: 100,
    toonie: 200,
    fiveDollarBill: 500,
    tenDollarBill: 1000,
    twentyDollarBill: 2000
};

export function calculateTotalCents(coinCounts = {}) {
    const defaultCounts = Object.fromEntries(
        Object.keys(CANADIAN_CURRENCY_VALUES).map((coinName) => [coinName, 0])
    );
    const normalizedCounts = { ...defaultCounts, ...coinCounts };

    return Object.entries(CANADIAN_CURRENCY_VALUES).reduce((total, [coinName, valueInCents]) => {
        const count = Number(normalizedCounts[coinName]) || 0;
        return total + (count * valueInCents);
    }, 0);
}

export function verifyCurrencyTotal(coinCounts = {}, targetCents) {
    return calculateTotalCents(coinCounts) === Number(targetCents);
}

export function formatCurrencyDisplay(cents) {
    const safeCents = Math.max(0, Number(cents) || 0);
    return `$${(safeCents / 100).toFixed(2)}`;
}
