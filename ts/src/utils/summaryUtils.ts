import { type Application, type Member, type Sections, Checked, MemberType } from "../types";
import { parseDate, isAdult } from "./dateUtils";

export const FAMILIY_MEMBERSHIP_WITHOUT_CHILDREN_FEE = 85;
export const INDIVIDUAL_STUDENT_FEE = 45;
export const INDIVIDUAL_ADULT_FEE = 55;

// TODO: fix summarizer
export type ApplicationSummary = {
    membershipFee: number | null,
    hasSpouse: boolean,
    numberOfChildren: number,
    isChildOnlyMembership: boolean,
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
    private isChildOnlyMembership = false;

    constructor(application: Application) {
        this.application = application;
    }

    public summarize(): ApplicationSummary {
        let hasSpouse = false;
        if (this.application.members.spouse) {
            hasSpouse = true;
        }


        if (this.application.members.creator === null) {
            this.log('Invalid application: Membership applications must have exactly one creator');
            this.membershipFee = null;
            return {
                membershipFee: this.membershipFee,
                numberOfChildren: this.application.members.children.length,
                hasSpouse: hasSpouse,
                isChildOnlyMembership: this.isChildOnlyMembership,
            }
        }

        this.isChildOnlyMembership = this.application.members.creator.memberType === MemberType.CREATOR_WITHOUT_MEMBERSHIP;

        // if (this.application) {
        //     // if (this.application.membership_type === MembershipTypes.FAMILY) {
        //     //     this.membershipType = MembershipTypes.FAMILY;
        //     //     this.calculateFamilyFees();
        //     // } else if (this.application.membership_type === MembershipTypes.SINGLE) {
        //     //     this.membershipType = MembershipTypes.SINGLE;
        //     //     this.calculateSingleFees();
        //     // }
        // }
        return {
            membershipFee: this.membershipFee,
            numberOfChildren: this.application.members.children.length,
            hasSpouse: hasSpouse,
            isChildOnlyMembership: this.isChildOnlyMembership,
        }
    }

    // private categorizeMembers(): { creator: Member | null, spouse: Member | null, children: Member[] } {
    //     let spouse: Member | null = null;
    //     let creator: Member | null = null;
    //     const children: Member[] = [];

    //     this.application.members.forEach(member => {
    //         if (member.memberType === MemberType.SPOUSE) {
    //             spouse = member;
    //         } else if (member.memberType === MemberType.CREATOR) {
    //             creator = member;
    //         } else if (member.memberType === MemberType.CREATOR_WITHOUT_MEMBERSHIP) {
    //             creator = member;
    //         } else if (member.memberType === MemberType.CHILD) {
    //             children.push(member);
    //         } else {
    //             this.log("Invalid member type", member.memberType)
    //         }
    //     });

    //     return {
    //         creator: creator,
    //         spouse: spouse,
    //         children: children,
    //     }
    // }

    private calculateFees(): void {
        if (this.application.members.length === 0) {
            this.log('Invalid application: Membership applications must have at least one member');
            this.membershipFee = null;
            return;
        }

        const creator = this.application.members.find(member => member.memberType === MemberType.CREATOR);
        if (!creator) {
            this.log('Invalid application: Membership applications must have exactly one creator');
            this.membershipFee = null;
            return;
        }

        let spouse: Member | undefined;
        const children: Member[] = [];
        const adults: Member[] = [];

        this.application.members.forEach(member => {
            if (member.memberType === MemberType.SPOUSE) {
                spouse = member;
                adults.push(member);
            } else if (member.memberType === MemberType.CHILD) {
                children.push(member);
            }
        });

        const creatorIsAdult = this.isAdult(creator);

        if (this.isAdult(creator)) {
            adults.push(creator);
        } else if (spouse) {
            // application is invalid if the creator is not an adult but there is a spouse
            this.log('Invalid application: Creator must be an adult if there is a spouse');
            this.membershipFee = null;
            return;
        }

        // if the creator is an adult and there are children: family membership fee (optionally with fee for spouse)

        // if the creator is not an adult 
    }

    private calculateFamilyFees(): void {
        if (this.application.members.length === 0) {
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
        // if (this.numberOfMinors > 0) {
        //     this.log("Family membership with children")
        //     baseFee = FAMILY_MEMBERSHIP_WITH_CHILDREN_FEE;
        // } else {
        //     this.log("Family membership without children")
        //     baseFee = FAMILIY_MEMBERSHIP_WITHOUT_CHILDREN_FEE;
        // }

        // sum up the section fees + the base fee
        this.membershipFee = baseFee + sectionFees;
    }

    private calculateSingleFees(): void {
        // single membership must have exactly one member
        if (this.application.members.length === 0) {
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
        return isAdult(parsedDate.date);
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
