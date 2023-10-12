import type { Application, ValidationIssues } from './types'

/*
    membership_owner?: string,
    membership_start?: string,
    membership_start_date?: Date,
    membership_type?: string,

    sections: {
        football: false,
        bowling: false,
        theatre: false,
        fitness: false
    }

    bic?: string;
    iban?: string;
    bankName?: string;
    accountOwner?: string;

    sepaAgreement?: boolean;
    dataProtectionAgreement?: boolean;
    publicationAgreement?: boolean;

    people?: Person[];
*/

const requiredFields = [
    "membership_owner",
    "membership_start_date",
    "membership_type"
];

const requiredTrueFields = [
    "sepaAgreement",
    "dataProtectionAgreement",
    "publicationAgreement"
];

export function validateApplication(application: Application): ValidationIssues {
    return {
        missingRequiredFields: checkRequiredFields(application),
        validationIssues: new Map<string, string>(),
    };
}

function checkRequiredFields(application: Application): Set<string> {
    const missingRequiredFields: Set<string> = new Set();

    const anyApplication = application as any;

    // validate required fields
    requiredFields.forEach((fieldName => {
        if (anyApplication[fieldName] === undefined) {
            missingRequiredFields.add(fieldName);
        }
    }));

    // check fields that need to be set to true
    requiredTrueFields.forEach(fieldName => {
        if (anyApplication[fieldName] !== true) {
            missingRequiredFields.add(fieldName);
        }
    });

    // check that there is at least one section
    const sections = application.sections;
    if (!sections.bowling && !sections.fitness && !sections.football && !sections.theatre) {
        missingRequiredFields.add("sections");
    }

    return missingRequiredFields;
}

// function checkRequiredPersonFields(): 

// function checkFieldValues(application: Application): Map<string, string> {
//     const validationIssues: Map<string, string> = new Map();
//     return validationIssues;
// }

