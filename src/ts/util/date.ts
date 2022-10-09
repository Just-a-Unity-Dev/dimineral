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

export function getVerboseDate(year: number, month: number, today: number, hours: number, minutes: number): string {
    let monthVerbose = getVerboseMonth(month);

    return `It is the ${ordinalSuffixOf(today)} of ${monthVerbose}, ${year}. The time is ${hours}${minutes}.`
}