# BeforeYouSign - 5-Minute Demo Script

**Rule #1 of Demo Day:** Never freestyle. Stick exactly to this path. Do not click random buttons or prototype modules unless explicitly asked by a reviewer.

### Preparation (Before you screen share)
1. Ensure your local PostgreSQL database is running.
2. Ensure you have run `npm run dev` and your browser is on `localhost:3000`.
3. Have a sample, slightly risky NDA (e.g., PDF or DOCX) ready on your desktop.
4. Have the Network tab in Chrome DevTools closed (unless you want to show off the API payloads later).

---

### Minute 0:00 - Introduction & Login
*   **Action**: Start on the landing page. Click Login.
*   **Script**: *"Welcome to BeforeYouSign. Today I'll demonstrate how our platform transforms complex legal jargon into actionable intelligence. I'll start by logging into the secure dashboard."*

### Minute 0:45 - Document Upload
*   **Action**: Navigate to the Contract Analysis tool. Drag and drop your sample NDA into the `UploadDropzone`.
*   **Script**: *"Let's assume I am a freelancer who just received this NDA. I upload it to the platform. In the background, our API parses the document and streams the text to NVIDIA's Llama 3.1 405B model for deep semantic analysis."*

### Minute 1:30 - The Analysis Dashboard (Core Features)
*   **Action**: The `AnalysisResult` dashboard loads. Slowly scroll down to show the Overall Risk Score and the Red Flags section.
*   **Script**: *"Instantly, the system returns a comprehensive risk profile. As you can see, this contract has an overall risk score of [X], driven by these critical red flags. The AI has highlighted a highly restrictive non-compete clause that I might have missed manually."*

### Minute 2:30 - Semantic Retrieval (The ML Differentiator)
*   **Action**: Scroll to a specific clause (e.g., Liability or Non-Compete). Click the **"Find Similar Clauses"** button. Wait for the loading state to finish.
*   **Script**: *"But how do I know if this clause is actually unfair, or just standard industry practice? To solve this, we built a local machine learning retrieval engine. When I click this, the system generates a 384-dimensional vector embedding of this exact clause using a local transformer model."*
*   **Action**: Point to the LEDGAR Benchmark results that appear.
*   **Script**: *"It then runs a cosine similarity search against the LEDGAR legal dataset to find the closest historical matches. Here, we can see the LEDGAR Category Benchmark risk is [X], while my clause is rated [Y], giving us an objective variance. This grounds the AI's analysis in real-world legal data."*

### Minute 3:45 - The Contract Chat (RAG)
*   **Action**: Open the Chat interface on the side/bottom. Type: *"What happens if I breach the confidentiality terms?"*
*   **Script**: *"If I have a specific question, I can interrogate the document directly. Our conversational engine uses the contract context to provide immediate, precise answers without me having to read all 15 pages."*

### Minute 4:30 - Export & Persistence
*   **Action**: Click the Export to PDF/Word button. Show the downloaded file briefly. Then, navigate back to the main Repository/Dashboard to show the contract saved in the database.
*   **Script**: *"Finally, I can export this entire risk report to a clean PDF to share with my lawyer or team. All analyzed contracts and their metadata are securely persisted in our PostgreSQL database for future reference and portfolio management."*

### Minute 5:00 - Conclusion
*   **Action**: Stop sharing or return to the main dashboard.
*   **Script**: *"That concludes the core workflow: from opaque document to transparent, benchmarked legal intelligence in under five minutes. Thank you."*

---

### Contingency Plan (If they ask to see the Dashboards)
If a professor asks to see the Predictive Analytics or BI Dashboards:
*   **Action**: Click them, acknowledging the "PROTOTYPE MODULE" tag.
*   **Script**: *"These are our prototype modules designed for enterprise portfolio management. While the UI and charting logic are fully built, they currently visualize generated data to demonstrate the future scope of the platform once we scale the database."*
