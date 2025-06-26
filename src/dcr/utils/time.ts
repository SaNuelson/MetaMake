/**
 * Array of numbers in format [hours, minutes, seconds [, milliseconds]]
 */
export type TimeOfDay = [number, number, number, number?];

/**
 * Checks if provided variable is a valid Date
 */
export function isValidDate(date: any): date is Date {
    return date instanceof Date && !isNaN(+date);
}

/**
 * Checks if the provided variable is a valid time of day (according to Google Charts)
 */
export function isValidTimeOfDay(tod: any): tod is TimeOfDay {
    if (!(tod instanceof Array))
        return false;

    if (tod.length < 3 || tod.length > 4)
        return false;

    if (tod[0] < 0 || tod[0] > 23)
        return false;

    if (tod[1] < 0 || tod[1] > 59)
        return false;

    if (tod[2] < 0 || tod[2] > 59)
        return false;

    if (tod[3] && (tod[3] < 0 || tod[3] > 999))
        return false;

    return true;
}

/**
 * Extracts time of day data from a valid date object.
 * @param {Date} date
 * @returns {TimeOfDay} time of day
 */
export function dateToTimeOfDay(date: Date): TimeOfDay {
    return [date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()];
}

export function compareDates(date1: Date, date2: Date): number {
    return +date1 - +date2;
}

export function compareTods(tod1: TimeOfDay, tod2: TimeOfDay): number {
    const hrs = tod1[0] - tod2[0];
    if (hrs !== 0) return hrs;
    const mns = tod1[1] - tod2[1];
    if (mns !== 0) return mns;
    const scs = (tod1[2] ?? 0) - (tod2[2] ?? 0);
    if (scs !== 0) return scs;
    const mls = (tod1[3] ?? 0) - (tod2[3] ?? 0);
    return mls;
}
