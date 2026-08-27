export type CompanySignatory = {
    id: string;
    name: string;
    designation: string;
};

export type CompanyConfig = {
    name: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    logo: string;
    primaryColor: string;
    authorizedSignatories: CompanySignatory[];
};

export const company: CompanyConfig = {
    name: "Devoc",

    address: "Company Address, City, State, Country",

    phone: "+91 00000 00000",

    email: "devocofficial@gmail.com",

    website: "www.devoc.bvocfarookcollege.com",

    logo: "/company-logo.png",

    primaryColor: "#111827",

    authorizedSignatories: [
        {
            id: "managing-director",
            name: "Managing Director",
            designation: "Managing Director",
        },
        {
            id: "hr-manager",
            name: "HR Manager",
            designation: "HR Manager",
        },
    ],
};