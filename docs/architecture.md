# Architecture

## 1. Overview

Company Document Generator is a full-stack web application built with Next.js, React, TypeScript, PostgreSQL, Prisma, Auth.js, and React PDF.

The architecture is intentionally modular so that document templates, form handling, authentication, persistence, and PDF generation can evolve independently.

The primary application flow is:

```text
User
  │
  ▼
Next.js UI
  │
  ├── Authentication
  │
  ├── Document Forms
  │
  ├── Live Preview
  │
  └── Document History
  │
  ▼
Server Actions
  │
  ├── Authentication checks
  ├── Authorization checks
  └── Database operations
  │
  ▼
PostgreSQL
```

PDF generation follows a separate path:

```text
Document Template
       +
Normalized Form Data
       │
       ▼
   DocumentPDF
       │
       ▼
PDF Blob
       │
       ▼
Browser Download
```

---

## 2. Technology Stack

| Layer            | Technology   | Responsibility                        |
| ---------------- | ------------ | ------------------------------------- |
| Framework        | Next.js      | Application framework and routing     |
| UI               | React        | Interactive user interface            |
| Language         | TypeScript   | Type safety                           |
| Styling          | Tailwind CSS | UI styling                            |
| Authentication   | Auth.js      | Login and session management          |
| Password hashing | bcryptjs     | Secure password hashing               |
| Database         | PostgreSQL   | Persistent application data           |
| ORM              | Prisma       | Database access and schema management |
| PDF              | React PDF    | PDF document generation               |
| Database hosting | Neon         | Managed PostgreSQL                    |
| Deployment       | Vercel       | Production hosting                    |

---

## 3. Application Structure

The project separates responsibilities into several areas.

```text
src/
│
├── app/
│   ├── actions/
│   │   └── document.ts
│   │
│   ├── api/
│   │   └── auth/
│   │
│   ├── login/
│   │
│   └── page.tsx
│
├── components/
│   ├── DocumentDetails.tsx
│   ├── DocumentForm.tsx
│   ├── DocumentHistory.tsx
│   ├── DocumentPreview.tsx
│   ├── InvoicePreview.tsx
│   └── Sidebar.tsx
│
├── lib/
│   ├── company.ts
│   ├── document-templates.ts
│   ├── pdf/
│   └── prisma.ts
│
├── generated/
│   └── prisma/
│
├── types/
│   └── document.ts
│
├── auth.ts
└── auth.config.ts
```

### Responsibility boundaries

**`app/`**

Contains application routes, pages, API routes, and server actions.

**`components/`**

Contains reusable UI components.

**`lib/`**

Contains application-level services and configuration such as database access, company information, document templates, and PDF generation.

**`types/`**

Contains shared TypeScript types.

**`auth.ts` and `auth.config.ts`**

Contain authentication configuration and authentication behavior.

---

## 4. Document Template System

The application uses a template-driven approach.

Each document type defines its own fields and sections.

Conceptually:

```text
DocumentTemplate
│
├── id
├── name
├── description
│
└── sections[]
      │
      ├── title
      │
      └── fields[]
            │
            ├── name
            ├── label
            ├── type
            ├── required
            └── options
```

For example, an experience certificate may require:

```text
Employee Name
Job Title
Joining Date
Last Working Date
Certificate Date
Authorized Signatory
```

while an invoice may require:

```text
Customer Name
Invoice Number
Invoice Date
Due Date
Items
Notes
Payment Terms
```

### Why use document-specific schemas?

A single universal form would force users to interact with fields that are irrelevant to their document.

The template-driven approach provides:

* Smaller forms
* Better user experience
* Clear validation rules
* Easier addition of document types
* Less duplicated UI code

---

## 5. Form Architecture

The selected document template determines which fields are rendered.

```text
User selects document type
          │
          ▼
Find matching template
          │
          ▼
DocumentForm receives template
          │
          ▼
Render sections and fields
          │
          ▼
User enters data
          │
          ▼
formData state
```

