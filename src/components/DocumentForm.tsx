import { DocumentTemplate } from "@/types/document";

type DocumentFormProps = {
    template?: DocumentTemplate;
    formData: Record<string, string>;
    formErrors: Record<string, string>;
    onFieldChange: (fieldName: string, value: string) => void;
};

export default function DocumentForm({
    template,
    formData,
    formErrors,
    onFieldChange,
}: DocumentFormProps) {
    if (!template) {
        return (
            <div className="rounded-lg border border-dashed border-gray-300 p-6 text-center">
                <p className="text-sm text-gray-500">
                    Select a document template to begin.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-7">
            {template.fields.map((field) => (
                <div key={field.name}>
                    {/* Label */}
                    <label className="mb-1.5 block text-sm font-medium text-gray-800">
                        {field.label}

                        {field.required && (
                            <span className="ml-1 text-red-500">*</span>
                        )}
                    </label>

                    {/* Textarea */}
                    {field.type === "textarea" && (
                        <textarea
                            value={formData[field.name] ?? ""}
                            onChange={(event) =>
                                onFieldChange(field.name, event.target.value)
                            }
                            placeholder={field.placeholder}
                            rows={5}
                            className={`w-full resize-y rounded-lg border bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition ${formErrors[field.name]
                                ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                : "border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                                }`}
                        />
                    )}

                    {/* Select */}
                    {field.type === "select" && (
                        <select
                            value={formData[field.name] ?? ""}
                            onChange={(event) =>
                                onFieldChange(field.name, event.target.value)
                            }
                            className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition ${formErrors[field.name]
                                ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                : "border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                                }`}
                        >
                            <option value="">Select...</option>

                            {field.options?.map((option) => (
                                <option
                                    key={option.value}
                                    value={option.value}
                                >
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    )}

                    {/* Text / Date */}
                    {(field.type === "text" || field.type === "date") && (
                        <input
                            type={field.type}
                            value={formData[field.name] ?? ""}
                            onChange={(event) =>
                                onFieldChange(field.name, event.target.value)
                            }
                            placeholder={field.placeholder}
                            className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none transition ${formErrors[field.name]
                                ? "border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-500"
                                : "border-gray-300 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                                }`}
                        />
                    )}

                    {/* Error */}
                    {formErrors[field.name] && (
                        <p className="mt-1.5 text-xs text-red-600">
                            {formErrors[field.name]}
                        </p>
                    )}
                </div>
            ))}
        </div>
    );
}