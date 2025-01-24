import { MemberType, type Member } from "../types"

/**
 * Validate a date of birth string in format dd.mm.yyyy. Checks wheter:
 * - dateOfBirth is set
 * - dateOfBirth is in the format dd.mm.yyyy
 * - dateOfBirth is in the past
 * 
 * If a validation issue is found, a validation message is returned. Otherwise null is returned.
 * 
 * @param dateOfBirth 
 * @returns 
 */
export function getDateOfBirthValidationMessage(member: Member): string | null {
    const dateOfBirth = member.dateOfBirth;
    if (!dateOfBirth || dateOfBirth.trim() === '') {
        return ''
    }

    const invalidFormatMessage =
        'Das Gebursdatum muss im Format Tag.Monat.Jahr angegeben werden (z.B. 27.03.2009)'

    const parsedDate = parseDate(dateOfBirth)
    if (!parsedDate) {
        return invalidFormatMessage
    }

    // invalid date (i.e. invalid month, day, ...)
    const date = parsedDate.date
    if (isNaN(date.getTime()) || date.getDate() !== parsedDate.day) {
        return invalidFormatMessage + '. Überprüfe den Monat und den Tag.'
    }

    if (date > new Date()) {
        return 'Das Geburtsdatum muss in der Vergangenheit liegen.'
    }

    if (member.memberType === MemberType.CREATOR || member.memberType === MemberType.CREATOR_WITHOUT_MEMBERSHIP ||member.memberType === MemberType.SPOUSE) {
        if (!isAdult(date)) {
            if (member.memberType === MemberType.CREATOR || member.memberType === MemberType.CREATOR_WITHOUT_MEMBERSHIP) {
                return 'Der Antragssteller muss volljährig sein!';
            } else {
                return '(Ehe-)partner müssen volljährig sein!';
            }
        }
    } else if (member.memberType === MemberType.CHILD) {
        if (isAdult(date)) {
            return 'Für volljährige Kinder muss ein separater Antrag gestellt werden!';
        }
    }

    return null
}

export type ParsedDate = {
    day: number,
    month: number,
    year: number,
    date: Date
}

export function parseDate(dateOfBirth?: string): ParsedDate | null {
    if (!dateOfBirth || dateOfBirth.trim() === '') {
        return null;
    }

    const dateParts = dateOfBirth.split('.')
    if (dateParts.length !== 3) {
        return null;
    }

    const dayStr = dateParts[0].trim()
    const monthStr = dateParts[1].trim()
    const yearStr = dateParts[2].trim()
    if (yearStr.length !== 4) {
        return null;
    }

    const day = parseInt(dayStr, 10)
    const month = parseInt(monthStr, 10) - 1 // Months are 0-based (0-11)
    const year = parseInt(yearStr, 10)

    return {
        day: day,
        month: month,
        year: year,
        date: new Date(year, month, day)
    }
}

export function isAdult(birthDate: Date): boolean {
    // calculate age
    const currentDate = new Date();
    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const month = currentDate.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && currentDate.getDate() < birthDate.getDate())) {
        age--;
    }

    // check if age is 18 or more
    return age >= 18
}