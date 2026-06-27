# PDF Engine Compatibility Matrix

This document outlines the known capabilities and limitations of the native BeforeYouSign `PdfLibEngine` implementation. These constraints apply to all PDF operations (Merge, Split, Rotate, Image→PDF).

## Core Capabilities

| Feature    | Supported | Notes                       |
| ---------- | --------- | --------------------------- |
| Bookmarks  | Partial   | Merge and Split operations drop outlines/bookmarks. Rotate preserves them. |
| Forms      | Partial   | Forms are flattened to visual appearances before merge/split to prevent corruption. |
| Signatures | No        | Cryptographic signatures are invalidated/stripped upon any modification. |
| Encryption | No        | Encrypted files will be rejected with an `EncryptedPDFError`. |
| Metadata   | Yes       | Preserved or cloned where supported (Title, Author, Creator, CreationDate). |
| Images     | Yes       | JPEG and PNG embedded reliably. |

## Future Enhancements
If these limitations become a business blocker, the engine layer (`lib/pdf-engine`) is designed to be fully replaceable with a microservice or WASM-based engine (like PDFium or MuPDF) without modifying frontend or API logic.
