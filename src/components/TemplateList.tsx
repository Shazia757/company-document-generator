import { DocumentTemplate } from "@/types/document";

type TemplateListProps = {
    templates: DocumentTemplate[];
    selectedTemplate: string;
    onSelect: (templateId: string) => void;
};

export default function TemplateList({
    templates,
    selectedTemplate,
    onSelect,
}: TemplateListProps) {
    return (
        <div className="flex min-h-0 flex-1 flex-col border-b">
            <div className="shrink-0 px-4 py-3">
                <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Templates
                </h2>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
                <div className="space-y-2">
                    {templates.map((template) => (
                        <button
                            key={template.id}
                            onClick={() => onSelect(template.id)}
                            className={`w-full rounded-lg border p-3 text-left ${selectedTemplate === template.id
                                    ? "border-gray-900 bg-gray-50"
                                    : "border-gray-200 hover:bg-gray-50"
                                }`}
                        >
                            <div className="text-sm font-medium text-gray-900">
                                {template.name}
                            </div>

                            <div className="mt-1 text-xs text-gray-500">
                                {template.description}
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}