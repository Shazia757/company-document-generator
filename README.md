# Company Document Generator

A full-stack web application for generating standardized company documents from reusable templates.

The application allows authorized users to create professional business documents such as formal letters, offer letters, internship certificates, NOCs, experience certificates, and invoices. Each document type uses its own form schema, validation rules, preview, and PDF generation logic.

## Overview

Creating repetitive company documents manually can be time-consuming and can lead to inconsistent formatting or missing information.

This project explores a simple solution: provide reusable document templates and collect only the information required for the selected document type.

The application generates a professional PDF while also maintaining a persistent history of previously created documents.

> This project is built as a portfolio/full-stack engineering project demonstrating authentication, authorization, database persistence, dynamic forms, document generation, and production deployment.

---

## Features

### Authentication

* Secure credential-based login
* Password hashing with bcrypt
* Protected application access
* Session-based authentication using Auth.js
* Logout functionality
* Friendly authentication error messages
* Loading state during sign-in

### Document Generation

* Multiple document templates
* Document-specific form fields
* Required-field validation
* Date validation
* Date-range validation
* Invoice item validation
* Live document preview
* A4 document layout
* PDF generation

### Supported Documents

* Formal Letter
* Offer Letter
* Internship Certificate
* NOC
* Experience Certificate
* Bill / Invoice

Each document type has its own schema rather than relying on one large universal form.

### Document History

* Persist generated documents in PostgreSQL
* View previously generated documents
* View document details
* Reopen a generated document
* Regenerate and download the PDF
* Delete documents
* Documents are scoped to the authenticated user

### Company Configuration

* Company information
* Company branding
* Company logo
* Authorized signatories
* Reusable company information across generated documents

---

## Tech Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS

### Backend

* Next.js Server Actions
* Auth.js
* bcryptjs

### Database

* PostgreSQL
* Prisma ORM
* Neon PostgreSQL

### Document Generation

* `@react-pdf/renderer`

### Deployment

* Vercel

---

## Architecture

The application follows a modular architecture separating the main responsibilities of the system.

```text
┌──────────────────────────────┐
│           Browser            │
│                              │
│  Login / Forms / Preview     │
│  History / Document Details  │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│        Next.js App           │
│                              │
│  Pages / Components          │
│  Server Actions              │
│  Authentication              │
└───────┬──────────┬───────────┘
        │          │
        ▼          ▼
┌────────────┐  ┌────────────────┐
│ PostgreSQL │  │ PDF Generation │
│            │  │                │
│ Users      │  │ React PDF      │
│ Documents  │  │ Templates      │
└────────────┘  └────────────────┘
```

### Main application layers

```text
src/
├── app/
│   ├── actions/
│   │   └── document.ts
│   ├── api/
│   │   └── auth/
│   ├── login/
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

---

## Document Template Architecture

Rather than creating a separate form implementation for every document, the application uses reusable template definitions.

A template describes information such as:

* Document type
* Document name
* Description
* Sections
* Fields
* Field types
* Required fields
* Select options

Conceptually:

```text
Document Template
       │
       ├── Section
       │     ├── Field
       │     ├── Field
       │     └── Field
       │
       └── Section
             ├── Field
             └── Field
```

This allows the form, validation, and parts of the preview to be driven by the selected document template.

### Why this approach?

A universal form would require many unrelated fields and complicated conditional logic.

Template-specific schemas keep the user experience simple and make it easier to add new document types later.

---

## Database Design

The current database contains two primary models:

```text
User
 │
 │ 1
 │
 │
 │ *
 ▼
Document
```

### User

Stores:

* ID
* Name
* Email
* Password hash
* Created timestamp

### Document

Stores:

* ID
* Template ID
* Template name
* Document form data
* Created timestamp
* Updated timestamp
* Creator/user ID

The document's generated PDF is **not stored in the database**.

Instead, the application stores the data required to recreate the document and regenerates the PDF when needed.

### Why store data instead of PDFs?

This keeps the initial system simpler and avoids unnecessary file-storage infrastructure.

It also means a document can be reopened and regenerated from its original structured data.

---

## Authentication & Authorization

Authentication is implemented using Auth.js with a credentials provider.

The login flow is:

```text
User
 │
 ▼
Login Form
 │
 ▼
Auth.js
 │
 ▼
Find User
 │
 ▼
