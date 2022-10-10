/**
 * Returns the ordinal suffix (1st, 2nd, 3rd, 4th, ...)
 * @param i number
 * @returns string
 */
export function ordinalSuffixOf(i: number): string {
    var j = i % 10,
        k = i % 100;
    if (j == 1 && k != 11) {
        return i + "st";
    }
    if (j == 2 && k != 12) {
        return i + "nd";
    }
    if (j == 3 && k != 13) {
        return i + "rd";
    }
    return i + "th";
}

/**
 * Returns a verbose month
 * @param month number
 * @returns string
 */
export function getVerboseMonth(month: number): string {
    let months = [
        "Shin",
        "Bet",
        "Gimel",
        "Tav",
        "He",
        "Wav",
        "Zayin",
        "Qof",
        "Tet",
        "Yod",
        "Kaf",
        "Lamed"
    ]

    return months[month];
}

/**
 * Returns a verbose date
 * @param year number
 * @param month number
 * @param today number
 * @param hours number
 * @param minutes number
 * @returns string
 */
export function getVerboseDate(year: number, month: number, today: number, hours: number, minutes: number): string {
    let monthVerbose = getVerboseMonth(month);
    let hoursStr: string = hours.toString();
    if (hours < 10) hoursStr = `0${hours}`;

    let minutesStr: string = minutes.toString();
    if (minutes < 10) minutesStr = `0${minutes}`;

    return `It is the ${ordinalSuffixOf(today)} of ${monthVerbose}, ${year}. The time is ${hoursStr}${minutesStr}.`
}
