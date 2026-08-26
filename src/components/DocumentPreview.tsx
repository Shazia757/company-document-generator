import { DocumentTemplate } from "@/types/document";

type DocumentPreviewProps = {
    template?: DocumentTemplate;
    formData: Record<string, string>;
};

function getSignatoryName(value?: string) {
    const signatories: Record<string, string> = {
        "managing-director": "Managing Director",
        "hr-manager": "HR Manager",
    };

    return value ? signatories[value] : "Authorized Signatory";
}

export default function DocumentPreview({
    template,
    formData,
}: DocumentPreviewProps) {
    return (
        <div className="min-h-[800px] w-[600px] bg-white p-16 shadow-lg">
            <div className="text-center">
                <div className="mb-10 text-sm font-medium text-gray-400">
                    COMPANY LOGO
                </div>

                <h1 className="text-xl font-bold uppercase tracking-wide">
                    {template?.name}
                </h1>

                <div className="mt-12 text-left text-sm leading-7 text-gray-700">
                    {template?.id === "experience-certificate" && (
                        <>
                            <p>
                                This is to certify that{" "}
                                <strong>
                                    {formData.employeeName || "[Employee Name]"}
                                </strong>
                                , working as{" "}
                                <strong>
                                    {formData.designation || "[Designation]"}
                                </strong>{" "}
                                in the{" "}
                                <strong>
                                    {formData.department || "[Department]"}
                                </strong>{" "}
                                department, was employed with our organization.
                            </p>

                            <p className="mt-6">
                                The employee joined the organization on{" "}
                                <strong>
                                    {formData.joiningDate || "[Joining Date]"}
                                </strong>{" "}
                                and worked with us until{" "}
                                <strong>
                                    {formData.lastWorkingDate || "[Last Working Date]"}
                                </strong>
                                .
                            </p>
                        </>
                    )}

                    {template?.id === "internship-certificate" && (
                        <>
                            <p>
                                This is to certify that{" "}
                                <strong>
                                    {formData.internName || "[Intern Name]"}
                                </strong>{" "}
                                successfully completed an internship as{" "}
                                <strong>
                                    {formData.internshipRole || "[Internship Role]"}
                                </strong>{" "}
                                in the{" "}
                                <strong>
                                    {formData.department || "[Department]"}
                                </strong>{" "}
                                department.
                            </p>

                            <p className="mt-6">
                                The internship period was from{" "}
                                <strong>
                                    {formData.startDate || "[Start Date]"}
                                </strong>{" "}
                                to{" "}
                                <strong>
                                    {formData.endDate || "[End Date]"}
                                </strong>
                                .
                            </p>
                        </>
                    )}

                    {template?.id === "noc" && (
                        <>
                            <p>
                                This is to certify that{" "}
                                <strong>
                                    {formData.employeeName || "[Employee Name]"}
                                </strong>
                                , working as{" "}
                                <strong>
                                    {formData.designation || "[Designation]"}
                                </strong>
                                , has no objection from the organization regarding the
                                following purpose:
                            </p>

                            <p className="mt-6">
                                <strong>
                                    {formData.purpose || "[Purpose]"}
                                </strong>
                            </p>

                            {formData.body && (
                                <p className="mt-6">{formData.body}</p>
                            )}
                        </>
                    )}

                    {template?.id === "formal-letter" && (
                        <>
                            <p>
                                {formData.salutation || "Dear Sir/Madam"},
                            </p>

                            {formData.subject && (
                                <p className="mt-6 font-semibold">
                                    Subject: {formData.subject}
                                </p>
                            )}

                            <p className="mt-6 whitespace-pre-wrap">
                                {formData.body || "[Letter content]"}
                            </p>

                            <p className="mt-8">Yours faithfully,</p>
                        </>
                    )}
                </div>

                <div className="mt-32 text-left">
                    <p className="text-sm font-medium">
                        {getSignatoryName(formData.signatory)}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                        Company Name
                    </p>
                </div>
            </div>
        </div>
    );
}