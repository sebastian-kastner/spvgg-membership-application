export type ValidationIssues = {
    missingRequiredFields: Set<string>;
    validationIssues: Map<string, string>;
}

export enum Checked {
    YES,
    NO
}

export type Person = {
    title?: string,
    anrede?: string,
    firstName?: string,
    lastName?: string,
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

export enum MembershipTypes {
    FAMILY = 'family',
    SINGLE = 'single'
};

export enum MembershipOwnerTypes {
    SELF = 'self',
    OTHER = 'other'
}

export type Application = {
    membership_owner?: string,
    membership_start?: string,
    membership_start_date?: Date,
    membership_type?: string,

    sections: {
        football: Checked,
        bowling: Checked,
        theatre: Checked,
        fitness: Checked
    }

    bic?: string;
    iban?: string;
    bankName?: string;
    accountOwner?: string;

    sepaAgreement?: Checked;
    dataProtectionAgreement?: Checked;
    publicationAgreement?: Checked;

    people?: Person[];
}
