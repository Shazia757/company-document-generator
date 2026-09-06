# Architecture & Product Decisions

This document records the major technical and product decisions made during development of the Company Document Generator.

The purpose is to explain not only what was implemented, but why particular approaches were chosen.

---

## 1. Use Next.js as the Application Framework

### Decision

Use Next.js for both the frontend and backend application layer.

### Reason

The project requires:

* Server-rendered pages
* Client-side interactive components
* Server Actions
* API routes
* Authentication
* Database access

Next.js provides these capabilities within a single application, which keeps the project relatively simple.

### Trade-off

A separate frontend and backend could provide stronger separation at larger scale, but would introduce additional infrastructure and complexity that is unnecessary for the current MVP.

---

## 2. Use TypeScript

### Decision

Use TypeScript throughout the application.

### Reason

The project contains several structured concepts:

* Document templates
* Form fields
* Document data
* Invoice items
* Authentication data

TypeScript helps catch incorrect data usage during development and makes component interfaces clearer.

---

## 3. Use Template-Specific Document Schemas

### Decision

Each document type has its own template definition and relevant fields.

### Reason

Different documents require different information.

For example, an invoice needs customer and line-item information, while an internship certificate requires internship dates and role information.

A universal form would expose unnecessary fields and create complicated conditional logic.

### Result

The form is driven by the selected document template.

This makes the system easier to use and easier to extend.

---

## 4. Use PostgreSQL

### Decision

Use PostgreSQL as the primary database.

### Reason

The application needs persistent relational data for:

* Users
* Documents
* Document ownership
* Creation/update timestamps

PostgreSQL provides strong relational capabilities while also supporting JSON data for document-specific fields.

---

## 5. Use Prisma ORM

### Decision

Use Prisma for database access.

### Reason

Prisma provides:

* Type-safe database queries
* Schema management
* Migrations
* Clear relationships
* Good TypeScript integration

It also keeps database operations readable and maintainable.

---

## 6. Store Document Data as JSON

### Decision

Store the variable document form data in a PostgreSQL JSON field.

### Reason

Different document types have different fields.

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

Creating a separate relational table for every document type would add unnecessary complexity for the current scope.

The database therefore stores common document metadata relationally and document-specific fields as JSON.

### Trade-off

JSON provides flexibility but sacrifices some database-level structure and querying capabilities.

If the system later requires advanced reporting across document-specific fields, the data model may need to evolve.

---

## 7. Do Not Store Generated PDFs Initially

### Decision

Store document data instead of storing generated PDF files.

### Reason

The PDF can be recreated from:

```text
Template
+
Stored Document Data
```

This avoids introducing file/object storage infrastructure during the MVP.

It also makes reopening and regenerating documents straightforward.

### Future Consideration

If the product later requires immutable document snapshots, permanent file storage, or document sharing, generated files could be stored using object storage.

---

## 8. Use Auth.js for Authentication

### Decision

Use Auth.js with a credentials provider.

### Reason

The application requires authenticated access but does not currently need complex identity-provider integration.

Auth.js provides:

* Session management
* Protected authentication flow
* Credentials provider support
* Integration with Next.js

This keeps authentication inside the existing application architecture.

---

## 9. Hash Passwords with bcrypt

### Decision

Never store plaintext passwords.

Passwords are hashed using bcrypt before being stored.

### Reason

Passwords are sensitive credentials and should never be stored directly.

The authentication process compares the submitted password against the stored hash rather than retrieving a plaintext password.

---

## 10. Perform Authorization on the Server

### Decision

Document ownership checks are performed on the server.

### Reason

Client-side restrictions are not sufficient security.

A malicious client could bypass UI restrictions and attempt to access another document directly.

Server-side queries therefore include the authenticated user's ID when retrieving or deleting documents.

### Principle

Authentication determines:

> Who are you?

Authorization determines:

> What are you allowed to access?

---

## 11. Use Server Actions for Document Persistence

### Decision

Document database operations use Next.js Server Actions.

### Reason

Operations such as:

```text
saveDocument()
getDocuments()
deleteDocument()
```

