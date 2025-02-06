import { type Application, type Member, type Sections, Checked, MemberType } from "../types";
import { parseDate, isAdult } from "./dateUtils";

export const PARTNER_FEE = 85; // if only creator and spouse apply
export const INDIVIDUAL_STUDENT_FEE = 45; // for students (unless in family membership)
export const INDIVIDUAL_ADULT_FEE = 55; // for adults (unless in family membership)
export const REDUCED_CHILD_FEE = 25; // for the first 2 children in family application with children

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
        this.calculateFees();

        return {
            membershipFee: this.membershipFee,
            numberOfChildren: this.application.members.children.length,
            hasSpouse: hasSpouse,
            isChildOnlyMembership: this.isChildOnlyMembership,
        }
    }

    private calculateFees(): void {
        const creator = this.application.members.creator;

        if (!this.isAdult(creator)) {
            console.warn('Invalid application: Creator must be an adult!');
            this.membershipFee = null;
            return;
        }

        const spouse = this.application.members.spouse;
        const children = this.application.members.children;

        const adults: Member[] = [];
        this.log(creator.memberType);

        // add creator to list of members for the application, unless no membership for creator was requested
        if (creator.memberType !== MemberType.CREATOR_WITHOUT_MEMBERSHIP) {
            adults.push(creator);
            // if creator wants to be a member and a spouse is set: check age and add to members
            if (spouse !== null && spouse !== undefined) {
                if (!this.isAdult(spouse)) {
                    console.warn('Invalid application: Spouse must be an adult!');
                    this.membershipFee = null;
                    return;
                }
                adults.push(spouse);
            }
        }

        // check that all children are minors
        for (let i = 0; i < children.length; i++) {
            if (this.isAdult(children[i])) {
                console.warn('Invalid application: Children must be minors!');
                this.membershipFee = null;
                return;
            }
        }

        // calculate base fee
        let baseFee = 0;

        // children only membership if the creator does not want to be a member himself but only applies for children
        const isChildrenOnlyMembership = (creator.memberType === MemberType.CREATOR_WITHOUT_MEMBERSHIP);
        if (isChildrenOnlyMembership) {
            // base fee is: student fee * number of children
            baseFee = INDIVIDUAL_STUDENT_FEE * children.length;
            this.log("Children only membership for " + children.length + " children");
        } else {
            // memberhsip without children
            if (children.length === 0) {
                // without spouse
                if (!spouse) {
                    // base fee for the creator is always an adult fee!
                    baseFee = INDIVIDUAL_ADULT_FEE;
                    this.log("Individual membership for adult");
                }
                // with spouse
                else {
                    baseFee = PARTNER_FEE;
                    this.log("Membership for creator and spouse, no children");
                }
            }

            // membership with children
            else {
                // for families, the creator is always considered as adult, even for students!
                if (!spouse) {
                    baseFee = INDIVIDUAL_ADULT_FEE;
                    this.log("Family membership, no spouse, " + children.length + " children");
                } else {
                    baseFee = PARTNER_FEE;
                    this.log("Family membership, with spouse and " + children.length + " children");
                }
                // fee is only required for the first two children of the creator applies for himself with children
                const childrenFee = Math.min(2, children.length) * REDUCED_CHILD_FEE;
                baseFee = baseFee + childrenFee;
            }
        }

        // calculate section fees for adults (unless they are students)
        let sectionFees = 0;
        adults.forEach((adult) => {
            if (!this.isStudent(adult)) {
                const sectionFeesForAdult = this.getSectionFee(adult.sections);
                sectionFees = sectionFees + sectionFeesForAdult;
            }
        });
        this.log("total section fees: " + sectionFees);

        this.membershipFee = baseFee + sectionFees;
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
