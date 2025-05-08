export const getFlagEmoji = (countryCode) => {
    return countryCode
        .toUpperCase()
        .replace(/./g, char => String.fromCodePoint(char.charCodeAt() + 127397));
};