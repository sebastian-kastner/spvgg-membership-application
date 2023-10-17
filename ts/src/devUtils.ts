// THIS FILE MUST BE DELETED BEFORE RELEASING TO PRODUCTION!
import { Checked, MembershipOwnerTypes, MembershipStartTypes, MembershipTypes } from './types'
import type { Application } from './types'

export function printIssues(issues: Set<string>): void {
    if (issues.size > 0) {
        console.log('Issues')
        issues.forEach((issue) => {
            console.log(issue)
        })
    }
    console.log("------------");
}

export function createDefaultMembership(): Application {
    return {
        membership_owner: MembershipOwnerTypes.SELF,
        membership_start: MembershipStartTypes.NOW,
        membership_type: MembershipTypes.SINGLE,
        sections: {
            football: Checked.YES,
            bowling: Checked.NO,
            fitness: Checked.NO,
            theatre: Checked.NO,
        },
        people: [
            {
                anrede: "Herr",
                title: "Dr.",
                firstName: "Doktor",
                lastName: "Doktormann",
                dateOfBirth: "28.08.2009",
                street: "Invalidenstr",
                streetNumber: "12",
                city: "Augsburg",
                phoneNumber: "08210815",
                email: "dr@doktor.dr",
                isStudent: true,
            }
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