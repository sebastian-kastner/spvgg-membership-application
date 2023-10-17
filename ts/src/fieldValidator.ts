export function isFieldSet(validationActive: boolean, value: any, key: string, issues: Set<string>): boolean {
    // always validate to true if validation is not yet active
    if (!validationActive) {
        return true
    }

    // return false if no value is set
    if (!value || value.trim() === "") {
        issues.add(key)
        return false
    }
    issues.delete(key)
    return true
}