Compare Password Hash
 │
 ├── Invalid → Error
 │
 └── Valid
       │
       ▼
    Session
       │
       ▼
 Protected Application
```

Authorization is enforced when accessing documents.

Database queries use the authenticated user's ID when retrieving or deleting documents.

This prevents one authenticated user from accessing another user's documents through the application actions.

---

## Document Lifecycle

```text
Select Template
       │
       ▼
Enter Information
       │
       ▼
Validate
       │
       ▼
Generate Document
       │
       ├──────────────► PDF
       │
       ▼
Save Metadata + Form Data
       │
       ▼
Document History
       │
       ├── View
       ├── Reopen
       ├── Download
       └── Delete
```

PDF files are regenerated from the stored document data rather than persisted as binary files.

---

## Validation

Validation is performed before a document is generated.

Examples include:

* Required fields
* Valid dates
* Logical date ranges
* Invoice item descriptions
* Positive invoice quantities
* Valid invoice rates
* At least one invoice item

When validation fails, the application focuses the first invalid field to help the user correct the problem.

---

## PDF Generation

PDFs are generated using `@react-pdf/renderer`.

The selected template and normalized form data are passed to the PDF generation layer.

```text
Template
   +
Form Data
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

The application uses an A4 document format and reusable company information for consistent output.

---

## Security Considerations

The project includes several security-oriented decisions:

* Passwords are never stored directly.
* Passwords are hashed using bcrypt.
* Authentication is required before accessing the main application.
* Document queries are scoped to the authenticated user.
* Delete operations verify document ownership.
* Sensitive configuration values are stored in environment variables.
* PDFs are generated from application data rather than exposing database records directly to the client.

Security can be expanded further in a production enterprise environment with additional controls such as rate limiting, stronger account management, audit logging, and role-based permissions.

---

## Environment Variables

The application requires environment variables similar to:

```env
DATABASE_URL=your_database_connection_string
AUTH_SECRET=your_auth_secret
```

Administrative user creation uses server-side environment variables and should never expose credentials to the client.

Do not commit `.env` files or secrets to source control.

---

## Local Development

### 1. Clone the repository

```bash
git clone https://github.com/Shazia757/company-document-generator.git
cd company-document-generator
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file and provide the required database and authentication configuration.

### 4. Set up the database

```bash
npx prisma migrate dev
npx prisma generate
```

### 5. Start the development server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

---

## Production Build

To verify the production build:

```bash
npm run build
```

To start the production server locally:

```bash
npm run start
```

---

## Project Status

### Completed

* [x] Project foundation
* [x] Document template system
* [x] Dynamic document forms
* [x] Form validation
* [x] Live document preview
* [x] PDF generation
* [x] Company branding
* [x] Authentication
* [x] User authorization
* [x] PostgreSQL persistence
* [x] Document history
* [x] Document details
* [x] Reopen document
* [x] Download document
* [x] Delete document
* [x] Login/logout UX

### Future Improvements

Potential future improvements include:

* Role-based access control
* More document templates
* Advanced search and filtering
* Document versioning
* Audit logs
* Draft saving
* DOCX generation
* Cloud file storage
* Email delivery
* More advanced company settings
* Automated test coverage

These features are intentionally outside the current MVP scope.

---

## Key Engineering Decisions

### Document-specific schemas

Different documents require different information, so the application avoids a single universal form.

### Regenerate PDFs instead of storing them

The database stores structured document data rather than generated PDF files.

### Server-side authorization

Authorization checks are performed on the server rather than relying only on frontend visibility.

### Small reusable components

Form, preview, history, details, invoice preview, authentication, database, and PDF generation responsibilities are separated to keep the codebase maintainable.

### Keep the MVP focused

The project prioritizes the core workflow:

```text
Authenticate
    ↓
Select document
    ↓
Enter information
    ↓
Validate
    ↓
Generate PDF
    ↓
Save
    ↓
Manage history
```

---

## Portfolio Highlights

This project demonstrates experience with:

* Full-stack Next.js development
* TypeScript
* React component architecture
* Authentication and authorization
* PostgreSQL database design
* Prisma ORM
* Server Actions
* Dynamic schema-driven forms
* Form validation
* PDF generation
* Responsive UI development
* Environment-based configuration
* Production deployment
* Security-conscious application design

---

## License

This project is intended as a portfolio and demonstration project.