require server-side database access and authorization.

Server Actions provide a convenient boundary between the interactive UI and protected backend operations without requiring a separate REST API for the current scope.

---

## 12. Keep Draft State in Memory

### Decision

Do not persist partially completed forms as drafts in the MVP.

### Reason

The primary workflow is generating completed business documents.

Persisting drafts would introduce additional requirements such as:

* Draft status
* Draft ownership
* Autosave behavior
* Recovery logic
* Draft cleanup

These are not currently necessary.

### Future Consideration

Draft persistence can be introduced if users need to leave incomplete documents and return to them later.

---

## 13. Keep Versioning Out of the MVP

### Decision

Generated documents do not currently maintain multiple versions.

### Reason

Versioning would require decisions around:

* Version numbering
* Editing historical documents
* Snapshot behavior
* Version comparison
* Restore operations

The current product only needs to preserve generated document data.

Versioning can be added if the product later requires document revision history.

---

## 14. Keep Role-Based Access Control Out of the MVP

### Decision

The initial system uses authenticated users without complex roles.

### Reason

The current portfolio scope does not require multiple permission levels.

Adding roles such as:

```text
Admin
HR
Finance
Manager
Viewer
```

would increase the authorization model and UI complexity.

### Future Consideration

Role-based access control would become useful if the application evolves into a larger company-wide system.

---

## 15. Use Client-Side State for Interactive Form Behavior

### Decision

Keep active form state on the client.

### Reason

The UI requires immediate updates for:

* Live preview
* Validation feedback
* Clearing the form
* Reopening documents
* Template switching

Sending every field change to the server would add unnecessary complexity and latency.

The server is used when persistence or protected operations are actually required.

---

## 16. Normalize Form Data Before Generation

### Decision

Normalize ordinary text fields before generating and saving documents.

### Reason

Users may accidentally enter:

* Leading/trailing spaces
* Multiple blank lines
* Inconsistent whitespace

Normalizing the data improves consistency between:

* Preview
* Stored document data
* Generated PDF

---

## 17. Regenerate Historical PDFs

### Decision

Historical documents are regenerated from stored data when downloaded.

### Reason

This keeps the database independent from binary file storage during the MVP.

The workflow is:

```text
Historical Document
       │
       ▼
Stored Template + Data
       │
       ▼
PDF Generation
       │
       ▼
Download
```

This approach is sufficient while the document templates remain stable.

### Future Consideration

If legal or compliance requirements require an exact immutable copy of the originally generated document, the architecture should move toward stored PDF snapshots.

---

## 18. Prioritize Simplicity for the Portfolio MVP

### Decision

Avoid adding enterprise-level features unless they solve an identified requirement.

### Reason

The purpose of the project is to demonstrate strong full-stack engineering rather than maximize feature count.

The MVP therefore focuses on:

```text
Authentication
      ↓
Document Templates
      ↓
Dynamic Forms
      ↓
Validation
      ↓
Preview
      ↓
PDF Generation
      ↓
Persistence
      ↓
Document History
```

This provides a complete end-to-end workflow while keeping the architecture understandable.

---

## 19. Separate UI, Data, and PDF Responsibilities

### Decision

Keep major responsibilities in separate modules.

Examples include:

* UI components
* Document templates
* Database access
* Authentication
* PDF generation
* Shared types

### Reason

This reduces coupling and makes future changes safer.

For example, adding a new document template should not require rewriting authentication or database infrastructure.

---

## 20. Build Incrementally

### Decision

Develop the system in small, testable steps rather than building the entire application at once.

### Reason

Incremental development makes it easier to:

* Identify regressions
* Validate assumptions
* Review architecture decisions
* Preserve working functionality
* Understand the impact of changes

This also keeps the project maintainable as features are added.

---

## Summary

The overall architectural philosophy is:

> **Keep the system simple, secure, modular, and extensible enough for the current requirements.**

The project intentionally avoids unnecessary complexity while demonstrating the core skills expected from a modern full-stack application.

Future architectural changes should be driven by actual product requirements rather than complexity for its own sake.
