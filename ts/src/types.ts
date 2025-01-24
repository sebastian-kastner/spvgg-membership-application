export type AppMode = {
    isEditMode: boolean;
}

export type ValidationIssues = {
    issues: Set<string>;
}

export enum Checked {
    YES = "Ja",
    NO = "Nein"
}

export enum MemberType {
    CREATOR,
    CREATOR_WITHOUT_MEMBERSHIP,
    SPOUSE,
    CHILD,
}

export type Member = {
    title?: string,
    anrede?: string,
    memberType: MemberType,
    firstName?: string,
    lastName?: string,
    sections: Sections,
    dateOfBirth?: string,
    city?: string,
    zipCode?: string,
    street?: string,
    streetNumber?: string,
    phoneNumber?: string,
    email?: string,
    isStudent?: boolean,
}

export enum MembershipStartTypes {
    NOW = 'now',
    FROM = 'from',
}

export type Sections = {
    football: Checked,
    bowling: Checked,
    theatre: Checked,
    fitness: Checked
}

export type ApplicationMembers = {
    creator: Member,
    spouse?: Member | null,
    children: Member[],
}

export type Application = {
    uuid?: string,
    membership_owner?: string,
    membership_start?: string,
    membership_start_date?: Date,

    bic?: string,
    iban?: string,
    bankName?: string,
    bankAccountOwner?: string,

    sepaAgreement?: Checked;
    dataProtectionAgreement?: Checked;
    publicationAgreement?: Checked;

    members: ApplicationMembers;
}
