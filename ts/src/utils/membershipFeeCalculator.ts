import type { Member } from "../types";

const FAMILY_MEMBERSHIP_WITH_CHILDREN_FEE = 105;
const FAMILIY_MEMBERSHIP_WITHOUT_CHILDREN_FEE = 80;
const INDIVIDUAL_STUDENT_FEE = 40;
const INDIVIDUAL_ADULT_FEE = 80;

const STUDENT_SECTION_FEE = 0;

const SECTION_FEES = {
    football: 55,
    bowling: 55,
    theatre: 25,
    fitness: 0
}

export function calculateMembershipFee(member: Member): number {
    return 0;
}