// THIS FILE MUST BE DELETED BEFORE RELEASING TO PRODUCTION!
import { Checked, MembershipStartTypes, MembershipTypes } from './types'
import type { Application } from './types'

export function printIssues(issues: Set<string>): void {
    if (issues.size > 0) {
        console.log('Issues')
        issues.forEach((issue) => {
            console.log(issue)
        })
        console.log("------------");
    }
}

export function createDefaultMembership(): Application {
    return {
        membership_start: MembershipStartTypes.FROM,
        membership_type: MembershipTypes.SINGLE,
        sections: {
            football: Checked.YES,
            bowling: Checked.YES,
            fitness: Checked.NO,
            theatre: Checked.NO,
        },
        members: [
            {
                anrede: "Herr",
                firstName: "Doktor",
                lastName: "Doktormann",
                dateOfBirth: "28.08.2009",
                street: "Invalidenstr",
                streetNumber: "12",
                zipCode: "86391",
                city: "Augsburg",
                phoneNumber: "08210815",
                email: "dr@doktor.dr",
                isStudent: true,
            },
            {
                anrede: "--",
                title: "Dr.",
                firstName: "Klein",
                lastName: "Doktormann",
                dateOfBirth: "28.08.2015",
                street: "Invalidenstr",
                streetNumber: "12",
                zipCode: "86391",
                city: "Augsburg",
                isStudent: true,
            },
        ],
        iban: "doktor-ban",
        bankAccountOwner: "Dr. Doktor Doktormann",
        bankName: "ABK ALLGEMEINE BEAMTEN BANK AG",
        bic: "ABKBDEBB",
        sepaAgreement: Checked.YES,
        dataProtectionAgreement: Checked.YES,
        publicationAgreement: Checked.YES
    }
}