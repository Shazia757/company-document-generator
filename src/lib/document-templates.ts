import { DocumentTemplate } from "@/types/document";


export const documentTemplates: DocumentTemplate[] = [
    {
        id: "experience-certificate",
        name: "Experience Certificate",
        description: "Certificate for an employee's work experience.",

        sections: [
            {
                id: "employee-information",
                title: "Employee Information",

                fields: [
                    {
                        name: "employeeName",
                        label: "Employee Name",
                        type: "text",
                        placeholder: "Enter employee name",
                        required: true,
                    },
                    {
                        name: "employeeId",
                        label: "Employee ID",
                        type: "text",
                        placeholder: "Enter employee ID",
                    },
                    {
                        name: "designation",
                        label: "Designation",
                        type: "text",
                        placeholder: "Enter designation",
                        required: true,
                    },
                    {
                        name: "department",
                        label: "Department",
                        type: "text",
                        placeholder: "Enter department",
                        required: true,
                    },
                ],
            },

            {
                id: "employment-period",
                title: "Employment Period",

                fields: [
                    {
                        name: "joiningDate",
                        label: "Joining Date",
                        type: "date",
                        required: true,
                    },
                    {
                        name: "lastWorkingDate",
                        label: "Last Working Date",
                        type: "date",
                        required: true,
                    },
                ],
            },

            {
                id: "certificate-details",
                title: "Certificate Details",

                fields: [
                    {
                        name: "certificateDate",
                        label: "Certificate Date",
                        type: "date",
                        required: true,
                    },
                ],
            },

            {
                id: "authorization",
                title: "Authorization",

                fields: [
                    {
                        name: "signatory",
                        label: "Authorized Signatory",
                        type: "select",
                        required: true,
                        options: [
                            {
                                label: "Managing Director",
                                value: "managing-director",
                            },
                            {
                                label: "HR Manager",
                                value: "hr-manager",
                            },
                        ],
                    },
                ],
            },
        ],
    },

    {
        id: "internship-certificate",
        name: "Internship Certificate",
        description: "Certificate for completion of an internship.",

        sections: [
            {
                id: "intern-information",
                title: "Intern Information",

                fields: [
                    {
                        name: "internName",
                        label: "Intern Name",
                        type: "text",
                        placeholder: "Enter intern name",
                        required: true,
                    },
                    {
                        name: "internshipRole",
                        label: "Internship Role",
                        type: "text",
                        placeholder: "Enter internship role",
                        required: true,
                    },
                    {
                        name: "department",
                        label: "Department",
                        type: "text",
                        placeholder: "Enter department",
                        required: true,
                    },
                    {
                        name: "institution",
                        label: "Institution",
                        type: "text",
                        placeholder: "Enter institution",
                    },
                ],
            },

            {
                id: "internship-period",
                title: "Internship Period",

                fields: [
                    {
                        name: "startDate",
                        label: "Start Date",
                        type: "date",
                        required: true,
                    },
                    {
                        name: "endDate",
                        label: "End Date",
                        type: "date",
                        required: true,
                    },
                ],
            },

            {
                id: "certificate-details",
                title: "Certificate Details",

                fields: [
                    {
                        name: "certificateDate",
                        label: "Certificate Date",
                        type: "date",
                        required: true,
                    },
                ],
            },

            {
                id: "authorization",
                title: "Authorization",

                fields: [
                    {
                        name: "signatory",
                        label: "Authorized Signatory",
                        type: "select",
                        required: true,
                        options: [
                            {
                                label: "Managing Director",
                                value: "managing-director",
                            },
                            {
                                label: "HR Manager",
                                value: "hr-manager",
                            },
                        ],
                    },
                ],
            },
        ],
    },

    {
        id: "noc",
        name: "NOC",
        description: "No Objection Certificate.",

        sections: [
            {
                id: "employee-information",
                title: "Employee Information",

                fields: [
                    {
                        name: "employeeName",
                        label: "Employee Name",
                        type: "text",
                        placeholder: "Enter employee name",
                        required: true,
                    },
                    {
                        name: "designation",
                        label: "Designation",
                        type: "text",
                        placeholder: "Enter designation",
                    },
                    {
                        name: "department",
                        label: "Department",
                        type: "text",
                        placeholder: "Enter department",
                    },
                ],
            },

            {
                id: "noc-details",
                title: "NOC Details",

                fields: [
                    {
                        name: "purpose",
                        label: "Purpose",
                        type: "text",
                        placeholder: "Enter purpose",
                        required: true,
                    },
                    {
                        name: "date",
                        label: "Date",
                        type: "date",
                        required: true,
                    },
                    {
                        name: "referenceNumber",
                        label: "Reference Number",
                        type: "text",
                        placeholder: "Enter reference number",
                    },
                    {
                        name: "body",
                        label: "Additional Content",
                        type: "textarea",
                        placeholder: "Enter additional content",
                    },
                ],
            },

            {
                id: "authorization",
                title: "Authorization",

                fields: [
                    {
                        name: "signatory",
                        label: "Authorized Signatory",
                        type: "select",
                        required: true,
                        options: [
                            {
                                label: "Managing Director",
                                value: "managing-director",
                            },
                            {
                                label: "HR Manager",
                                value: "hr-manager",
                            },
                        ],
                    },
                ],
            },
        ],
    },

    {
        id: "formal-letter",
        name: "Formal Letter",
        description: "Create a professional formal letter.",

        sections: [
            {
                id: "letter-details",
                title: "Letter Details",

                fields: [
                    {
                        name: "date",
                        label: "Date",
                        type: "date",
                        required: true,
                    },
                    {
                        name: "referenceNumber",
                        label: "Reference Number",
                        type: "text",
                        placeholder: "Enter reference number",
                    },
                    {
                        name: "subject",
                        label: "Subject",
                        type: "text",
                        placeholder: "Enter subject",
                    },
                ],
            },

            {
                id: "recipient-information",
                title: "Recipient Information",

                fields: [
                    {
                        name: "recipientName",
                        label: "Recipient Name",
                        type: "text",
                        placeholder: "Enter recipient name",
                        required: true,
                    },
                    {
                        name: "recipientTitle",
                        label: "Recipient Title",
                        type: "text",
                        placeholder: "Enter recipient title",
                    },
                    {
                        name: "recipientOrganization",
                        label: "Recipient Organization",
                        type: "text",
                        placeholder: "Enter organization",
                    },
                ],
            },

            {
                id: "letter-content",
                title: "Letter Content",

                fields: [
                    {
                        name: "salutation",
                        label: "Salutation",
                        type: "text",
                        placeholder: "Dear Sir/Madam",
                    },
                    {
                        name: "body",
                        label: "Body",
                        type: "textarea",
                        placeholder: "Write the letter content...",
                        required: true,
                    },
                ],
            },

            {
                id: "authorization",
                title: "Authorization",

                fields: [
                    {
                        name: "signatory",
                        label: "Authorized Signatory",
                        type: "select",
                        required: true,
                        options: [
                            {
                                label: "Managing Director",
                                value: "managing-director",
                            },
                            {
                                label: "HR Manager",
                                value: "hr-manager",
                            },
                        ],
                    },
                ],
            },
        ],
    },

    {
        id: "offer-letter",
        name: "Offer Letter",
        description: "Generate a professional employee offer letter.",

        sections: [
            {
                id: "candidate-information",
                title: "Candidate Information",

                fields: [
                    {
                        name: "candidateName",
                        label: "Candidate Name",
                        type: "text",
                        placeholder: "Enter candidate name",
                        required: true,
                    },
                    {
                        name: "designation",
                        label: "Designation",
                        type: "text",
                        placeholder: "Enter designation",
                        required: true,
                    },
                    {
                        name: "department",
                        label: "Department",
                        type: "text",
                        placeholder: "Enter department",
                    },
                ],
            },

            {
                id: "employment-details",
                title: "Employment Details",

                fields: [
                    {
                        name: "joiningDate",
                        label: "Joining Date",
                        type: "date",
                        required: true,
                    },
                    {
                        name: "employmentType",
                        label: "Employment Type",
                        type: "select",
                        required: true,
                        options: [
                            {
                                label: "Full Time",
                                value: "full-time",
                            },
                            {
                                label: "Part Time",
                                value: "part-time",
                            },
                            {
                                label: "Contract",
                                value: "contract",
                            },
                        ],
                    },
                    {
                        name: "workLocation",
                        label: "Work Location",
                        type: "text",
                        placeholder: "Enter work location",
                    },
                ],
            },

            {
                id: "compensation",
                title: "Compensation",

                fields: [
                    {
                        name: "salary",
                        label: "Salary",
                        type: "text",
                        placeholder: "Enter salary",
                        required: true,
                    },
                    {
                        name: "salaryFrequency",
                        label: "Salary Frequency",
                        type: "select",
                        required: true,
                        options: [
                            {
                                label: "Monthly",
                                value: "monthly",
                            },
                            {
                                label: "Yearly",
                                value: "yearly",
                            },
                        ],
                    },
                ],
            },

            {
                id: "authorization",
                title: "Authorization",

                fields: [
                    {
                        name: "signatory",
                        label: "Authorized Signatory",
                        type: "select",
                        required: true,
                        options: [
                            {
                                label: "Managing Director",
                                value: "managing-director",
                            },
                            {
                                label: "HR Manager",
                                value: "hr-manager",
                            },
                        ],
                    },
                ],
            },
        ],
    },

    {
        id: "invoice",
        name: "Bill / Invoice",
        description: "Generate a professional customer invoice.",

        sections: [
            {
                id: "invoice-details",
                title: "Invoice Details",

                fields: [
                    {
                        name: "invoiceNumber",
                        label: "Invoice Number",
                        type: "text",
                        placeholder: "e.g. INV-001",
                        required: true,
                    },
                    {
                        name: "invoiceDate",
                        label: "Invoice Date",
                        type: "date",
                        required: true,
                    },
                    {
                        name: "dueDate",
                        label: "Due Date",
                        type: "date",
                    },
                ],
            },

            {
                id: "customer-information",
                title: "Customer Information",

                fields: [
                    {
                        name: "customerName",
                        label: "Customer Name",
                        type: "text",
                        placeholder: "Enter customer name",
                        required: true,
                    },
                    {
                        name: "customerAddress",
                        label: "Customer Address",
                        type: "textarea",
                        placeholder: "Enter customer address",
                    },
                ],
            },

            {
                id: "invoice-items",
                title: "Invoice Items",

                fields: [
                    {
                        name: "items",
                        label: "Items",
                        type: "table",
                        columns: [
                            {
                                name: "description",
                                label: "Description",
                                type: "text",
                                placeholder: "Item description",
                            },
                            {
                                name: "quantity",
                                label: "Qty",
                                type: "number",
                                placeholder: "1",
                            },
                            {
                                name: "rate",
                                label: "Rate",
                                type: "number",
                                placeholder: "0.00",
                            },
                        ],
                    },
                ],
            },

            {
                id: "payment-details",
                title: "Payment Details",

                fields: [
                    {
                        name: "tax",
                        label: "Tax (%)",
                        type: "text",
                        placeholder: "e.g. 18",
                    },
                    {
                        name: "paymentTerms",
                        label: "Payment Terms",
                        type: "textarea",
                        placeholder: "Enter payment terms",
                    },
                    {
                        name: "notes",
                        label: "Notes",
                        type: "textarea",
                        placeholder: "Additional notes",
                    },
                ],
            },

            {
                id: "authorization",
                title: "Authorization",

                fields: [
                    {
                        name: "signatory",
                        label: "Authorized Signatory",
                        type: "select",
                        required: true,

                        options: [
                            {
                                label: "Managing Director",
                                value: "managing-director",
                            },
                            {
                                label: "HR Manager",
                                value: "hr-manager",
                            },
                        ],
                    },
                ],
            },
        ],
    },
];