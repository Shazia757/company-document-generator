"use client";

import { useState } from "react";

import Sidebar from "@/components/Sidebar";
import DocumentForm from "@/components/DocumentForm";
import DocumentPreview from "@/components/DocumentPreview";

import { documentTemplates } from "@/lib/document-templates";
import { GeneratedDocument } from "@/types/document";

import { pdf } from "@react-pdf/renderer";
import DocumentPDF from "@/lib/pdf/DocumentPDF";
import { company } from "@/lib/company";

export default function Home() {
  const [activeTab, setActiveTab] =
    useState<"new" | "history">("new");

  const [selectedTemplate, setSelectedTemplate] = useState(
    documentTemplates[0].id
  );

  const [formData, setFormData] =
    useState<Record<string, string>>({});

  const [formErrors, setFormErrors] =
    useState<Record<string, string>>({});

  const [generatedDocument, setGeneratedDocument] =
    useState<GeneratedDocument | null>(null);

  const currentTemplate = documentTemplates.find(
    (template) => template.id === selectedTemplate
  );

  function handleFieldChange(
    fieldName: string,
    value: string
  ) {
    setFormData((previous) => ({
      ...previous,
      [fieldName]: value,
    }));

    setFormErrors((previous) => {
      const updated = { ...previous };

      delete updated[fieldName];

      return updated;
    });

    setGeneratedDocument(null);
  }

  function handleSelectTemplate(templateId: string) {
    setSelectedTemplate(templateId);
    setFormData({});
    setFormErrors({});
    setGeneratedDocument(null);
  }

  function validateForm() {
    if (!currentTemplate) {
      return false;
    }

    const errors: Record<string, string> = {};

    for (const section of currentTemplate.sections) {
      for (const field of section.fields) {
        const value = formData[field.name]?.trim();

        // Required field validation
        if (field.required && !value) {
          errors[field.name] = `${field.label} is required.`;
          continue;
        }

        // Skip optional empty fields
        if (!value) {
          continue;
        }

        // Date validation
        if (field.type === "date") {
          const date = new Date(value);

          if (Number.isNaN(date.getTime())) {
            errors[field.name] = `${field.label} must be a valid date.`;
          }
        }

        // Invoice items validation
        if (field.type === "table") {
          try {
            const items = JSON.parse(value);

            if (!Array.isArray(items) || items.length === 0) {
              errors[field.name] = "Add at least one item.";
              continue;
            }

            const hasInvalidItem = items.some(
              (item) =>
                !item.description?.trim() ||
                Number(item.quantity) <= 0 ||
                Number(item.rate) < 0
            );

            if (hasInvalidItem) {
              errors[field.name] =
                "Each item must have a description, quantity greater than 0, and a valid rate.";
            }
          } catch {
            errors[field.name] = "Please enter valid invoice items.";
          }
        }
      }
    }

    // Date range validation
    const dateRanges = [
      ["joiningDate", "lastWorkingDate", "Joining date cannot be after last working date."],
      ["startDate", "endDate", "Start date cannot be after end date."],
      ["fromDate", "toDate", "From date cannot be after To date."],
      ["invoiceDate", "dueDate", "Due date cannot be before invoice date."],
    ];

    for (const [startField, endField, message] of dateRanges) {
      const startDate = formData[startField];
      const endDate = formData[endField];

      if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);

        if (
          !Number.isNaN(start.getTime()) &&
          !Number.isNaN(end.getTime()) &&
          start > end
        ) {
          errors[endField] = message;
        }
      }
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  }

  async function handleCreateDocument() {
    const isValid = validateForm();

    if (!isValid || !currentTemplate) {
      return;
    }

    const document: GeneratedDocument = {
      id: crypto.randomUUID(),
      templateId: currentTemplate.id,
      templateName: currentTemplate.name,
      data: { ...formData },
      createdAt: new Date().toISOString(),
    };

    setGeneratedDocument(document);

    try {
      const blob = await pdf(
        <DocumentPDF
          template={currentTemplate}
          formData={formData}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);

      const link = window.document.createElement("a");

      link.href = url;

      link.download = `${currentTemplate.name
        .toLowerCase()
        .replace(/\s+/g, "-")}.pdf`;

      link.click();

      URL.revokeObjectURL(url);

      console.log("Generated document:", document);
    } catch (error) {
      console.error("PDF generation failed:", error);
    }
  }

  function handleClear() {
    setFormData({});
    setFormErrors({});
    setGeneratedDocument(null);
  }

  return (
    <main className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Area */}
      <section className="flex min-w-0 flex-1 flex-col">
        {/* Header */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6">
          <div>
            <h2 className="text-sm font-semibold text-gray-900">
              {activeTab === "new"
                ? "Create New Document"
                : "Document History"}
            </h2>

            <p className="text-xs text-gray-500">
              {activeTab === "new"
                ? "Create a professional company document"
                : "View previously generated documents"}
            </p>
          </div>

          <div className="text-xs font-medium text-gray-500">
            {company.name}
          </div>
        </header>

        {/* Content */}
        {activeTab === "new" ? (
          <div className="flex min-h-0 flex-1">
            {/* Form Panel */}
            <section className="flex w-[42%] min-w-[360px] flex-col border-r border-gray-200 bg-white">
              <div className="flex-1 overflow-y-auto px-6 py-6">
                {/* Page heading */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Create Document
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Select a template and enter the required details.
                  </p>
                </div>

                {/* Document Type */}
                <div className="mb-6">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Document Type
                  </label>

                  <select
                    value={selectedTemplate}
                    onChange={(event) =>
                      handleSelectTemplate(event.target.value)
                    }
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                  >
                    {documentTemplates.map((template) => (
                      <option
                        key={template.id}
                        value={template.id}
                      >
                        {template.name}
                      </option>
                    ))}
                  </select>

                  {currentTemplate?.description && (
                    <p className="mt-2 text-xs text-gray-500">
                      {currentTemplate.description}
                    </p>
                  )}
                </div>

                {/* Details */}
                <div>
                  <div className="mb-4 border-b border-gray-200 pb-3">
                    <h4 className="text-sm font-semibold text-gray-900">
                      Details
                    </h4>
                  </div>

                  <DocumentForm
                    template={currentTemplate}
                    formData={formData}
                    formErrors={formErrors}
                    onFieldChange={handleFieldChange}
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="shrink-0 border-t border-gray-200 bg-white p-4">
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleClear}
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    Clear
                  </button>

                  <button
                    type="button"
                    onClick={handleCreateDocument}
                    className="flex-[2] rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
                  >
                    Create Document
                  </button>
                </div>
              </div>
            </section>

            {/* Preview Panel */}
            <section className="flex min-w-0 flex-1 flex-col bg-gray-100">
              {/* Preview Header */}
              <div className="flex h-12 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-5">
                <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Preview
                </span>

                <span className="text-xs text-gray-400">
                  A4
                </span>
              </div>

              {/* Preview */}
              <div className="relative flex min-h-0 flex-1 items-start justify-center overflow-auto p-8">
                <DocumentPreview
                  template={currentTemplate}
                  formData={formData}
                />

                {generatedDocument && (
                  <div className="fixed bottom-6 right-6 rounded-lg border border-green-200 bg-white px-4 py-3 text-sm text-green-700 shadow-lg">
                    ✓ Document created successfully.
                  </div>
                )}
              </div>
            </section>
          </div>
        ) : (
          /* History */
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <h2 className="text-lg font-semibold text-gray-900">
                Document History
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Generated documents will appear here.
              </p>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}