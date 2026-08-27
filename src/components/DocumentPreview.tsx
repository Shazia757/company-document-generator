import { DocumentTemplate } from "@/types/document";
import { company } from "@/lib/company";

type DocumentPreviewProps = {
    template?: DocumentTemplate;
    formData: Record<string, string>;
};

function getSignatoryName(value?: string) {
    const signatory = company.authorizedSignatories.find(
        (item) => item.id === value
    );

    return signatory?.name || "Authorized Signatory";
}

function formatDate(value?: string) {
    if (!value) return "";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
}

export default function DocumentPreview({
    template,
    formData,
}: DocumentPreviewProps) {
    if (!template) {
        return (
            <div className="flex min-h-[700px] w-[520px] items-center justify-center rounded-sm border border-dashed border-gray-300 bg-white shadow-sm">
                <p className="text-sm text-gray-400">
                    Select a document type to preview it.
                </p>
            </div>
        );
    }

    return (
        <article className="min-h-[842px] w-[595px] shrink-0 bg-white px-[68px] py-[58px] text-gray-900 shadow-xl">

            {/* Company Header */}
            <header
                className="border-b border-gray-300 pb-6"
                style={{
                    borderBottomColor: company.primaryColor,
                }}
            >
                <div className="flex items-start justify-between">

                    {/* Logo */}
                    <div>
                        <div className="flex h-16 w-32 items-center justify-start">
                            <img
                                src={company.logo}
                                alt={`${company.name} logo`}
                                className="max-h-16 max-w-32 object-contain"
                            />
                        </div>
                    </div>

                    {/* Company Information */}
                    <div className="text-right">
                        <h2
                            className="text-base font-bold tracking-wide"
                            style={{
                                color: company.primaryColor,
                            }}
                        >
                            {company.name}
                        </h2>

                        <p className="mt-1 text-[9px] leading-4 text-gray-500">
                            {company.address}
                            <br />
                            {company.phone}
                            <br />
                            {company.email}
                            <br />
                            {company.website}
                        </p>
                    </div>
                </div>
            </header>

            {/* Document Meta */}
            <div className="mt-7 flex justify-between text-[10px] text-gray-600">
                <div>
                    {formData.date && (
                        <p>
                            <span className="font-semibold text-gray-800">
                                Date:
                            </span>{" "}
                            {formatDate(formData.date)}
                        </p>
                    )}

                    {formData.certificateDate && (
                        <p>
                            <span className="font-semibold text-gray-800">
                                Date:
                            </span>{" "}
                            {formatDate(formData.certificateDate)}
                        </p>
                    )}
                </div>

                {formData.referenceNumber && (
                    <p>
                        <span className="font-semibold text-gray-800">
                            Ref:
                        </span>{" "}
                        {formData.referenceNumber}
                    </p>
                )}
            </div>

            {/* Title */}
            <div className="mt-10 text-center">
                <h1
                    className="text-lg font-bold uppercase tracking-wider"
                    style={{
                        color: company.primaryColor,
                    }}
                >
                    {template.name}
                </h1>

                <div
                    className="mx-auto mt-3 h-px w-12"
                    style={{
                        backgroundColor: company.primaryColor,
                    }}
                />
            </div>

            {/* Recipient */}
            {template.id === "formal-letter" &&
                (formData.recipientName ||
                    formData.recipientTitle ||
                    formData.recipientOrganization) && (
                    <div className="mt-10 text-sm leading-6">
                        {formData.recipientName && (
                            <p className="font-semibold">
                                {formData.recipientName}
                            </p>
                        )}

                        {formData.recipientTitle && (
                            <p>{formData.recipientTitle}</p>
                        )}

                        {formData.recipientOrganization && (
                            <p>{formData.recipientOrganization}</p>
                        )}
                    </div>
                )}

            {/* Document Body */}
            <div className="mt-10 text-justify text-[11px] leading-7 text-gray-800">

                {/* Experience Certificate */}
                {template.id === "experience-certificate" && (
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
                                {formatDate(formData.joiningDate) ||
                                    "[Joining Date]"}
                            </strong>{" "}
                            and worked with us until{" "}
                            <strong>
                                {formatDate(formData.lastWorkingDate) ||
                                    "[Last Working Date]"}
                            </strong>
                            .
                        </p>

                        <p className="mt-6">
                            During the period of employment, the employee
                            performed the assigned responsibilities and duties
                            to the satisfaction of the organization.
                        </p>
                    </>
                )}

                {/* Internship Certificate */}
                {template.id === "internship-certificate" && (
                    <>
                        <p>
                            This is to certify that{" "}
                            <strong>
                                {formData.internName || "[Intern Name]"}
                            </strong>{" "}
                            successfully completed an internship as{" "}
                            <strong>
                                {formData.internshipRole ||
                                    "[Internship Role]"}
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
                                {formatDate(formData.startDate) ||
                                    "[Start Date]"}
                            </strong>{" "}
                            to{" "}
                            <strong>
                                {formatDate(formData.endDate) ||
                                    "[End Date]"}
                            </strong>
                            .
                        </p>

                        {formData.institution && (
                            <p className="mt-6">
                                This internship was undertaken as part of the
                                academic requirements of{" "}
                                <strong>{formData.institution}</strong>.
                            </p>
                        )}
                    </>
                )}

                {/* NOC */}
                {template.id === "noc" && (
                    <>
                        <p>
                            This is to certify that{" "}
                            <strong>
                                {formData.employeeName || "[Employee Name]"}
                            </strong>
                            {formData.designation && (
                                <>
                                    , working as{" "}
                                    <strong>{formData.designation}</strong>
                                </>
                            )}
                            , has no objection from the organization regarding
                            the following purpose:
                        </p>

                        <p className="mt-8 text-center font-semibold">
                            {formData.purpose || "[Purpose]"}
                        </p>

                        {formData.body && (
                            <p className="mt-8 whitespace-pre-wrap">
                                {formData.body}
                            </p>
                        )}
                    </>
                )}

                {/* Formal Letter */}
                {template.id === "formal-letter" && (
                    <>
                        <p>
                            {formData.salutation || "Dear Sir/Madam"},
                        </p>

                        {formData.subject && (
                            <p className="mt-7 font-semibold">
                                Subject: {formData.subject}
                            </p>
                        )}

                        <p className="mt-7 whitespace-pre-wrap">
                            {formData.body || "[Letter content]"}
                        </p>

                        <p className="mt-8">
                            Yours faithfully,
                        </p>
                    </>
                )}

                {/* Offer Letter */}
                {template.id === "offer-letter" && (
                    <>
                        <p>
                            Dear{" "}
                            <strong>
                                {formData.candidateName || "[Candidate Name]"}
                            </strong>
                            ,
                        </p>

                        <p className="mt-7">
                            We are pleased to offer you the position of{" "}
                            <strong>
                                {formData.designation || "[Designation]"}
                            </strong>
                            {formData.department && (
                                <>
                                    {" "}
                                    in the{" "}
                                    <strong>{formData.department}</strong>{" "}
                                    department
                                </>
                            )}
                            .
                        </p>

                        <p className="mt-6">
                            Your expected joining date is{" "}
                            <strong>
                                {formatDate(formData.joiningDate) ||
                                    "[Joining Date]"}
                            </strong>
                            . The position is offered on a{" "}
                            <strong>
                                {formData.employmentType ||
                                    "[Employment Type]"}
                            </strong>{" "}
                            basis
                            {formData.workLocation && (
                                <>
                                    {" "}
                                    at{" "}
                                    <strong>{formData.workLocation}</strong>
                                </>
                            )}
                            .
                        </p>

                        <p className="mt-6">
                            Your compensation will be{" "}
                            <strong>
                                {formData.salary || "[Salary]"}
                            </strong>{" "}
                            paid on a{" "}
                            <strong>
                                {formData.salaryFrequency || "[Frequency]"}
                            </strong>{" "}
                            basis, subject to the terms and conditions of
                            employment.
                        </p>

                        <p className="mt-6">
                            We look forward to welcoming you to our
                            organization.
                        </p>

                        <p className="mt-8">
                            Yours sincerely,
                        </p>
                    </>
                )}

                {/* Invoice */}
                {template.id === "invoice" && (
                    <>
                        <div className="flex justify-between gap-8">

                            <div>
                                <p className="text-[9px] font-semibold uppercase tracking-wide text-gray-400">
                                    Bill To
                                </p>

                                <p className="mt-2 font-semibold">
                                    {formData.customerName ||
                                        "[Customer Name]"}
                                </p>

                                {formData.customerAddress && (
                                    <p className="mt-1 whitespace-pre-wrap text-[10px] text-gray-600">
                                        {formData.customerAddress}
                                    </p>
                                )}
                            </div>

                            <div className="text-right text-[10px]">
                                <p>
                                    <span className="font-semibold">
                                        Invoice No:
                                    </span>{" "}
                                    {formData.invoiceNumber ||
                                        "[Invoice Number]"}
                                </p>

                                <p className="mt-1">
                                    <span className="font-semibold">
                                        Date:
                                    </span>{" "}
                                    {formatDate(formData.invoiceDate) ||
                                        "[Invoice Date]"}
                                </p>

                                {formData.dueDate && (
                                    <p className="mt-1">
                                        <span className="font-semibold">
                                            Due Date:
                                        </span>{" "}
                                        {formatDate(formData.dueDate)}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="mt-10">
                            <table className="w-full border-collapse text-[9px]">
                                <thead>
                                    <tr className="border-b border-gray-300">
                                        <th className="py-2 text-left font-semibold">
                                            Description
                                        </th>

                                        <th className="w-12 py-2 text-center font-semibold">
                                            Qty
                                        </th>

                                        <th className="w-20 py-2 text-right font-semibold">
                                            Rate
                                        </th>

                                        <th className="w-20 py-2 text-right font-semibold">
                                            Amount
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {(() => {
                                        const items = formData.items
                                            ? JSON.parse(formData.items)
                                            : [];

                                        return items.map(
                                            (
                                                item: {
                                                    description?: string;
                                                    quantity?: string;
                                                    rate?: string;
                                                },
                                                index: number
                                            ) => {
                                                const quantity =
                                                    Number(item.quantity) || 0;

                                                const rate =
                                                    Number(item.rate) || 0;

                                                const amount =
                                                    quantity * rate;

                                                return (
                                                    <tr
                                                        key={index}
                                                        className="border-b border-gray-200"
                                                    >
                                                        <td className="py-2">
                                                            {item.description ||
                                                                "-"}
                                                        </td>

                                                        <td className="py-2 text-center">
                                                            {quantity}
                                                        </td>

                                                        <td className="py-2 text-right">
                                                            {rate.toFixed(2)}
                                                        </td>

                                                        <td className="py-2 text-right">
                                                            {amount.toFixed(2)}
                                                        </td>
                                                    </tr>
                                                );
                                            }
                                        );
                                    })()}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-6 ml-auto w-48 text-[10px]">
                            {(() => {
                                const items = formData.items
                                    ? JSON.parse(formData.items)
                                    : [];

                                const subtotal = items.reduce(
                                    (
                                        total: number,
                                        item: {
                                            quantity?: string;
                                            rate?: string;
                                        }
                                    ) =>
                                        total +
                                        (Number(item.quantity) || 0) *
                                        (Number(item.rate) || 0),
                                    0
                                );

                                const taxRate =
                                    Number(formData.tax) || 0;

                                const taxAmount =
                                    subtotal * (taxRate / 100);

                                const total =
                                    subtotal + taxAmount;

                                return (
                                    <>
                                        <div className="flex justify-between py-1">
                                            <span>Subtotal</span>
                                            <span>
                                                {subtotal.toFixed(2)}
                                            </span>
                                        </div>

                                        <div className="flex justify-between py-1">
                                            <span>
                                                Tax ({taxRate}%)
                                            </span>

                                            <span>
                                                {taxAmount.toFixed(2)}
                                            </span>
                                        </div>

                                        <div className="mt-2 flex justify-between border-t border-gray-300 pt-2 text-sm font-bold">
                                            <span>Total</span>

                                            <span>
                                                {total.toFixed(2)}
                                            </span>
                                        </div>
                                    </>
                                );
                            })()}
                        </div>

                        {formData.paymentTerms && (
                            <div className="mt-10">
                                <p className="font-semibold">
                                    Payment Terms
                                </p>

                                <p className="mt-2 whitespace-pre-wrap text-[10px] text-gray-600">
                                    {formData.paymentTerms}
                                </p>
                            </div>
                        )}

                        {formData.notes && (
                            <div className="mt-6">
                                <p className="font-semibold">
                                    Notes
                                </p>

                                <p className="mt-2 whitespace-pre-wrap text-[10px] text-gray-600">
                                    {formData.notes}
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Signature */}
            <footer className="mt-20">
                <div className="mb-10 h-10 w-36 border-b border-gray-400" />

                <p className="text-[11px] font-semibold">
                    {getSignatoryName(formData.signatory)}
                </p>

                <p className="mt-1 text-[9px] text-gray-500">
                    Authorized Signatory
                </p>

                <p className="mt-3 text-[9px] text-gray-500">
                    {company.name}
                </p>
            </footer>
        </article>
    );
}