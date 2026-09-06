"use client";

import { GeneratedDocument, DocumentTemplate } from "@/types/document";

type DocumentDetailsProps = {
    document: GeneratedDocument;
    template: DocumentTemplate;
    onClose: () => void;
    onReopen: (document: GeneratedDocument) => void;
    onDownload: (document: GeneratedDocument) => void;
};

function formatValue(
    value: string | undefined,
    field: {
        type: string;
        options?: {
            label: string;
            value: string;
        }[];
    }
) {
    if (!value?.trim()) {
        return "—";
    }

    if (field.type === "date") {
        const date = new Date(value);

        if (!Number.isNaN(date.getTime())) {
            return date.toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            });
        }
    }

    if (field.type === "select" && field.options) {
        const option = field.options.find(
            (option) => option.value === value
        );

        return option?.label || value;
    }

    return value;
}

export default function DocumentDetails({
    document,
    template,
    onClose,
    onReopen,
    onDownload,
}: DocumentDetailsProps) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">
            <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-xl">
                {/* Header */}
                <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-6 py-4">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            {document.templateName}
                        </h2>

                        <p className="mt-1 text-xs text-gray-500">
                            Created{" "}
                            {new Date(
                                document.createdAt
                            ).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                            })}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={() => onReopen(document)}
                            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                        >
                            Reopen
                        </button>

                        <button
                            type="button"
                            onClick={() => onDownload(document)}
                            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                        >
                            Download
                        </button>

                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                        >
                            Close
                        </button>
                    </div>
                </div>

                {/* Details */}
                <div className="flex-1 overflow-y-auto px-6 py-6">
                    {template.sections.map((section) => (
                        <section
                            key={section.id}
                            className="mb-6 last:mb-0"
                        >
                            <h3 className="mb-3 border-b border-gray-200 pb-2 text-sm font-semibold text-gray-900">
                                {section.title}
                            </h3>

                            <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                                {section.fields.map((field) => {
                                    const value =
                                        document.data[field.name];

                                    if (field.type === "table") {
                                        let items: Array<{
                                            description?: string;
                                            quantity?: string | number;
                                            rate?: string | number;
                                        }> = [];

                                        try {
                                            items = JSON.parse(
                                                value || "[]"
                                            );
                                        } catch {
                                            items = [];
                                        }

                                        return (
                                            <div
                                                key={field.name}
                                                className="col-span-2"
                                            >
                                                <p className="mb-2 text-xs font-medium text-gray-500">
                                                    {field.label}
                                                </p>

                                                {items.length > 0 ? (
                                                    <div className="overflow-hidden rounded-lg border border-gray-200">
                                                        <div className="grid grid-cols-[1fr_100px_120px] border-b border-gray-200 bg-gray-50 px-4 py-2 text-xs font-semibold text-gray-500">
                                                            <span>
                                                                Description
                                                            </span>
                                                            <span>
                                                                Quantity
                                                            </span>
                                                            <span>
                                                                Rate
                                                            </span>
                                                        </div>

                                                        {items.map(
                                                            (
                                                                item,
                                                                index
                                                            ) => (
                                                                <div
                                                                    key={
                                                                        index
                                                                    }
                                                                    className="grid grid-cols-[1fr_100px_120px] border-b border-gray-100 px-4 py-3 text-sm last:border-b-0"
                                                                >
                                                                    <span className="text-gray-900">
                                                                        {item.description ||
                                                                            "—"}
                                                                    </span>

                                                                    <span className="text-gray-600">
                                                                        {item.quantity ??
                                                                            "—"}
                                                                    </span>

                                                                    <span className="text-gray-600">
                                                                        {item.rate ??
                                                                            "—"}
                                                                    </span>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-gray-600">
                                                        —
                                                    </p>
                                                )}
                                            </div>
                                        );
                                    }

                                    return (
                                        <div
                                            key={field.name}
                                            className={
                                                field.type ===
                                                    "textarea"
                                                    ? "col-span-2"
                                                    : ""
                                            }
                                        >
                                            <p className="text-xs font-medium text-gray-500">
                                                {field.label}
                                            </p>

                                            <p className="mt-1 whitespace-pre-line text-sm text-gray-900">
                                                {formatValue(
                                                    value,
                                                    field
                                                )}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                    ))}
                </div>
            </div>
        </div>
    );
}