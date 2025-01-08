import { MembershipTypes, type Application, type Member, type Sections, Checked } from "../types";
import { parseDate } from "./dateUtils";

// export const FAMILY_MEMBERSHIP_WITH_CHILDREN_FEE = 105;
export const FAMILIY_MEMBERSHIP_WITHOUT_CHILDREN_FEE = 85;
export const INDIVIDUAL_STUDENT_FEE = 45;
export const INDIVIDUAL_ADULT_FEE = 55;

export type ApplicationSummary = {
    membershipFee: number | null,
    numberOfAdults: number,
    numberOfMinors: number,
    numberOfStudents: number,
    membershipType: MembershipTypes | null
}

const DEBUG = false;

export const SECTION_FEES = {
    football: 65,
    bowling: 65,
    theatre: 25,
    fitness: 0
}

export class MembershipSummarizer {
    private application: Application;

    private membershipFee: number | null = null;
    private numberOfAdults: number = 0;
    private numberOfMinors: number = 0;
    private numberOfStudents: number = 0;
    private membershipType: MembershipTypes | null = null;

    constructor(application: Application) {
        this.application = application;
    }

    public summarize(): ApplicationSummary {
        if (this.application) {
            if (this.application.membership_type === MembershipTypes.FAMILY) {
                this.membershipType = MembershipTypes.FAMILY;
                this.calculateFamilyFees();
            } else if (this.application.membership_type === MembershipTypes.SINGLE) {
                this.membershipType = MembershipTypes.SINGLE;
                this.calculateSingleFees();
            }
        }
        return {
            membershipFee: this.membershipFee,
            numberOfAdults: this.numberOfAdults,
            numberOfMinors: this.numberOfMinors,
            numberOfStudents: this.numberOfStudents,
            membershipType: this.membershipType
        }
    }

    private calculateFamilyFees(): void {
        if (!this.application.members || this.application.members.length === 0) {
            this.log('Invalid application: Family membership applications must have one or more members');
            this.membershipFee = null;
            return;
        }

        let sectionFees = 0;

        // get number of adults and minors and store section fees for each adult
        for (let i = 0; i < this.application.members.length; i++) {
            const member = this.application.members[i];
            const adult = this.isAdult(member);
            if (adult === null) {
                this.log("Invalid date of birth for member", member.firstName);
                this.membershipFee = null;
                return;
            }

            if (!adult) {
                this.numberOfMinors++;
            }
            else {
                this.numberOfAdults++;
                if (!this.isStudent(member)) {
                    this.log("Adult:", member.firstName)
                    const sectionFee = this.getSectionFee(member.sections);
                    if (sectionFee) {
                        this.log("Adding section fee for adult", member.firstName)
                        sectionFees += sectionFee;
                    }
                } else {
                    this.log("Adult student found, no section fee for", member.firstName)
                }
            }
        }

        // make sure there are no more than two adults
        if (this.numberOfAdults > 2) {
            this.log('There must not be more than two adults in a family membership');
            this.membershipFee = null;
            return;
        }

        if (this.numberOfAdults === 0) {
            //TODO: clarify if family membership without adults is legal
            this.log("No adult found in family membership. Is this legal?")
        }

        // set the base fee based on the number of children
        let baseFee = 0;
        if (this.numberOfMinors > 0) {
            this.log("Family membership with children")
            baseFee = FAMILY_MEMBERSHIP_WITH_CHILDREN_FEE;
        } else {
            this.log("Family membership without children")
            baseFee = FAMILIY_MEMBERSHIP_WITHOUT_CHILDREN_FEE;
        }

        // sum up the section fees + the base fee
        this.membershipFee = baseFee + sectionFees;
    }

    private calculateSingleFees(): void {
        // single membership must have exactly one member
        if (!this.application.members || this.application.members.length === 0) {
            this.log('Invalid application: Single membership applications must have exactly one member');
            this.membershipFee = null;
            return;
        }

        const member = this.application.members[0];
        const adult = this.isAdult(member);
        if (adult === null) {
            this.log("Invalid date of birth for member", member.firstName);
            this.membershipFee = null;
            return;
        }

        // students and minors only pay the student fee and no section fee
        if (this.isStudent(member) || !adult) {
            this.log("Individual student fee")
            this.membershipFee = INDIVIDUAL_STUDENT_FEE;
            this.numberOfStudents = 1;
            return;
        }

        this.log("Individual adult fee + section fee");
        this.membershipFee = INDIVIDUAL_ADULT_FEE + this.getSectionFee(member.sections);
        this.numberOfAdults = 1;
    }

    private isAdult(member: Member): boolean | null {
        const parsedDate = parseDate(member.dateOfBirth);
        if (!parsedDate) {
            this.log("Parsed date invalid and all")
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

    private isStudent(member: Member): boolean {
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
    private getSectionFee(sections: Sections): number {
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

    private log(...args: any[]) {
        if (DEBUG) {
            console.log(...args);
        }
    }
}