The form state is maintained on the client because the application needs immediate updates for:

* Live preview
* Validation feedback
* Clearing the form
* Reopening documents

The form state is not treated as a permanent draft.

Only generated documents are persisted.

---

## 6. Validation Architecture

Validation occurs before document creation.

The validation layer checks:

### Required fields

Required fields must contain a non-empty value.

### Date fields

Date inputs are checked for valid dates.

### Date ranges

Related dates are checked for logical ordering.

Examples:

```text
Joining Date <= Last Working Date

Start Date <= End Date

From Date <= To Date

Invoice Date <= Due Date
```

### Invoice items

Invoice rows must contain:

* Description
* Quantity greater than zero
* Valid rate
* At least one item

Validation errors are stored by field name so the UI can display the appropriate message.

The first invalid field is focused to improve correction speed.

---

## 7. Data Normalization

Before a document is generated and persisted, ordinary text fields are normalized.

The application:

* Trims unnecessary whitespace
* Removes repeated blank lines
* Preserves invoice item data
* Handles multiline text appropriately

This helps prevent inconsistent document formatting caused by accidental whitespace entered by users.

---

## 8. Live Preview

The application provides a live preview while the user enters information.

```text
Form State
    │
    ▼
DocumentPreview
    │
    ▼
Rendered A4 preview
```

The preview uses the current form data and selected template.

This gives users immediate feedback before creating the final document.

The preview and PDF generation use the same underlying document information but serve different purposes:

* **Preview:** interactive visual feedback
* **PDF:** final downloadable document

---

## 9. PDF Generation

PDF generation is handled by `@react-pdf/renderer`.

The general flow is:

```text
Template
   +
Form Data
   │
   ▼
DocumentPDF
   │
   ▼
React PDF Document
   │
   ▼
PDF Blob
   │
   ▼
Browser Download
```

The PDF uses:

* A4 page size
* Company information
* Company logo
* Authorized signatory information
* Template-specific document content

Invoice documents use a dedicated invoice preview/generation structure because invoices contain tabular line-item data.

---

## 10. Authentication Architecture

Authentication uses Auth.js with a credentials provider.

The login flow is:

```text
Email + Password
       │
       ▼
     Auth.js
       │
       ▼
Find User by Email
       │
       ▼
Compare Password
       │
       ├── Failure ──► Generic Error
       │
       └── Success
              │
              ▼
           Session
```

Passwords are never stored directly.

The database stores a bcrypt password hash.

The authentication configuration is separated into:

* `auth.config.ts` — shared Auth.js configuration
* `auth.ts` — database-backed credentials authentication

---

## 11. Authorization

Authentication answers:

> Who is the user?

Authorization answers:

> What is that user allowed to access?

The application performs authorization checks on the server.

Document queries use the authenticated user's ID:

```text
Authenticated User
       │
       ▼
session.user.id
       │
       ▼
Document query
       │
       ▼
createdById = session.user.id
```

Delete operations also verify ownership before deleting a document.

This is important because hiding another user's document in the UI is not sufficient security.

Authorization must be enforced where the data operation occurs.

---

## 12. Database Architecture

The application currently uses two main database models.

```text
User
│
├── id
├── name
├── email
├── passwordHash
└── createdAt
     │
     │ 1-to-many
     ▼
Document
├── id
├── templateId
├── templateName
├── data
├── createdAt
├── updatedAt
└── createdById
```

### User

Represents an authenticated application user.

### Document

Represents a generated document and contains the structured form data required to recreate it.

The `data` field uses PostgreSQL JSON storage because different document templates have different schemas.

---

## 13. Why JSON for Document Data?

Different document types require different fields.

For example:

```text
Offer Letter
├── employeeName
├── position
├── joiningDate
└── salary

Invoice
├── customerName
├── invoiceNumber
├── invoiceDate
└── items[]
```

Creating a separate database table for every document type would introduce unnecessary complexity for the MVP.

Instead, the application stores document-specific data as JSON while keeping common document metadata relational.

