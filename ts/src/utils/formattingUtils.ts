import type { Application, Member, Sections } from '../types'
import { Checked, MemberType, MembershipStartTypes } from '../types';
import { ApplicationType, MembershipSummarizer } from './summaryUtils';
import { Buffer } from 'buffer'

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

export function getMemberTitle(member: Member, memberIndex: number): string {
    if (member.memberType === MemberType.CREATOR || member.memberType === MemberType.CREATOR_WITHOUT_MEMBERSHIP) {
        return 'Antragsteller'
    } else if (member.memberType === MemberType.SPOUSE) {
        return '(Ehe-)Partner'
    }
    return 'Kind ' + (memberIndex + 1);
}

export function getStreet(member: Member): string {
    return member.street + ' ' + member.streetNumber
}

export function getCity(member: Member): string {
    return member.zipCode + ' ' + member.city
}

export function getSections(sections: Sections): string {
    const sectionsOut: string[] = []
    if (sections.football === Checked.YES) {
        sectionsOut.push('Fußball')
    }
    if (sections.bowling === Checked.YES) {
        sectionsOut.push('Kegeln')
    }
    if (sections.fitness === Checked.YES) {
        sectionsOut.push('Fitness & Freizeit')
    }
    if (sections.theatre === Checked.YES) {
        sectionsOut.push('Theater')
    }
    return sectionsOut.join(', ')
}

export function getIsStudent(member: Member): string {
    if (member.isStudent) {
        return 'Ja'
    }
    return 'Nein'
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

function checkedToString(checked: Checked | undefined): string {
    if (checked) {
        return checked.toString();
    }
    return " ";
}

function formatTuples(contents: [string?, string?][], formattingOffset = 5): string {
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

export function formatApplication(application: Application): string {
    const contents: [string?, string?][] = [];
    // general data
    contents.push(["Start der Mitgliedschaft", getMembershipStart(application)])
    // contents.push(["Mitgliedschaftstyp", getMembershipType(application.membership_type)])
    contents.push([])
    contents.push([])
    contents.push(["Mitgliederdaten"])

    contents.push([])

    // summary for creator
    contents.push(["Antragsteller"]);
    contents.push(["Name", getName(application.members.creator)])
    contents.push(["Geburtsdatum", application.members.creator.dateOfBirth])
    if (application.members.creator.street && application.members.creator.streetNumber) {
        contents.push(["Adresse", `${getStreet(application.members.creator)}, ${getCity(application.members.creator)}`])
    }
    if (application.members.creator.phoneNumber) {
        contents.push(["Telefonnummer", application.members.creator.phoneNumber])
    }
    if (application.members.creator.email) {
        contents.push(["eMail", application.members.creator.email])
    }
    contents.push(["Schüler/Student", getIsStudent(application.members.creator)])
    if (application.members.creator.memberType === MemberType.CREATOR_WITHOUT_MEMBERSHIP) {
        contents.push(["Mitgliedschaft für Antragssteller", "NEIN"]);
    } else {
        contents.push(["Mitgliedschaft für Antragssteller", "JA"]);
        contents.push(["Abteilungen", getSections(application.members.creator.sections)])
    }
    contents.push([])

    // summary for spouse
    if (application.members.spouse) {
        contents.push(["(Ehe)partner"]);
        contents.push(["Name", getName(application.members.spouse)])
        contents.push(["Geburtsdatum", application.members.spouse.dateOfBirth])
        contents.push(["Schüler/Student", getIsStudent(application.members.spouse)])
        contents.push(["Abteilungen", getSections(application.members.spouse.sections)])
        contents.push([])
    }

    // summary for children
    application.members.children.forEach((child) => {
        contents.push(["(Ehe)partner"]);
        contents.push(["Name", getName(child)])
        contents.push(["Geburtsdatum", child.dateOfBirth])
        contents.push(["Abteilungen", getSections(child.sections)])
        contents.push([])
    })

    // bankdata
    contents.push(["Bankdaten"])
    contents.push(["IBAN", application.iban])
    contents.push(["BIC", application.bic])
    contents.push(["Kreditinstitut", application.bankName])
    contents.push(["Kontoinhaber", application.bankAccountOwner])
    contents.push([])
    contents.push(["Zustimmung SEPA Verfahren", checkedToString(application.sepaAgreement)]);
    contents.push(["Zustimming Datenschutzerklärung", checkedToString(application.dataProtectionAgreement)]);
    contents.push(["Zustimming Veröffentlichungen", checkedToString(application.publicationAgreement)]);

    return formatTuples(contents);
}

export function formatSummary(application: Application): string {
    const summary = new MembershipSummarizer(application).summarize();
    let membershipForCreator = "Ja";
    if (application.members.creator.memberType === MemberType.CREATOR_WITHOUT_MEMBERSHIP) {
        membershipForCreator = "Nein";
    }

    const applicationType = applicationTypeToText(summary.applicationType);

    const contents: [string?, string?][] = [];
    contents.push(["Voraussichtlicher Jahresbeitrag", summary.membershipFee ? summary.membershipFee + "€" : "--"]);
    contents.push(["Antragsteller wird selbst Mitglied", membershipForCreator]);
    contents.push(["Anzahl Kinder", summary.numberOfChildren.toString()]);
    contents.push(["Antragstyp", applicationType]);

    return formatTuples(contents);
}

function applicationTypeToText(applicationType?: ApplicationType | null): string {
    if (applicationType === ApplicationType.CHILDREN_ONLY) {
        return "Mitgliedschaft für Kinder";
    } else if (applicationType === ApplicationType.COUPLE_WITHOUT_CHILDREN) {
        return "(Ehe)paar ohne Kinder";
    } else if (applicationType === ApplicationType.COUPLE_WITH_CHILDREN) {
        return "(Ehe)paar mit Kindern";
    } else if (applicationType === ApplicationType.PARENT_WITH_KIDS) {
        return "Elternteil mit Kindern";
    } else if (applicationType === ApplicationType.INDIVIDUAL) {
        return "Einzelmitgliedschaft";
    }
    return 'Unbekannt';
}

export function base64Encode(str: string): string {
    const charset = document.characterSet;
    return Buffer.from(str, charset).toString('base64');
}

export function getAllMembers(application: Application) {
    const members: Member[] = [];
    members.push(application.members.creator);
    if (application.members.spouse) {
        members.push(application.members.spouse);
    }
    members.push(...application.members.children);
    return members;
}