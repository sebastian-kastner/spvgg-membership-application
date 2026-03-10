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
    applicationType?: ApplicationType | null,
}

export enum ApplicationType {
    INDIVIDUAL,
    COUPLE_WITH_CHILDREN,
    COUPLE_WITHOUT_CHILDREN,
    PARENT_WITH_KIDS,
    CHILDREN_ONLY,
}

export const SECTION_FEES = {
    football: 65,
    bowling: 65,
    theatre: 25,
    fitness: 0
}

export class MembershipSummarizer {
    private application: Application;

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
            console.warn('Invalid application: Membership applications must have a creator');
            return {
                membershipFee: null,
                numberOfChildren: this.application.members.children.length,
                hasSpouse: hasSpouse,
                isChildOnlyMembership: this.isChildOnlyMembership,
            }
        }

        this.isChildOnlyMembership = this.application.members.creator.memberType === MemberType.CREATOR_WITHOUT_MEMBERSHIP;

        const feesAndType = this.getFeesAndType();

        return {
            membershipFee: feesAndType.fees,
            numberOfChildren: this.application.members.children.length,
            hasSpouse: hasSpouse,
            applicationType: feesAndType.type,
            isChildOnlyMembership: this.isChildOnlyMembership,
        }
    }

    private getFeesAndType(): { fees: number | null, type: ApplicationType | null } {
        const invalidReturn = {
            fees: null,
            type: null,
        }
        
        const creator = this.application.members.creator;

        if (!this.isAdult(creator)) {
            console.warn('Invalid application: Creator must be an adult!');
            return invalidReturn;
        }

        const spouse = this.application.members.spouse;
        const children = this.application.members.children;

        const adults: Member[] = [];

        // add creator to list of members for the application, unless no membership for creator was requested
        if (creator.memberType !== MemberType.CREATOR_WITHOUT_MEMBERSHIP) {
            adults.push(creator);
            // if creator wants to be a member and a spouse is set: check age and add to members
            if (spouse !== null && spouse !== undefined) {
                if (!this.isAdult(spouse)) {
                    console.warn('Invalid application: Spouse must be an adult!');
                    return invalidReturn;
                }
                adults.push(spouse);
            }
        }

        // check that all children are minors
        for (let i = 0; i < children.length; i++) {
            if (this.isAdult(children[i])) {
                console.warn('Invalid application: Children must be minors!');
                return invalidReturn;
            }
        }

        let applicationType: ApplicationType | null = null;

        // calculate base fee
        let baseFee = 0;

        // children only membership if the creator does not want to be a member himself but only applies for children
        const isChildrenOnlyMembership = (creator.memberType === MemberType.CREATOR_WITHOUT_MEMBERSHIP);
        if (isChildrenOnlyMembership) {
            // base fee is: student fee * number of children
            baseFee = INDIVIDUAL_STUDENT_FEE * children.length;
            applicationType = ApplicationType.CHILDREN_ONLY;
        } else {
            // memberhsip without children
            if (children.length === 0) {
                // without spouse
                if (!spouse) {
                    applicationType = ApplicationType.INDIVIDUAL;
                    if (this.isStudent(creator)) {
                        // base fee for adult students
                        baseFee = INDIVIDUAL_STUDENT_FEE;
                    } else {
                        // base fee for adult non-students
                        baseFee = INDIVIDUAL_ADULT_FEE;
                    }
                }
                // with spouse
                else {
                    baseFee = PARTNER_FEE;
                    applicationType = ApplicationType.COUPLE_WITHOUT_CHILDREN;
                }
            }

            // membership with children
            else {
                // for families, the creator is always considered as adult, even for students!
                if (!spouse) {
                    baseFee = INDIVIDUAL_ADULT_FEE;
                    applicationType = ApplicationType.PARENT_WITH_KIDS;
                } else {
                    baseFee = PARTNER_FEE;
                    applicationType = ApplicationType.COUPLE_WITH_CHILDREN;
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

        const membershipFee = baseFee + sectionFees;
        
        return {
            fees: membershipFee,
            type: applicationType,
        }
    }

    private isAdult(member: Member): boolean | null {
        const parsedDate = parseDate(member.dateOfBirth);
        if (!parsedDate) {
            console.warn("Invalid date given!")
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
}
