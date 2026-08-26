export type DocumentFieldType =
    | "text"
    | "date"
    | "textarea"
    | "select";

export type DocumentFieldOption = {
    label: string;
    value: string;
};

export type DocumentField = {
    name: string;
    label: string;
    type: DocumentFieldType;
    required?: boolean;
    placeholder?: string;
    options?: DocumentFieldOption[];
    minLength?: number;
    maxLength?: number;
};

export type DocumentTemplate = {
    id: string;
    name: string;
    description: string;
    fields: DocumentField[];
};

export type GeneratedDocument = {
  id: string;
  templateId: string;
  templateName: string;
  data: Record<string, string>;
  createdAt: string;
};