import { DocumentTemplate } from "@/types/document";

export const documentTemplates: DocumentTemplate[] = [
    {
        id: "experience-certificate",
        name: "Experience Certificate",
        description: "Certificate for an employee's work experience.",

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
            {
                name: "certificateDate",
                label: "Certificate Date",
                type: "date",
                required: true,
            },
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

    {
        id: "internship-certificate",
        name: "Internship Certificate",
        description: "Certificate for completion of an internship.",

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
            {
                name: "institution",
                label: "Institution",
                type: "text",
                placeholder: "Enter institution",
            },
            {
                name: "certificateDate",
                label: "Certificate Date",
                type: "date",
                required: true,
            },
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

    {
        id: "noc",
        name: "NOC",
        description: "No Objection Certificate.",

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

    {
        id: "formal-letter",
        name: "Formal Letter",
        description: "Create a professional formal letter.",

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
            {
                name: "subject",
                label: "Subject",
                type: "text",
                placeholder: "Enter subject",
            },
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
];