# PDF Engine Audit & Roadmap

## Library
`pdf-lib` (Current Backend)

## Strengths
- **Native Node.js Support:** Runs purely in JS/TS without native bindings or child processes.
- **Speed & Efficiency:** Capable of restructuring (splitting, rotating) files in under 200ms with negligible RAM overhead (<1MB).
- **Modification Support:** Natively supports embedding JPG/PNG and drawing vectors/text on pages.

## Weaknesses
- **AcroForm Merging:** The `copyPages` function drops root `AcroForm` dictionaries. Interactive forms are permanently flattened or destroyed during Merge or Split operations.
- **Bookmarks/Outlines:** The `Outlines` dictionary is not preserved during page extraction/merging, resulting in lost navigation bookmarks.
- **Raster Downsampling:** `pdf-lib` has zero capability to decode or re-encode raster images (JPG/PNG) embedded within a PDF stream. It cannot reduce DPI or quality.

## Impossible features
- **True PDF Compression:** High-ratio compression requires image downsampling. `pdf-lib` can only perform object-stream deflating (lossless).
- **PDF to JPG Extraction:** Requires a full PDF rasterizer (like Ghostscript, PDF.js, or Poppler) to paint PDF vectors/fonts onto an image canvas.
- **Form/Bookmark Preservation during Merge:** Architecturally impossible without extremely brittle low-level object graph manipulation.

## Commercial gap
| Capability | `pdf-lib` (Current) | ILovePDF / Commercial | Gap Severity |
| :--- | :--- | :--- | :--- |
| **Merge Interactive Forms** | Destroys Forms | Preserves & Merges Fields | **High** |
| **Merge Bookmarks** | Destroys Bookmarks | Merges Outlines | **High** |
| **Compress PDF** | ~5% (Lossless only) | 40-80% (Image downsampling) | **Critical** |
| **PDF to Image** | Impossible | Native Support | **Critical** |

## Recommendation
**Stabilize and Restrict.** 
Do not attempt to build a general-purpose PDF editor on `pdf-lib`. 
1. **Ship** Split, Rotate, JPG to PDF, and Merge (with clear UI limitations indicating forms/bookmarks are lost).
2. **Rename** Compress to "Optimize PDF (Lossless)".
3. **Disable** all other tools (PDF to JPG, Protect, Redact) until a new engine is deployed.

## Migration path
To close the commercial gap and compete with ILovePDF, the backend architecture must be migrated to a binary-based processor.

**Target Engine: Ghostscript + PDFtk**
- **Ghostscript:** Will unlock true image downsampling (Compress PDF) and perfect rasterization (PDF to JPG).
- **PDFtk (Server):** Will unlock flawless merging and splitting while perfectly preserving AcroForms and Bookmarks.

**Infrastructure Shift:**
Since Vercel/Next.js edge functions cannot easily run Ghostscript binaries, the PDF processing engine must be moved to an isolated **AWS Lambda (Container Image)** or an **ECS Fargate task** built on Alpine Linux with `ghostscript` and `pdftk` installed. The Next.js frontend will communicate with this microservice via presigned S3 URLs.