This provides a balance between:

* Flexible document schemas
* Simple database design
* Strong relational ownership
* Easy document reconstruction

---

## 14. Document Persistence

The application does not initially store generated PDF files.

Instead, it stores:

```text
Template ID
Template Name
Document Data
Created By
Created At
Updated At
```

When the user downloads a historical document:

```text
Stored Document
      │
      ▼
Find Template
      │
      ▼
Stored Form Data
      │
      ▼
DocumentPDF
      │
      ▼
Regenerated PDF
```

### Reasoning

Storing the structured data rather than the generated file:

* Avoids initial file-storage infrastructure
* Keeps the database simpler
* Allows PDFs to be regenerated
* Makes reopening documents straightforward

Binary file storage can be introduced later if permanent document snapshots become a requirement.

---

## 15. Document History

Generated documents are displayed in chronological order.

Users can:

* View document details
* Reopen a document
* Download a regenerated PDF
* Delete a document

The history workflow is:

```text
Generated Document
       │
       ▼
PostgreSQL
       │
       ▼
Document History
       │
       ├── View
       ├── Reopen
       ├── Download
       └── Delete
```

---

## 16. Server Actions

Document persistence operations are implemented using Next.js Server Actions.

Current responsibilities include:

```text
saveDocument()
getDocuments()
deleteDocument()
```

Each protected operation verifies authentication before interacting with the database.

This keeps sensitive database operations on the server.

---

## 17. Company Configuration

Company-level information is currently kept separately from document form data.

The company configuration includes information such as:

* Company name
* Address/contact information
* Logo
* Authorized signatories

The document generation layer consumes this information when producing documents.

This avoids duplicating company information inside every document template.

---

## 18. Security Boundaries

The main security boundaries are:

```text
Browser
   │
   │ User input
   ▼
Next.js Server
   │
   ├── Authentication
   ├── Authorization
   ├── Validation
   └── Database access
   │
   ▼
PostgreSQL
```

The browser is treated as an untrusted environment.

Important security decisions include:

* Password hashing
* Server-side authentication checks
* Server-side ownership checks
* Environment variables for secrets
* No direct client-side database access
* Generic authentication errors
* No credentials stored in source control

---

## 19. Deployment Architecture

The application is deployed using Vercel.

A simplified production architecture is:

```text
User
 │
 ▼
Vercel
 │
 ├── Next.js Application
 │
 └── Server Actions
        │
        ▼
     Neon PostgreSQL
```

Environment-specific configuration is supplied through deployment environment variables.

---

## 20. Architectural Principles

The project follows several principles.

### Simplicity first

The architecture avoids unnecessary infrastructure while the product scope is small.

### Separation of concerns

UI, authentication, database access, templates, and PDF generation are separated.

### Server-side security

Authentication and authorization are enforced on the server.

### Template-driven extensibility

New document types should primarily require a new template definition rather than an entirely new form implementation.

### Data-driven document generation

Documents can be reconstructed from stored template information and structured data.

### Incremental development

Features are implemented in small steps to reduce unnecessary rewrites and make changes easier to test.

---

## 21. Current Limitations

The current architecture intentionally leaves several areas for future iterations.

These include:

* Role-based access control
* Document versioning
* Audit logging
* Draft persistence
* Advanced search
* File/object storage
* DOCX generation
* Multi-company tenancy
* Automated end-to-end testing

These are not required for the current portfolio MVP.

---

## 22. Future Architecture Evolution

If the application evolves into a larger company system, the architecture could be extended with:

```text
Organization
     │
     ├── Users
     │
     ├── Company Settings
     │
     ├── Templates
     │
     └── Documents
            │
            ├── Versions
            ├── Audit Events
            └── Stored Files
```

Additional infrastructure could then include:

* Object storage for generated files
* Background jobs for document processing
* Role-based permissions
* Audit logging
* Organization-level isolation
* Document version management

These additions should be driven by actual product requirements rather than added prematurely.
