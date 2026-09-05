import { DocumentTemplate } from "@/types/document";
import { company } from "@/lib/company";
import InvoicePreview from "@/components/InvoicePreview";

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

type InvoiceItem = {
    description?: string;
    quantity?: string;
    rate?: string;
};

function parseInvoiceItems(value?: string): InvoiceItem[] {
    if (!value) {
        return [];
    }

    try {
        const parsed = JSON.parse(value);

        if (Array.isArray(parsed)) {
            return parsed;
        }
    } catch {
        // Ignore invalid JSON.
    }

    return [];
}

function getInvoiceAmount(item: InvoiceItem) {
    const quantity = Number(item.quantity) || 0;
    const rate = Number(item.rate) || 0;

    return quantity * rate;
}

function getInvoiceRowHeight(item: InvoiceItem) {
    const descriptionLength = item.description?.length || 0;

    // Approximate wrapping inside the preview's description column.
    const lines = Math.max(1, Math.ceil(descriptionLength / 55));

    return Math.max(32, lines * 16 + 16);
}

function splitInvoiceItems(
    items: InvoiceItem[],
    firstPageHeight: number,
    otherPageHeight: number
) {
    const pages: InvoiceItem[][] = [];

    let currentPage: InvoiceItem[] = [];
    let currentHeight = 0;
    let availableHeight = firstPageHeight;

    for (const item of items) {
        const rowHeight = getInvoiceRowHeight(item);

        if (
            currentPage.length > 0 &&
            currentHeight + rowHeight > availableHeight
        ) {
            pages.push(currentPage);

            currentPage = [];
            currentHeight = 0;
            availableHeight = otherPageHeight;
        }

        currentPage.push(item);
        currentHeight += rowHeight;
    }

    if (currentPage.length > 0) {
        pages.push(currentPage);
    }

    return pages;
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

    if (template.id === "invoice") {
        return (
            <InvoicePreview
                formData={formData}
                formatDate={formatDate}
                getSignatoryName={getSignatoryName}
            />
        );
    }



    const invoiceItems =
        template.id === "invoice"
            ? parseInvoiceItems(formData.items)
            : [];

    const invoicePages =
        template.id === "invoice"
            ? splitInvoiceItems(
                invoiceItems,
                300,
                560
            )
            : [];

    const subtotal = invoiceItems.reduce(
        (total, item) => total + getInvoiceAmount(item),
        0
    );

    const taxRate = Number(formData.tax) || 0;
    const taxAmount = subtotal * (taxRate / 100);
    const total = subtotal + taxAmount;

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