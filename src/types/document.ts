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

    type:
    | "text"
    | "date"
    | "select"
    | "textarea"
    | "table";

    placeholder?: string;
    required?: boolean;

    options?: {
        label: string;
        value: string;
    }[];

    columns?: {
        name: string;
        label: string;
        type: "text" | "number";
        placeholder?: string;
    }[];
};

export type DocumentSection = {
    id: string;
    title: string;
    fields: DocumentField[];
};

export type DocumentTemplate = {
    id: string;
    name: string;
    description: string;
    sections: DocumentSection[];
};

export type GeneratedDocument = {
  id: string;
  templateId: string;
  templateName: string;
  data: Record<string, string>;
  createdAt: string;
  createdBy?: string;
};