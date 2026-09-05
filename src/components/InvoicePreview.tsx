import { company } from "@/lib/company";

type InvoiceItem = {
    description?: string;
    quantity?: string;
    rate?: string;
};

type InvoicePreviewProps = {
    formData: Record<string, string>;
    formatDate: (value?: string) => string;
    getSignatoryName: (value?: string) => string;
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
function normalizeMultilineText(value?: string) {
    return value
        ?.trim()
        .replace(/\n{2,}/g, "\n");
}

function getInvoiceRowHeight(item: InvoiceItem) {
    const descriptionLength = item.description?.length || 0;

    // Approximate wrapping inside the description column.
    const lines = Math.max(
        1,
        Math.ceil(descriptionLength / 55)
    );

    return Math.max(32, lines * 16 + 16);
}

function splitInvoiceItems(items: InvoiceItem[]) {
    const pages: InvoiceItem[][] = [];

    /*
     * Approximate usable heights inside an A4 preview page.
     *
     * Page height: 842px
     * Vertical padding: 58px × 2
     *
     * The first page has less room because it contains
     * the company header, invoice title and invoice details.
     */
    const firstPageHeight = 300;
    const otherPageHeight = 560;

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

    /*
     * Always show at least one page even when there
     * are currently no invoice items.
     */
    if (pages.length === 0) {
        pages.push([]);
    }

    return pages;
}

function InvoiceTable({
    items,
}: {
    items: InvoiceItem[];
}) {
    return (
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
                {items.map((item, index) => {
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
                                {item.description || "-"}
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
                })}
            </tbody>
        </table>
    );
}

export default function InvoicePreview({
    formData,
    formatDate,
    getSignatoryName,
}: InvoicePreviewProps) {
    const items = parseInvoiceItems(formData.items);
    const pages = splitInvoiceItems(items);

    const subtotal = items.reduce(
        (total, item) =>
            total + getInvoiceAmount(item),
        0
    );

    const taxRate = Number(formData.tax) || 0;
    const taxAmount = subtotal * (taxRate / 100);
    const total = subtotal + taxAmount;

    return (
        <div className="flex flex-col gap-8">
            {pages.map((pageItems, pageIndex) => {
                const isFirstPage = pageIndex === 0;
                const isLastPage =
                    pageIndex === pages.length - 1;

                return (
                    <article
                        key={pageIndex}
                        className="h-[842px] w-[595px] shrink-0 overflow-hidden bg-white px-[68px] py-[58px] text-gray-900 shadow-xl"
                    >
                        {/* Company Header */}
                        {isFirstPage && (
                            <>
                                <header
                                    className="border-b border-gray-300 pb-6"
                                    style={{
                                        borderBottomColor:
                                            company.primaryColor,
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

                                {/* Invoice Meta */}
                                <div className="mt-7 flex justify-between text-[10px] text-gray-600">
                                    <div>
                                        {formData.invoiceDate && (
                                            <p>
                                                <span className="font-semibold text-gray-800">
                                                    Date:
                                                </span>{" "}
                                                {formatDate(
                                                    formData.invoiceDate
                                                )}
                                            </p>
                                        )}
                                    </div>

                                    {formData.invoiceNumber && (
                                        <p>
                                            <span className="font-semibold text-gray-800">
                                                Invoice No:
                                            </span>{" "}
                                            {formData.invoiceNumber}
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
                                        Invoice
                                    </h1>

                                    <div
                                        className="mx-auto mt-3 h-px w-12"
                                        style={{
                                            backgroundColor:
                                                company.primaryColor,
                                        }}
                                    />
                                </div>

                                {/* Bill To / Invoice Details */}
                                <div className="mt-10 flex justify-between gap-8">
                                    <div>
                                        <p className="text-[9px] font-semibold uppercase tracking-wide text-gray-400">
                                            Bill To
                                        </p>

                                        <p className="mt-2 font-semibold">
                                            {formData.customerName ||
                                                "[Customer Name]"}
                                        </p>

                                        {formData.customerAddress && (
                                            <p className="mt-1 whitespace-pre-line text-[10px] leading-[1.25] text-gray-600">
                                                {normalizeMultilineText(formData.customerAddress)}
                                            </p>
                                        )}
                                    </div>

                                    <div className="text-right text-[10px]">
                                        {formData.dueDate && (
                                            <p>
                                                <span className="font-semibold">
                                                    Due Date:
                                                </span>{" "}
                                                {formatDate(
                                                    formData.dueDate
                                                )}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Continuation Page Heading */}
                        {!isFirstPage && (
                            <div className="border-b border-gray-200 pb-4">
                                <p
                                    className="text-sm font-bold"
                                    style={{
                                        color: company.primaryColor,
                                    }}
                                >
                                    {company.name}
                                </p>

                                <p className="mt-1 text-[9px] uppercase tracking-wide text-gray-400">
                                    Invoice — Continued
                                </p>
                            </div>
                        )}

                        {/* Items */}
                        <div
                            className={
                                isFirstPage
                                    ? "mt-8"
                                    : "mt-8"
                            }
                        >
                            <InvoiceTable items={pageItems} />
                        </div>

                        {/* Final Page Content */}
                        {isLastPage && (
                            <>
                                {/* Totals */}
                                <div className="mt-6 ml-auto w-48 text-[10px]">
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
                                </div>

                                {/* Payment Terms */}
                                {normalizeMultilineText(formData.paymentTerms) && (
                                    <div className="mt-10">
                                        <p className="font-semibold">
                                            Payment Terms
                                        </p>

                                        <p className="mt-2 whitespace-pre-line text-[10px] leading-[1.25] text-gray-600">
                                            {normalizeMultilineText(formData.paymentTerms)}
                                        </p>
                                    </div>
                                )}

                                {/* Notes */}
                                {normalizeMultilineText(formData.notes) && (
                                    <div className="mt-6">
                                        <p className="font-semibold">
                                            Notes
                                        </p>

                                        <p className="mt-2 whitespace-pre-line text-[10px] leading-[1.25] text-gray-600">
                                            {normalizeMultilineText(formData.notes)}
                                        </p>
                                    </div>
                                )}

                                {/* Signature */}
                                <footer className="mt-16">
                                    <div className="mb-8 h-10 w-36 border-b border-gray-400" />

                                    <p className="text-[11px] font-semibold">
                                        {getSignatoryName(
                                            formData.signatory
                                        )}
                                    </p>

                                    <p className="mt-1 text-[9px] text-gray-500">
                                        Authorized Signatory
                                    </p>

                                    <p className="mt-3 text-[9px] text-gray-500">
                                        {company.name}
                                    </p>
                                </footer>
                            </>
                        )}
                    </article>
                );
            })}
        </div>
    );
}