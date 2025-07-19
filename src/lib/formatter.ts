
export function formatPlural(
    number: number,
    { singular, plural }: { singular: string, plural: string },
    { includeCount = true } = {}) {

    const word = number === 1 ? singular : plural;
    return includeCount ? `${number} ${word}` : word
}