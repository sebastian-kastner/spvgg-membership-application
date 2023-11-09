import type { Member } from "../types";

export const FAMILY_MEMBERSHIP_WITH_CHILDREN_FEE = 105;
export const FAMILIY_MEMBERSHIP_WITHOUT_CHILDREN_FEE = 80;
export const INDIVIDUAL_STUDENT_FEE = 40;
export const INDIVIDUAL_ADULT_FEE = 80;

export const STUDENT_SECTION_FEE = 0;

export const SECTION_FEES = {
    football: 55,
    bowling: 55,
    theatre: 25,
    fitness: 0
}

export function calculateMembershipFee(member: Member): number {
    return 0;
}