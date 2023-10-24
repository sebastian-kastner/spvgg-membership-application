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

export type Member = {
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
    bankAccountOwner?: string;

    sepaAgreement?: Checked;
    dataProtectionAgreement?: Checked;
    publicationAgreement?: Checked;

    members?: Member[];
}
