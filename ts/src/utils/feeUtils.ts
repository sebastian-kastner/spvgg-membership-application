import { MembershipTypes, type Application, type Member, type Sections, Checked } from "../types";
import { parseDate } from "./dateUtils";

export const FAMILY_MEMBERSHIP_WITH_CHILDREN_FEE = 105;
export const FAMILIY_MEMBERSHIP_WITHOUT_CHILDREN_FEE = 80;
export const INDIVIDUAL_STUDENT_FEE = 40;
export const INDIVIDUAL_ADULT_FEE = 80;

export const SECTION_FEES = {
    football: 55,
    bowling: 55,
    theatre: 25,
    fitness: 0
}

export function calculateMembershipFee(application: Application): number | null {
    if (!application) {
        return null;
    }
    if (application.membership_type === MembershipTypes.FAMILY) {
        return calculateFamilyFees(application);
    } else if (application.membership_type === MembershipTypes.SINGLE) {
        return calculateSingleFees(application);
    }
    return null;
}

function calculateSingleFees(application: Application): number | null {
    // single membership must have exactly one member
    if (!application.members || application.members.length === 0) {
        console.log('Invalid application: Single membership applications must have exactly one member');
        return null;
    }
    
    const member = application.members[0];
    const adult = isAdult(member);
    if (adult === null) {
        console.log("Invalid date of birth for member", member.firstName);
        return null;
    }
    // students and minors only pay the student fee and no section fee
    if (isStudent(member) || !adult) {
        console.log("Individual student fee")
        return INDIVIDUAL_STUDENT_FEE
    }

    console.log("Individual adult fee + section fee");
    return INDIVIDUAL_ADULT_FEE + getSectionFee(application.sections);
}

function calculateFamilyFees(application: Application): number | null {
    if (!application.members || application.members.length === 0) {
        console.log('Invalid application: Family membership applications must have one or more members');
        return null;
    }

    let adultCount = 0;
    let minorCount = 0;
    let sectionFees = 0;

    // get number of adults and minors and store section fees for each adult
    for (let i = 0; i < application.members.length; i++) {
        const member = application.members[i];
        const adult = isAdult(member);
        if (adult === null) {
            console.log("Invalid date of birth for member", member.firstName);
            return null;
        }

        if (!adult) {
            minorCount++;
        }
        else {
            adultCount++;
            if (!isStudent(member)) {
                console.log("Adult:", member.firstName)
                const sectionFee = getSectionFee(application.sections);
                if (sectionFee) {
                    console.log("Adding section fee for adult", member.firstName)
                    sectionFees += sectionFee;
                }
            } else {
                console.log("Adult student found, no section fee for", member.firstName)
            }
        }
    }

    // make sure there are no more than two adults
    if (adultCount > 2) {
        console.log('There must not be more than two adults in a family membership');
        return null;
    }

    if (adultCount === 0) {
        //TODO: clarify if family membership without adults is legal
        console.log("No adult found in family membership. Is this legal?")
    }

    // set the base fee based on the number of children
    let baseFee = 0;
    if (minorCount > 0) {
        console.log("Family membership with children")
        baseFee = FAMILY_MEMBERSHIP_WITH_CHILDREN_FEE;
    } else {
        console.log("Family membership without children")
        baseFee = FAMILIY_MEMBERSHIP_WITHOUT_CHILDREN_FEE;
    }

    // sum up the section fees + the base fee
    return baseFee + sectionFees;
}

function isAdult(member: Member): boolean | null {
    const parsedDate = parseDate(member.dateOfBirth);
    if (!parsedDate) {
        console.log("Parsed date invalid and all")
        return null;
    }
    // Get the current date
    const birthDate = parsedDate.date;

    // calculate age of member
    const currentDate = new Date();
    let age = currentDate.getFullYear() - birthDate.getFullYear();
    const month = currentDate.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && currentDate.getDate() < birthDate.getDate())) {
        age--;
    }

    // check if member is 18 or older
    return age >= 18
}

function isStudent(member: Member): boolean {
    if (member.isStudent === undefined || member.isStudent === null) {
        return false;
    }
    return member.isStudent
}

/**
 * Calculates the section fee for an application.
 * The most expensive checked section is returned as the section fee.
 * If no section is checked, 0 is returned.
 * @param application 
*/
function getSectionFee(sections: Sections): number {
    const fees: number[] = [];
    if (sections.football === Checked.YES) {
        fees.push(SECTION_FEES.football)
    }
    if (sections.bowling === Checked.YES) {
        fees.push(SECTION_FEES.bowling)
    }
    if (sections.fitness === Checked.YES) {
        fees.push(SECTION_FEES.fitness)
    }
    if (sections.theatre === Checked.YES) {
        fees.push(SECTION_FEES.theatre)
    }

    const maxFee = Math.max(...fees);
    return maxFee > 0 ? maxFee : 0;
}