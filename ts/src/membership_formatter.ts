import type { Application, Member } from './types'
import { Checked, MembershipOwnerTypes, MembershipStartTypes, MembershipTypes } from './types';

export function getName(member: Member): string {
    const parts: string[] = []
    if (member.anrede && member.anrede !== '--') {
        parts.push(member.anrede)
    }
    if (member.title) {
        parts.push(member.title)
    }
    if (member.firstName) {
        parts.push(member.firstName)
    }
    if (member.lastName) {
        parts.push(member.lastName)
    }
    return parts.join(' ')
}

export function getStreet(member: Member): string {
    return member.street + ' ' + member.streetNumber
}

export function getCity(member: Member): string {
    return member.zipCode + ' ' + member.city
}

export function getSections(application: Application): string {
    const sections: string[] = []
    if (application.sections.football === Checked.YES) {
        sections.push('Fußball')
    }
    if (application.sections.bowling === Checked.YES) {
        sections.push('Kegeln')
    }
    if (application.sections.fitness === Checked.YES) {
        sections.push('Fitness & Freizeit')
    }
    if (application.sections.theatre === Checked.YES) {
        sections.push('Theater')
    }
    return sections.join(', ')
}

export function getIsStudent(member: Member): string {
    if (member.isStudent) {
        return 'Ja'
    }
    return 'Nein'
}

export function getMembershipType(application: Application): string {
    if (application.membership_type === MembershipTypes.FAMILY) {
        return 'Familienmitgliedschaft'
    }
    return 'Einzelmitgliedschaft'
}

export function getMembershipOwner(application: Application): string {
    if (application.membership_owner === MembershipOwnerTypes.SELF) {
        return 'Antragsteller'
    }
    return 'Andere Person'
}

export function getMemberTitle(index: number): string {
    if (index === 0) {
        return 'Antragsteller'
    }
    return 'Mitglied ' + (index + 1)
}

export function getMembershipStart(application: Application): string {
    if (
        application.membership_start === MembershipStartTypes.FROM
    ) {
        let date = application.membership_start_date
        if (!date) {
            date = new Date();
        }
        const day = String(date.getDate()).padStart(2, '0')
        const month = String(date.getMonth() + 1).padStart(2, '0') // Month is zero-based
        const year = date.getFullYear()

        return `${day}.${month}.${year}`
    }
    return 'Nächstmöglicher Zeitpunkt'
}

export function toString(application: Application): string {
    const formattingOffset = 5;
    
    const contents: [string?, string?][] = [];
    // general data
    contents.push(["Mitgliedschaft für", getMembershipOwner(application)])
    contents.push(["Start der Mitgliedschaft", getMembershipStart(application)])
    contents.push(["Mitgliedschaftstyp", getMembershipType(application)])
    contents.push(["Abteilungen", getSections(application)])
    contents.push(["Mitgliederdaten"])

    contents.push([])

    // member data
    application.members?.forEach((member, index) => {
        contents.push([getMemberTitle(index)])
        contents.push(["Name", getName(member)])
        contents.push(["Geburtsdatum", member.dateOfBirth])
        contents.push(["Adresse", `${getStreet(member)}, ${getCity(member)}`])

        if (member.phoneNumber) {
            contents.push(["Telefonnummer", member.phoneNumber])
        }
        if (member.email) {
            contents.push(["eMail", member.email])
        }
        contents.push(["Schüler/Student", getIsStudent(member)])
        contents.push([])
    })

    // bankdata
    contents.push(["Bankdaten"])
    contents.push(["IBAN", application.iban])
    contents.push(["BIC", application.bic])
    contents.push(["Kreditinstitut", application.bankName])
    contents.push(["Kontoinhaber", application.bankAccountOwner])

    // find longest title
    let longestTitle = 0;
    contents.forEach((content) => {
        const key = content[0];
        if (key) {
            const keyLength = key.length;
            if (keyLength > longestTitle) {
                longestTitle = keyLength;
            }
        }
    })

    const lines: string[] = [];
    contents.forEach((content) => {
        const key = content[0];
        const value = content[1];
        if (key) {
            if (value) {
                const spacesToAppend = (longestTitle + formattingOffset) - key.length;
                const paddedKey = (key + ":").padEnd(key.length + spacesToAppend, " ");
                lines.push(paddedKey + value);
            } else {
                lines.push(key);
            }
        } else {
            lines.push("");
        }
    });

    return lines.join("\n");
}