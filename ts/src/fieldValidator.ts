export function fieldHasValue(validationActive: boolean, value: any): boolean {
    // always validate to true if validation is not yet active
    if (!validationActive) {
        return true
    }
    // return false if no value is set
    if (!value || value.trim() === "") {
        return false
    }
    return true
}

export function validateField(validationActive: boolean, value: any, key: string, issues: Set<string>) {
    const fieldSet = fieldHasValue(validationActive, value);
    if (!fieldSet) {
        issues.add(key);
    } else {
        issues.delete(key);
    }
    return fieldSet
}

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
export function getDateOfBirthValidationMessage(dateOfBirth?: string): string | null {
    // unset ==> INVALID
    if (!dateOfBirth || dateOfBirth.trim() === '') {
        return ''
    }

    const dateParts = dateOfBirth.split('.')
    const invalidFormatMessage =
        'Das Gebursdatum muss im Format Tag.Monat.Jahr angegeben werden (z.B. 27.03.2009)'
    if (dateParts.length !== 3) {
        return invalidFormatMessage
    }

    const dayStr = dateParts[0].trim()
    const monthStr = dateParts[1].trim()
    const yearStr = dateParts[2].trim()
    if (yearStr.length !== 4) {
        return invalidFormatMessage
    }

    const day = parseInt(dayStr, 10)
    const month = parseInt(monthStr, 10) - 1 // Months are 0-based (0-11)
    const year = parseInt(yearStr, 10)

    const date = new Date(year, month, day)
    // invalid date (i.e. invalid month, day, ...)
    if (isNaN(date.getTime()) || date.getDate() !== day) {
        return invalidFormatMessage + ' Überprüfe den Monat und den Tag.'
    }

    if (date > new Date()) {
        return 'Das Geburtsdatum muss in der Vergangenheit liegen.'
    }
    return null
}

