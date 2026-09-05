import { GeneratedDocument } from "@/types/document";

type DocumentHistoryProps = {
    documents: GeneratedDocument[];
    onReopen: (document: GeneratedDocument) => void;
};

function formatCreatedAt(value: string) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "-";
    }

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function getDocumentIdentifier(document: GeneratedDocument) {
    return (
        document.data.invoiceNumber ||
        document.data.referenceNumber ||
        document.data.certificateNumber ||
        "—"
    );
}

function getRecipient(document: GeneratedDocument) {
    return (
        document.data.customerName ||
        document.data.recipientName ||
        document.data.employeeName ||
        document.data.internName ||
        "—"
    );
}

export default function DocumentHistory({
    documents,
    onReopen,
}: DocumentHistoryProps) {
    if (documents.length === 0) {
        return (
            <div className="flex flex-1 items-center justify-center">
                <div className="text-center">
                    <h2 className="text-lg font-semibold text-gray-900">
                        No documents yet
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                        Generated documents will appear here.
                    </p>
                </div>
            </div>
        );
    }

    const sortedDocuments = [...documents].sort(
        (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
    );

    return (
        <div className="flex-1 overflow-y-auto p-6">
            <div className="mx-auto max-w-5xl">
                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Document History
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Previously generated documents.
                    </p>
                </div>

                <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                    <div className="grid grid-cols-[1.4fr_1fr_1.4fr_1fr_auto] gap-4 border-b border-gray-200 bg-gray-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                        <span>Document</span>
                        <span>Reference</span>
                        <span>Recipient</span>
                        <span>Created</span>
                        <span />
                    </div>

                    {sortedDocuments.map((document) => (
                        <div
                            key={document.id}
                            className="grid grid-cols-[1.4fr_1fr_1.4fr_1fr_auto] items-center gap-4 border-b border-gray-100 px-5 py-4 last:border-b-0"
                        >
                            <div>
                                <p className="text-sm font-medium text-gray-900">
                                    {document.templateName}
                                </p>
                            </div>

                            <p className="truncate text-sm text-gray-600">
                                {getDocumentIdentifier(document)}
                            </p>

                            <p className="truncate text-sm text-gray-600">
                                {getRecipient(document)}
                            </p>

                            <p className="text-sm text-gray-600">
                                {formatCreatedAt(document.createdAt)}
                            </p>

                            <button
                                type="button"
                                onClick={() => onReopen(document)}
                                className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50"
                            >
                                Reopen
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}