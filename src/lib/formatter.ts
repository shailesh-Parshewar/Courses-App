
export function formatPlural(
    number: number,
    { singular, plural }: { singular: string, plural: string },
    { includeCount = true } = {}) {

    const word = number === 1 ? singular : plural;
    return includeCount ? `${number} ${word}` : word
}

export function formatPrice(price: number, { showZero = true } = {}) {
    const formatter = new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: Number.isInteger(price) ? 0 : 2
    })

    if (price == 0 && !showZero) return "Free";

    return formatter.format(price);
}