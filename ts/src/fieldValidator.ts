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
    if (fieldSet) {
        issues.add(key);
    } else {
        issues.delete(key);
    }
    return fieldSet
}
